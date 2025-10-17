/**
 * Every - Scheduling API with human-readable syntax via Proxy
 *
 * Provides intuitive scheduling patterns:
 * - every.hour($ => { ... })
 * - every.business.hour($ => { ... })
 * - every.minute.during.business.hours($ => { ... })
 * - every.monday($ => { ... })
 * - every.day.2am($ => { ... })
 *
 * @module every
 */

import type { BusinessContext, EveryService } from './types'

/**
 * Maximum number of schedules that can be created per context
 * to prevent resource exhaustion and protect against runaway schedule creation.
 *
 * This limit of 100 schedules per context is chosen to:
 * - Allow reasonable use cases (hourly/daily/weekly tasks across multiple services)
 * - Prevent accidental loops that create infinite schedules
 * - Protect backend resources from DoS-style attacks
 * - Stay within typical Cloudflare Workers cron trigger limits
 */
const MAX_SCHEDULES_PER_CONTEXT = 100

/**
 * Track schedule count per context for security limits
 *
 * Uses WeakMap to prevent memory leaks - entries are automatically garbage collected
 * when the BusinessContext is no longer referenced.
 *
 * Lifetime considerations:
 * - In Cloudflare Workers: BusinessContext typically exists for the duration of a request
 *   (short-lived), so counts reset between requests
 * - In long-lived contexts: Counts persist as long as the BusinessContext exists
 * - When BusinessContext is recreated: Counter resets to 0, allowing new schedules
 * - This is intentional behavior for per-request/per-context isolation
 */
const scheduleCountMap = new WeakMap<BusinessContext, number>()

/**
 * Store registered schedules per context
 * Uses WeakMap for automatic garbage collection
 *
 * Memory management considerations:
 * - WeakMap entries are garbage collected when BusinessContext is no longer referenced
 * - In short-lived contexts (typical Cloudflare Workers): Schedules are cleared after each request
 * - In long-lived contexts (singleton BusinessContext): Schedule registry grows indefinitely
 *   unless cancelled schedules are manually removed via clearCancelledSchedules()
 * - Each BusinessContext maintains its own isolated registry (no cross-context access)
 *
 * For production use with long-lived contexts:
 * - Call clearCancelledSchedules() periodically to prevent unbounded memory growth
 * - Consider persisting schedules to external storage (database/KV) instead of in-memory
 */
const scheduleRegistryMap = new WeakMap<BusinessContext, Map<string, Schedule>>()

/**
 * Safe logging helper that handles missing or incomplete logger implementations
 *
 * @param runtimeContext - Runtime context that may contain a logger
 * @param message - Message to log
 */
function safeLog(runtimeContext: BusinessContext, message: string): void {
  const logger = runtimeContext.logger ?? console
  if (logger && typeof logger.log === 'function') {
    logger.log(message)
  }
}

export interface ScheduleContext extends BusinessContext {
  schedule: {
    pattern: string
    cron: string
    description: string
    timestamp: Date
  }
  event: {
    type: 'scheduled'
    scheduledTime: Date
  }
}

export type ScheduleCallback = (context: ScheduleContext) => void | Promise<void>

/**
 * Represents a registered schedule
 *
 * @property id - Unique schedule identifier
 * @property pattern - Human-readable pattern (e.g., 'business.hour')
 * @property cron - Generated cron expression (e.g., '0 9-16 * * 1,2,3,4,5')
 * @property description - Human-readable description (e.g., 'every business hour (Mon-Fri 9 AM - 5 PM)')
 * @property callback - Callback function to execute on schedule (INTERNAL USE ONLY - do not call directly)
 * @property createdAt - Timestamp when schedule was created
 * @property status - Current schedule status ('active', 'paused', or 'cancelled')
 *
 * @remarks
 * The `callback` property stores the function for backend execution. It should NOT be called
 * directly by user code. The backend scheduler will invoke it at the appropriate times.
 * Accessing or calling this property outside the scheduling system may lead to unexpected behavior.
 */
export interface Schedule {
  id: string
  pattern: string
  cron: string
  description: string
  /** @internal Callback function stored for backend execution - do not call directly */
  callback: ScheduleCallback
  createdAt: Date
  status: 'active' | 'paused' | 'cancelled'
}

interface SchedulePattern {
  parts: string[]
}

/**
 * Business hours configuration (9 AM - 5 PM weekdays by default)
 *
 * Note: Cron hour ranges are inclusive. Hour 16 covers 4:00-4:59 PM,
 * so 9-16 = 9 AM to end of 4 PM hour (schedules run through 4:59 PM).
 * This represents standard 9-5 business hours where work ends at 5:00 PM.
 */
const BUSINESS_HOURS = {
  start: 9, // 9 AM (hour 9 = 9:00-9:59 AM)
  end: 16, // 4 PM (hour 16 = 4:00-4:59 PM, last hour before 5 PM close)
  days: [1, 2, 3, 4, 5], // Monday-Friday
}

/**
 * Convert a schedule pattern to cron syntax
 *
 * @param parts - Array of pattern parts (e.g., ['business', 'hour'])
 * @returns Cron expression string (e.g., '0 9-17 * * 1,2,3,4,5')
 * @example
 * patternToCron(['hour']) // '0 * * * *'
 * patternToCron(['business', 'hour']) // '0 9-17 * * 1,2,3,4,5'
 * patternToCron(['monday']) // '0 0 * * 1'
 */
function patternToCron(parts: string[]): string {
  // Day names mapping
  const dayNames: Record<string, number> = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  }

  // Time period mapping
  const periods: Record<string, string> = {
    minute: '* * * * *', // Every minute
    hour: '0 * * * *', // Every hour at :00
    day: '0 0 * * *', // Every day at midnight
    week: '0 0 * * 0', // Every Sunday at midnight
    month: '0 0 1 * *', // First day of month at midnight
    year: '0 0 1 1 *', // January 1st at midnight
  }

  // Check for business hours modifiers
  const hasBusiness = parts.includes('business')
  const hasHours = parts.includes('hours')

  // Check for specific day names
  for (const [day, num] of Object.entries(dayNames)) {
    if (parts.includes(day)) {
      return `0 0 * * ${num}` // That day at midnight
    }
  }

  // Check for time specifications (like "2am", "3pm")
  const timeMatch = parts.find((p) => /^\d{1,2}(am|pm)$/i.test(p))
  if (timeMatch) {
    const match = timeMatch.match(/^(\d{1,2})(am|pm)$/i)
    if (match) {
      let hour = parseInt(match[1])
      const period = match[2].toLowerCase()

      // Validate hour range (1-12 for am/pm format)
      if (hour < 1 || hour > 12) {
        throw new Error(`Invalid hour "${hour}" in time pattern "${timeMatch}". Hours must be between 1 and 12 for am/pm format.`)
      }

      if (period === 'pm' && hour !== 12) hour += 12
      if (period === 'am' && hour === 12) hour = 0
      return `0 ${hour} * * *` // Every day at that time
    }
  }

  // Check for business hours patterns
  if (hasBusiness && hasHours) {
    // every.business.hours or every.minute.during.business.hours
    if (parts.includes('minute')) {
      // Every minute during business hours (Mon-Fri 9 AM - 5 PM)
      return `* ${BUSINESS_HOURS.start}-${BUSINESS_HOURS.end} * * ${BUSINESS_HOURS.days.join(',')}`
    }
    if (parts.includes('hour')) {
      // Every hour during business hours
      return `0 ${BUSINESS_HOURS.start}-${BUSINESS_HOURS.end} * * ${BUSINESS_HOURS.days.join(',')}`
    }
    // Default: every business hour
    return `0 ${BUSINESS_HOURS.start}-${BUSINESS_HOURS.end} * * ${BUSINESS_HOURS.days.join(',')}`
  }

  if (hasBusiness && parts.includes('hour')) {
    // every.business.hour - same as business hours
    return `0 ${BUSINESS_HOURS.start}-${BUSINESS_HOURS.end} * * ${BUSINESS_HOURS.days.join(',')}`
  }

  if (hasBusiness && parts.includes('day')) {
    // every.business.day - weekdays at midnight
    return `0 0 * * ${BUSINESS_HOURS.days.join(',')}`
  }

  // Check for basic periods
  for (const [period, cron] of Object.entries(periods)) {
    if (parts.includes(period)) {
      return cron
    }
  }

  // Check for numeric intervals (like "every 5 minutes")
  const numericPart = parts.find((p) => /^\d+$/.test(p))
  if (numericPart) {
    const num = parseInt(numericPart)

    // Validate numeric intervals
    if (parts.includes('minutes') || parts.includes('minute')) {
      if (num < 1 || num > 59) {
        throw new Error(`Invalid minute interval "${num}". Minute intervals must be between 1 and 59.`)
      }
      return `*/${num} * * * *` // Every N minutes
    }
    if (parts.includes('hours') || parts.includes('hour')) {
      if (num < 1 || num > 23) {
        throw new Error(`Invalid hour interval "${num}". Hour intervals must be between 1 and 23.`)
      }
      return `0 */${num} * * *` // Every N hours
    }
    if (parts.includes('days') || parts.includes('day')) {
      if (num < 1 || num > 31) {
        throw new Error(`Invalid day interval "${num}". Day intervals must be between 1 and 31.`)
      }
      return `0 0 */${num} * *` // Every N days
    }
  }

  // Default to every hour if no pattern matched
  return '0 * * * *'
}

/**
 * Generate a human-readable description from pattern parts
 *
 * @param parts - Array of pattern parts
 * @returns Human-readable description string
 * @example
 * patternToDescription(['hour']) // 'every hour'
 * patternToDescription(['business', 'hour']) // 'every business hour (Mon-Fri 9 AM - 5 PM)'
 */
function patternToDescription(parts: string[]): string {
  if (parts.length === 0) return 'every hour'

  // Check for specific patterns
  const hasBusiness = parts.includes('business')
  const hasHours = parts.includes('hours')

  if (hasBusiness && hasHours) {
    if (parts.includes('minute')) {
      return 'every minute during business hours (Mon-Fri 9 AM - 5 PM)'
    }
    return 'every business hour (Mon-Fri 9 AM - 5 PM)'
  }

  if (hasBusiness && parts.includes('hour')) {
    return 'every business hour (Mon-Fri 9 AM - 5 PM)'
  }

  if (hasBusiness && parts.includes('day')) {
    return 'every business day (Mon-Fri)'
  }

  // Join parts with spaces for a readable description
  return 'every ' + parts.filter((p) => p !== 'during').join(' ')
}

/**
 * Create a Proxy that builds schedule patterns and executes callbacks
 *
 * @param runtimeContext - Runtime context with all services
 * @returns Proxy object that builds schedule patterns
 * @throws {TypeError} When callback is not a function
 * @throws {Error} When invalid cron pattern is generated
 * @throws {Error} When schedule limit is exceeded
 * @throws {Error} When invalid property is accessed
 * @example
 * const every = createEveryProxy(context)
 * every.hour($ => { console.log('Every hour') })
 * every.business.day($ => { console.log('Every business day') })
 */
export function createEveryProxy(runtimeContext: BusinessContext): EveryService {
  function buildProxy(pattern: SchedulePattern = { parts: [] }): EveryService {
    return new Proxy(
      function (callback: ScheduleCallback): Schedule {
        // Validate callback is a function
        if (typeof callback !== 'function') {
          throw new TypeError(`Schedule callback must be a function, got ${typeof callback}`)
        }

        // Check schedule limit for security
        const currentCount = scheduleCountMap.get(runtimeContext) || 0
        if (currentCount >= MAX_SCHEDULES_PER_CONTEXT) {
          throw new Error(`Maximum schedule limit reached (${MAX_SCHEDULES_PER_CONTEXT} schedules per context)`)
        }

        // This is called when the user invokes the function
        // e.g., every.hour($ => { ... })
        const cron = patternToCron(pattern.parts)
        const description = patternToDescription(pattern.parts)

        // Validate generated cron pattern
        const parsed = parseCron(cron)
        if (!parsed.valid) {
          throw new Error(`Invalid cron pattern generated: ${cron} from pattern: ${pattern.parts.join('.')}`)
        }

        // Increment schedule count
        scheduleCountMap.set(runtimeContext, currentCount + 1)

        // Generate unique schedule ID using crypto.randomUUID()
        // Provides cryptographically secure random UUID (RFC 4122 version 4)
        // Available in Cloudflare Workers and modern JavaScript environments
        const scheduleId = `schedule_${crypto.randomUUID()}`

        // Create schedule object
        const schedule: Schedule = {
          id: scheduleId,
          pattern: pattern.parts.join('.'),
          cron,
          description,
          callback,
          createdAt: new Date(),
          status: 'active',
        }

        // Store schedule in registry
        let registry = scheduleRegistryMap.get(runtimeContext)
        if (!registry) {
          registry = new Map()
          scheduleRegistryMap.set(runtimeContext, registry)
        }
        registry.set(scheduleId, schedule)

        // Log registration
        safeLog(runtimeContext, `Registered schedule: ${description}`)
        safeLog(runtimeContext, `Schedule ID: ${scheduleId}`)
        safeLog(runtimeContext, `Cron pattern: ${cron}`)

        // TODO: Implement actual backend registration via runtimeContext.api
        // Tracking: https://github.com/dot-do/platform/issues/493 (related to backend integration)
        //
        // Implementation needed:
        // 1. Create POST /schedules API endpoint in workers
        // 2. Persist schedule metadata (pattern, cron, description) to database
        // 3. Register cron triggers with Cloudflare Workers
        // 4. Serialize and store callback function for execution
        // 5. Implement schedule lifecycle management (list, update, cancel)
        //
        // Example API call:
        // const response = await runtimeContext.api.post('/schedules', {
        //   id: scheduleId,
        //   pattern: pattern.parts.join('.'),
        //   cron,
        //   description,
        //   callback: serializeCallback(callback)
        // })

        // Return the schedule object (do NOT execute callback immediately)
        return schedule
      } as EveryService,
      {
        get(target, prop: string | symbol) {
          // Handle symbols explicitly (return undefined for non-string properties)
          if (typeof prop === 'symbol') {
            return undefined
          }

          // Special handling for promise-like behavior
          if (prop === 'then' || prop === 'catch' || prop === 'finally') {
            return undefined
          }

          // Add the property to the pattern and return a new proxy
          // Note: Validation happens in patternToCron() where invalid patterns default to "every hour"
          const newPattern: SchedulePattern = {
            parts: [...pattern.parts, prop],
          }
          return buildProxy(newPattern)
        },
      }
    ) as EveryService
  }

  return buildProxy()
}

/**
 * Parse and validate cron expressions
 *
 * @param cron - Cron expression string (must have 5 fields)
 * @returns Object with validation result and parsed fields
 * @example
 * parseCron('* * * * *') // { valid: true, minute: '*', hour: '*', ... }
 * parseCron('0 9-17 * * 1,2,3,4,5') // { valid: true, minute: '0', hour: '9-17', ... }
 * parseCron('invalid') // { valid: false }
 */
export function parseCron(cron: string): {
  valid: boolean
  minute?: string
  hour?: string
  dayOfMonth?: string
  month?: string
  dayOfWeek?: string
} {
  const parts = cron.trim().split(/\s+/)
  if (parts.length !== 5) {
    return { valid: false }
  }

  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts

  // Helper to validate a cron field value is within range
  const isValidField = (field: string, min: number, max: number): boolean => {
    // Wildcard is always valid
    if (field === '*') return true

    // Handle intervals (*/5, 10-20/5, etc.)
    if (field.includes('/')) {
      const [base, intervalStr] = field.split('/')
      const interval = parseInt(intervalStr)
      if (isNaN(interval) || interval < 1) return false

      // Validate base
      if (base === '*') return true
      if (base.includes('-')) {
        const [startStr, endStr] = base.split('-')
        const start = parseInt(startStr)
        const end = parseInt(endStr)
        if (isNaN(start) || isNaN(end)) return false
        if (start < min || end > max || start > end) return false
        return true
      }
      const baseNum = parseInt(base)
      if (isNaN(baseNum) || baseNum < min || baseNum > max) return false
      return true
    }

    // Handle ranges (9-17)
    if (field.includes('-')) {
      const [startStr, endStr] = field.split('-')
      const start = parseInt(startStr)
      const end = parseInt(endStr)
      if (isNaN(start) || isNaN(end)) return false
      if (start < min || end > max || start > end) return false
      return true
    }

    // Handle comma-separated lists (1,2,3,4,5)
    if (field.includes(',')) {
      const values = field.split(',').map((v) => parseInt(v))
      return values.every((v) => !isNaN(v) && v >= min && v <= max)
    }

    // Handle single value
    const value = parseInt(field)
    if (isNaN(value)) return false
    return value >= min && value <= max
  }

  // Validate each field with appropriate ranges
  if (!isValidField(minute, 0, 59)) return { valid: false }
  if (!isValidField(hour, 0, 23)) return { valid: false }
  if (!isValidField(dayOfMonth, 1, 31)) return { valid: false }
  if (!isValidField(month, 1, 12)) return { valid: false }
  if (!isValidField(dayOfWeek, 0, 6)) return { valid: false }

  return {
    valid: true,
    minute,
    hour,
    dayOfMonth,
    month,
    dayOfWeek,
  }
}

/**
 * Check if a time matches a cron pattern
 *
 * @param cron - Cron expression to match against
 * @param date - Date to check (defaults to current time)
 * @returns true if the date matches the cron pattern
 * @example
 * ```
 * matchesCron('0 * * * *', new Date('2025-01-13T10:00:00')) // true
 * matchesCron('0 9-17 * * 1,2,3,4,5', new Date('2025-01-13T10:00:00')) // true (Monday 10 AM)
 * matchesCron('* /5 * * * *', new Date('2025-01-13T10:05:00')) // true (every 5 minutes)
 * ```
 */
export function matchesCron(cron: string, date: Date = new Date()): boolean {
  const parsed = parseCron(cron)
  if (!parsed.valid) {
    console.warn(`Invalid cron pattern: "${cron}". Expected format: "minute hour dayOfMonth month dayOfWeek" (5 fields)`)
    return false
  }

  // Use local time methods to match how cron schedules are typically specified
  // Cron expressions run in the server's local timezone
  const minute = date.getMinutes()
  const hour = date.getHours()
  const dayOfMonth = date.getDate()
  const month = date.getMonth() + 1 // JS months are 0-indexed
  const dayOfWeek = date.getDay()

  // Helper to check if a value matches a cron field
  const matches = (value: number, field: string): boolean => {
    if (field === '*') return true

    // Handle interval patterns: */5, 10-20/5, etc.
    if (field.includes('/')) {
      const [base, intervalStr] = field.split('/')
      const interval = parseInt(intervalStr)

      // Handle range with interval: 10-20/5
      if (base.includes('-')) {
        const [startStr, endStr] = base.split('-')
        const start = parseInt(startStr)
        const end = parseInt(endStr)
        return value >= start && value <= end && (value - start) % interval === 0
      }

      // Handle wildcard with interval: */5
      if (base === '*') {
        return value % interval === 0
      }

      // Handle numeric base with interval: 10/5 (uncommon but valid)
      const baseNum = parseInt(base)
      return value >= baseNum && (value - baseNum) % interval === 0
    }

    // Handle range patterns: 9-17
    if (field.includes('-')) {
      const [startStr, endStr] = field.split('-')
      const start = parseInt(startStr)
      const end = parseInt(endStr)

      // Validate parsed values
      if (isNaN(start) || isNaN(end)) {
        console.warn(`Invalid range values in cron pattern: "${field}"`)
        return false
      }

      // Validate range order (start should be <= end)
      if (start > end) {
        console.warn(`Invalid range in cron pattern: "${field}" (start > end)`)
        return false
      }

      return value >= start && value <= end
    }

    // Handle comma-separated lists: 1,2,3,4,5
    if (field.includes(',')) {
      return field
        .split(',')
        .map((n) => parseInt(n))
        .includes(value)
    }

    // Handle exact match: 5
    return value === parseInt(field)
  }

  return (
    matches(minute, parsed.minute!) &&
    matches(hour, parsed.hour!) &&
    matches(dayOfMonth, parsed.dayOfMonth!) &&
    matches(month, parsed.month!) &&
    matches(dayOfWeek, parsed.dayOfWeek!)
  )
}

/**
 * List all registered schedules for a context
 *
 * @param runtimeContext - Runtime context to get schedules from
 * @returns Array of all registered schedules
 * @example
 * const schedules = listSchedules(context)
 * console.log(`Found ${schedules.length} schedules`)
 */
export function listSchedules(runtimeContext: BusinessContext): Schedule[] {
  const registry = scheduleRegistryMap.get(runtimeContext)
  if (!registry) {
    return []
  }
  return Array.from(registry.values())
}

/**
 * Get a specific schedule by ID
 *
 * @param runtimeContext - Runtime context to get schedule from
 * @param scheduleId - ID of the schedule to retrieve
 * @returns Schedule object or undefined if not found
 * @example
 * const schedule = getSchedule(context, 'schedule_123')
 * if (schedule) {
 *   console.log(`Schedule: ${schedule.description}`)
 * }
 */
export function getSchedule(runtimeContext: BusinessContext, scheduleId: string): Schedule | undefined {
  const registry = scheduleRegistryMap.get(runtimeContext)
  if (!registry) {
    return undefined
  }
  return registry.get(scheduleId)
}

/**
 * Cancel a schedule by ID
 *
 * @param runtimeContext - Runtime context containing the schedule
 * @param scheduleId - ID of the schedule to cancel
 * @returns true if schedule was cancelled, false if not found
 * @throws Error if schedule ID is invalid
 * @example
 * const cancelled = cancelSchedule(context, 'schedule_123')
 * if (cancelled) {
 *   console.log('Schedule cancelled successfully')
 * }
 */
export function cancelSchedule(runtimeContext: BusinessContext, scheduleId: string): boolean {
  if (!scheduleId || typeof scheduleId !== 'string') {
    throw new Error('Schedule ID must be a non-empty string')
  }

  const registry = scheduleRegistryMap.get(runtimeContext)
  if (!registry) {
    return false
  }

  const schedule = registry.get(scheduleId)
  if (!schedule) {
    return false
  }

  // Update schedule status
  schedule.status = 'cancelled'

  // Log cancellation
  safeLog(runtimeContext, `Cancelled schedule: ${schedule.description} (ID: ${scheduleId})`)

  // TODO: Implement backend API call to cancel schedule
  // await runtimeContext.api.delete(`/schedules/${scheduleId}`)

  return true
}

/**
 * Pause a schedule by ID
 *
 * @param runtimeContext - Runtime context containing the schedule
 * @param scheduleId - ID of the schedule to pause
 * @returns true if schedule was paused, false if not found
 * @throws Error if schedule ID is invalid
 * @example
 * const paused = pauseSchedule(context, 'schedule_123')
 * if (paused) {
 *   console.log('Schedule paused successfully')
 * }
 */
export function pauseSchedule(runtimeContext: BusinessContext, scheduleId: string): boolean {
  if (!scheduleId || typeof scheduleId !== 'string') {
    throw new Error('Schedule ID must be a non-empty string')
  }

  const registry = scheduleRegistryMap.get(runtimeContext)
  if (!registry) {
    return false
  }

  const schedule = registry.get(scheduleId)
  if (!schedule) {
    return false
  }

  // Update schedule status
  schedule.status = 'paused'

  // Log pause
  safeLog(runtimeContext, `Paused schedule: ${schedule.description} (ID: ${scheduleId})`)

  // TODO: Implement backend API call to pause schedule
  // await runtimeContext.api.patch(`/schedules/${scheduleId}`, { status: 'paused' })

  return true
}

/**
 * Resume a paused schedule by ID
 *
 * @param runtimeContext - Runtime context containing the schedule
 * @param scheduleId - ID of the schedule to resume
 * @returns true if schedule was resumed, false if not found
 * @throws Error if schedule ID is invalid
 * @example
 * const resumed = resumeSchedule(context, 'schedule_123')
 * if (resumed) {
 *   console.log('Schedule resumed successfully')
 * }
 */
export function resumeSchedule(runtimeContext: BusinessContext, scheduleId: string): boolean {
  if (!scheduleId || typeof scheduleId !== 'string') {
    throw new Error('Schedule ID must be a non-empty string')
  }

  const registry = scheduleRegistryMap.get(runtimeContext)
  if (!registry) {
    return false
  }

  const schedule = registry.get(scheduleId)
  if (!schedule) {
    return false
  }

  // Update schedule status
  schedule.status = 'active'

  // Log resume
  safeLog(runtimeContext, `Resumed schedule: ${schedule.description} (ID: ${scheduleId})`)

  // TODO: Implement backend API call to resume schedule
  // await runtimeContext.api.patch(`/schedules/${scheduleId}`, { status: 'active' })

  return true
}

/**
 * Remove cancelled schedules from the registry to free up memory
 *
 * This is useful for long-lived BusinessContext instances where cancelled schedules
 * can accumulate over time. Call this periodically to prevent unbounded memory growth.
 *
 * **When to use**: In long-lived contexts (e.g., singleton BusinessContext instances,
 * long-running servers, or processes that create many schedules over time), cancelled
 * schedules remain in memory until the context is garbage collected. Call this function
 * periodically (e.g., after processing a batch of operations, on a timer, or when
 * approaching memory limits) to reclaim memory.
 *
 * **Not needed for**: Short-lived contexts (typical Cloudflare Workers requests) where
 * the entire context is garbage collected after each request.
 *
 * @param runtimeContext - Business context to clean up
 * @returns Number of cancelled schedules that were removed
 * @example
 * // Clean up periodically in long-lived contexts
 * const removed = clearCancelledSchedules(context)
 * console.log(`Cleaned up ${removed} cancelled schedules`)
 *
 * @example
 * // Clean up when threshold is reached
 * if (listSchedules(context).length > 1000) {
 *   clearCancelledSchedules(context)
 * }
 */
export function clearCancelledSchedules(runtimeContext: BusinessContext): number {
  const registry = scheduleRegistryMap.get(runtimeContext)
  if (!registry) {
    return 0
  }

  let removedCount = 0
  for (const [id, schedule] of registry.entries()) {
    if (schedule.status === 'cancelled') {
      registry.delete(id)
      removedCount++
    }
  }

  // Log cleanup if any schedules were removed
  if (removedCount > 0) {
    safeLog(runtimeContext, `Cleaned up ${removedCount} cancelled schedules from registry`)
  }

  return removedCount
}
