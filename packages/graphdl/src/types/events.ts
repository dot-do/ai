/**
 * 5W1H Business Event Types
 *
 * Every business event must answer: Who, What, When, Where, Why, How
 *
 * This provides a consistent structure for all business events across the platform,
 * ensuring semantic clarity and enabling rich querying and analytics.
 */

import { z } from 'zod'
import { nanoid } from 'nanoid'

/**
 * Actor Types - Who performed the action?
 */

export const PersonSchema = z.object({
  $type: z.literal('Person'),
  $id: z.string(),
  name: z.string(),
  email: z.string().email().optional(),
  identifier: z.string().optional(), // Additional identifier (employee ID, etc.)
})

export type Person = z.infer<typeof PersonSchema>

export const OrganizationSchema = z.object({
  $type: z.literal('Organization'),
  $id: z.string(),
  name: z.string(),
  legalName: z.string().optional(),
  taxID: z.string().optional(),
  duns: z.string().optional(), // D-U-N-S Number
})

export type Organization = z.infer<typeof OrganizationSchema>

export const AgentSchema = z.object({
  $type: z.literal('Agent'),
  $id: z.string(),
  role: z.string(), // e.g., 'sdr', 'customer-support', 'accountant'
  name: z.string(),
  capabilities: z.array(z.string()).optional(),
})

export type Agent = z.infer<typeof AgentSchema>

export const SystemSchema = z.object({
  $type: z.literal('System'),
  $id: z.string(),
  name: z.string(),
  version: z.string().optional(),
})

export type System = z.infer<typeof SystemSchema>

export const ActorSchema = z.discriminatedUnion('$type', [PersonSchema, OrganizationSchema, AgentSchema, SystemSchema])

export type Actor = z.infer<typeof ActorSchema>

/**
 * Temporal Types - When did it happen?
 */

// ISO 8601 timestamp
export const ISO8601TimestampSchema = z.string().datetime()
export type ISO8601Timestamp = z.infer<typeof ISO8601TimestampSchema>

/**
 * Cron expression for scheduled events
 *
 * Supports:
 * - Standard cron format: "0 0 * * *" (5 fields: minute hour day month weekday)
 * - Extended format with seconds: "0 0 0 * * *" (6 fields)
 * - Extended format with year: "0 0 0 * * * *" (7 fields)
 * - Named schedules: @yearly, @monthly, @weekly, @daily, @hourly, @reboot
 * - Interval notation: @every 5m, @every 1h, @every 30s
 *
 * Examples:
 * - "0 0 * * *" - Daily at midnight
 * - "0 9 * * 1" - Every Monday at 9am
 * - "@daily" - Same as "0 0 * * *"
 * - "@every 15m" - Every 15 minutes
 */
const CRON_EXPRESSION_PATTERN =
  /^(@(annually|yearly|monthly|weekly|daily|hourly|reboot))|(@every (\d+(ns|us|µs|ms|s|m|h))+)|((((\d+,)+\d+|(\d+(\/|-)\d+)|\d+|\*) ?){5,7})$/
export const CronExpressionSchema = z.string().regex(CRON_EXPRESSION_PATTERN, 'Invalid cron expression format')
export type CronExpression = z.infer<typeof CronExpressionSchema>

// Recurring pattern
export const RecurringPatternSchema = z.object({
  frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
  interval: z.number().int().positive().optional(), // e.g., every 2 weeks
  daysOfWeek: z.array(z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'])).optional(),
  dayOfMonth: z.number().int().min(1).max(31).optional(),
  monthOfYear: z.number().int().min(1).max(12).optional(),
})
export type RecurringPattern = z.infer<typeof RecurringPatternSchema>

export const TemporalSchema = z.union([ISO8601TimestampSchema, CronExpressionSchema, RecurringPatternSchema])

export type Temporal = z.infer<typeof TemporalSchema>

/**
 * Location Types - Where did it happen?
 */

export const PhysicalAddressSchema = z.object({
  streetAddress: z.string().optional(),
  addressLocality: z.string().optional(), // city
  addressRegion: z.string().optional(), // state/province
  postalCode: z.string().optional(),
  addressCountry: z.string().optional(), // ISO 3166-1 alpha-2 country code
})

export type PhysicalAddress = z.infer<typeof PhysicalAddressSchema>

export const DigitalLocationSchema = z.object({
  platform: z.string().optional(), // e.g., 'email', 'slack', 'web'
  url: z.string().url().optional(),
  ipAddress: z.string().ip().optional(),
  hostname: z.string().optional(),
})

export type DigitalLocation = z.infer<typeof DigitalLocationSchema>

export const LocationSchema = z
  .object({
    $type: z.literal('Location'),
    gln: z
      .string()
      .regex(/^\d{13}$/)
      .optional(), // Global Location Number (GS1) - exactly 13 digits
    address: PhysicalAddressSchema.optional(),
    digital: DigitalLocationSchema.optional(),
    coordinates: z
      .object({
        latitude: z.number().min(-90).max(90),
        longitude: z.number().min(-180).max(180),
      })
      .optional(),
  })
  .refine((data) => data.gln || data.address || data.digital || data.coordinates, {
    message: 'At least one location field (gln, address, digital, or coordinates) must be provided',
  })

export type Location = z.infer<typeof LocationSchema>

/**
 * Purpose Types - Why did it happen?
 */

export const PurposeSchema = z.object({
  reason: z.string(), // Primary reason (e.g., 'customer-purchase', 'scheduled-maintenance')
  trigger: z.string().optional(), // What triggered this event (e.g., 'checkout-completed', 'cron-schedule')
  goal: z.string().optional(), // What is the intended outcome (e.g., 'fulfill-order', 'reduce-churn')
  context: z.record(z.string(), z.unknown()).optional(), // Additional context
})

export type Purpose = z.infer<typeof PurposeSchema>

/**
 * Method Types - How did it happen?
 */

export const MethodSchema = z.object({
  method: z.enum(['manual', 'automated', 'workflow', 'api', 'cli', 'ui']),
  workflow: z.string().optional(), // Workflow identifier if method is 'workflow'
  automation: z.string().optional(), // Automation identifier if method is 'automated'
  apiEndpoint: z.string().optional(), // API endpoint if method is 'api'
  tooling: z.array(z.string()).optional(), // Tools/services used
})

export type Method = z.infer<typeof MethodSchema>

/**
 * BusinessEvent - The complete 5W1H event type
 */

export const BusinessEventSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    $type: z.literal('BusinessEvent'),
    $id: z.string(),

    // Who performed the action?
    who: ActorSchema,

    // What happened?
    what: dataSchema,

    // When did it happen?
    when: TemporalSchema,

    // Where did it happen?
    where: LocationSchema,

    // Why did it happen?
    why: PurposeSchema,

    // How did it happen?
    how: MethodSchema,

    // Additional context
    context: z.record(z.string(), z.unknown()).optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
  })

export type BusinessEvent<T = unknown> = {
  $type: 'BusinessEvent'
  $id: string
  who: Actor
  what: T
  when: Temporal
  where: Location
  why: Purpose
  how: Method
  context?: Record<string, unknown>
  metadata?: Record<string, unknown>
}

/**
 * Helper function to create a BusinessEvent
 */
export function createBusinessEvent<T>(params: {
  id?: string
  who: Actor
  what: T
  when?: Temporal
  where: Location
  why: Purpose
  how: Method
  context?: Record<string, unknown>
  metadata?: Record<string, unknown>
}): BusinessEvent<T> {
  return {
    $type: 'BusinessEvent',
    $id: params.id || nanoid(),
    who: params.who,
    what: params.what,
    when: params.when || new Date().toISOString(),
    where: params.where,
    why: params.why,
    how: params.how,
    context: params.context,
    metadata: params.metadata,
  }
}

/**
 * Helper function to validate a BusinessEvent against a schema
 */
export function validateBusinessEvent<T>(
  event: BusinessEvent<T>,
  dataSchema: z.ZodTypeAny
): { success: true; data: BusinessEvent<T> } | { success: false; error: z.ZodError } {
  const result = BusinessEventSchema(dataSchema).safeParse(event)
  if (result.success) {
    return { success: true, data: result.data as BusinessEvent<T> }
  }
  return { success: false, error: result.error }
}

/**
 * Type guard to check if an object is a BusinessEvent
 */
export function isBusinessEvent(obj: unknown): obj is BusinessEvent {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    '$type' in obj &&
    obj.$type === 'BusinessEvent' &&
    '$id' in obj &&
    'who' in obj &&
    'what' in obj &&
    'when' in obj &&
    'where' in obj &&
    'why' in obj &&
    'how' in obj
  )
}

/**
 * Helper to create common actor types
 */
export const createPerson = (params: { id: string; name: string; email?: string; identifier?: string }): Person => {
  const person = {
    $type: 'Person' as const,
    $id: params.id,
    name: params.name,
    email: params.email,
    identifier: params.identifier,
  }
  return PersonSchema.parse(person)
}

export const createOrganization = (params: { id: string; name: string; legalName?: string; taxID?: string; duns?: string }): Organization => {
  const organization = {
    $type: 'Organization' as const,
    $id: params.id,
    name: params.name,
    legalName: params.legalName,
    taxID: params.taxID,
    duns: params.duns,
  }
  return OrganizationSchema.parse(organization)
}

export const createAgent = (params: { id: string; role: string; name: string; capabilities?: string[] }): Agent => {
  const agent = {
    $type: 'Agent' as const,
    $id: params.id,
    role: params.role,
    name: params.name,
    capabilities: params.capabilities,
  }
  return AgentSchema.parse(agent)
}

export const createSystem = (params: { id: string; name: string; version?: string }): System => {
  const system = {
    $type: 'System' as const,
    $id: params.id,
    name: params.name,
    version: params.version,
  }
  return SystemSchema.parse(system)
}

/**
 * Helper to create location
 */
export const createLocation = (params: {
  gln?: string
  address?: PhysicalAddress
  digital?: DigitalLocation
  coordinates?: { latitude: number; longitude: number }
}): Location => {
  const location = {
    $type: 'Location' as const,
    gln: params.gln,
    address: params.address,
    digital: params.digital,
    coordinates: params.coordinates,
  }
  return LocationSchema.parse(location)
}
