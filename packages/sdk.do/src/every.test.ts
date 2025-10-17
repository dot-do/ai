/**
 * Tests for Every scheduling API
 */

import { describe, test, expect, vi } from 'vitest'
import {
  createEveryProxy,
  parseCron,
  matchesCron,
  listSchedules,
  getSchedule,
  cancelSchedule,
  pauseSchedule,
  resumeSchedule,
  clearCancelledSchedules,
  ScheduleContext,
  ScheduleCallback,
  Schedule,
} from './every'
import type { RuntimeContext } from './types'

/**
 * Helper function to create a fresh test context
 * Avoids state pollution between tests
 */
function createFreshTestContext(): RuntimeContext {
  return {
    db: {} as any,
    ai: {} as any,
    api: {} as any,
    auth: {} as any,
    on: {} as any,
    send: {} as any,
    every: {} as any,
    decide: {} as any,
    user: {} as any,
  }
}

// Mock runtime context
const mockRuntimeContext: RuntimeContext = createFreshTestContext()

describe('parseCron', () => {
  test('validates valid cron expressions', () => {
    const result = parseCron('* * * * *')
    expect(result.valid).toBe(true)
    expect(result.minute).toBe('*')
    expect(result.hour).toBe('*')
    expect(result.dayOfMonth).toBe('*')
    expect(result.month).toBe('*')
    expect(result.dayOfWeek).toBe('*')
  })

  test('validates business hour cron', () => {
    const result = parseCron('0 9-16 * * 1,2,3,4,5')
    expect(result.valid).toBe(true)
    expect(result.minute).toBe('0')
    expect(result.hour).toBe('9-16')
    expect(result.dayOfWeek).toBe('1,2,3,4,5')
  })

  test('rejects invalid cron with wrong number of fields', () => {
    expect(parseCron('* * * *').valid).toBe(false)
    expect(parseCron('* * * * * *').valid).toBe(false)
    expect(parseCron('').valid).toBe(false)
  })

  test('handles various cron patterns', () => {
    expect(parseCron('0 * * * *').valid).toBe(true) // Every hour
    expect(parseCron('*/5 * * * *').valid).toBe(true) // Every 5 minutes
    expect(parseCron('0 0 * * 0').valid).toBe(true) // Sunday midnight
    expect(parseCron('0 2 * * *').valid).toBe(true) // 2 AM daily
  })

  describe('value range validation', () => {
    test('rejects invalid minute values', () => {
      expect(parseCron('60 * * * *').valid).toBe(false) // Minutes: 0-59
      expect(parseCron('-1 * * * *').valid).toBe(false)
      expect(parseCron('99 * * * *').valid).toBe(false)
    })

    test('rejects invalid hour values', () => {
      expect(parseCron('0 24 * * *').valid).toBe(false) // Hours: 0-23
      expect(parseCron('0 -1 * * *').valid).toBe(false)
      expect(parseCron('0 99 * * *').valid).toBe(false)
    })

    test('rejects invalid day of month values', () => {
      expect(parseCron('0 0 0 * *').valid).toBe(false) // Days: 1-31
      expect(parseCron('0 0 32 * *').valid).toBe(false)
      expect(parseCron('0 0 99 * *').valid).toBe(false)
    })

    test('rejects invalid month values', () => {
      expect(parseCron('0 0 * 0 *').valid).toBe(false) // Months: 1-12
      expect(parseCron('0 0 * 13 *').valid).toBe(false)
      expect(parseCron('0 0 * 99 *').valid).toBe(false)
    })

    test('rejects invalid day of week values', () => {
      expect(parseCron('0 0 * * 7').valid).toBe(false) // Days of week: 0-6
      expect(parseCron('0 0 * * -1').valid).toBe(false)
      expect(parseCron('0 0 * * 99').valid).toBe(false)
    })

    test('validates ranges properly', () => {
      expect(parseCron('0 9-17 * * *').valid).toBe(true) // Valid range
      expect(parseCron('0 17-9 * * *').valid).toBe(false) // Invalid: start > end
      expect(parseCron('0 25-30 * * *').valid).toBe(false) // Invalid: out of range
      expect(parseCron('60-70 * * * *').valid).toBe(false) // Invalid minutes range
    })

    test('validates intervals properly', () => {
      expect(parseCron('*/5 * * * *').valid).toBe(true) // Valid interval
      expect(parseCron('*/60 * * * *').valid).toBe(true) // Edge case: exactly at max
      expect(parseCron('*/0 * * * *').valid).toBe(false) // Invalid: interval must be >= 1
      expect(parseCron('*/-1 * * * *').valid).toBe(false) // Invalid: negative interval
    })

    test('validates range with intervals', () => {
      expect(parseCron('10-20/5 * * * *').valid).toBe(true) // Valid
      expect(parseCron('60-70/5 * * * *').valid).toBe(false) // Invalid: out of range
      expect(parseCron('20-10/5 * * * *').valid).toBe(false) // Invalid: start > end
    })

    test('validates comma-separated lists', () => {
      expect(parseCron('0 * * * 1,2,3,4,5').valid).toBe(true) // Valid weekdays
      expect(parseCron('0 * * * 1,2,7').valid).toBe(false) // Invalid: 7 not in 0-6
      expect(parseCron('0 9,10,11,25 * * *').valid).toBe(false) // Invalid: 25 not in 0-23
    })
  })
})

describe('matchesCron', () => {
  describe('basic patterns', () => {
    test('matches all (*) pattern', () => {
      const date = new Date('2025-01-13T10:30:00Z')
      expect(matchesCron('* * * * *', date)).toBe(true)
    })

    test('matches specific minute', () => {
      const date = new Date('2025-01-13T10:30:00Z')
      expect(matchesCron('30 * * * *', date)).toBe(true)
      expect(matchesCron('15 * * * *', date)).toBe(false)
    })

    test('matches specific hour', () => {
      const date = new Date('2025-01-13T10:30:00Z')
      expect(matchesCron('* 10 * * *', date)).toBe(true)
      expect(matchesCron('* 15 * * *', date)).toBe(false)
    })

    test('matches specific day of month', () => {
      const date = new Date('2025-01-13T10:30:00Z')
      expect(matchesCron('* * 13 * *', date)).toBe(true)
      expect(matchesCron('* * 15 * *', date)).toBe(false)
    })

    test('matches specific month', () => {
      const date = new Date('2025-01-13T10:30:00Z')
      expect(matchesCron('* * * 1 *', date)).toBe(true)
      expect(matchesCron('* * * 2 *', date)).toBe(false)
    })

    test('matches specific day of week', () => {
      const monday = new Date('2025-01-13T10:00:00Z') // Monday
      expect(matchesCron('* * * * 1', monday)).toBe(true)
      expect(matchesCron('* * * * 0', monday)).toBe(false)
    })
  })

  describe('range patterns', () => {
    test('matches hour ranges', () => {
      const morning = new Date('2025-01-13T10:00:00Z')
      const evening = new Date('2025-01-13T18:00:00Z')

      expect(matchesCron('0 9-16 * * *', morning)).toBe(true)
      expect(matchesCron('0 9-16 * * *', evening)).toBe(false)
    })

    test('matches minute ranges', () => {
      const date1 = new Date('2025-01-13T10:15:00Z')
      const date2 = new Date('2025-01-13T10:45:00Z')

      expect(matchesCron('10-20 * * * *', date1)).toBe(true)
      expect(matchesCron('10-20 * * * *', date2)).toBe(false)
    })
  })

  describe('interval patterns', () => {
    test('matches simple minute intervals', () => {
      const date0 = new Date('2025-01-13T10:00:00Z')
      const date5 = new Date('2025-01-13T10:05:00Z')
      const date7 = new Date('2025-01-13T10:07:00Z')

      expect(matchesCron('*/5 * * * *', date0)).toBe(true)
      expect(matchesCron('*/5 * * * *', date5)).toBe(true)
      expect(matchesCron('*/5 * * * *', date7)).toBe(false)
    })

    test('matches hour intervals', () => {
      const date0 = new Date('2025-01-13T00:00:00Z')
      const date4 = new Date('2025-01-13T04:00:00Z')
      const date5 = new Date('2025-01-13T05:00:00Z')

      expect(matchesCron('0 */4 * * *', date0)).toBe(true)
      expect(matchesCron('0 */4 * * *', date4)).toBe(true)
      expect(matchesCron('0 */4 * * *', date5)).toBe(false)
    })

    test('matches range with intervals', () => {
      const date10 = new Date('2025-01-13T10:10:00Z')
      const date15 = new Date('2025-01-13T10:15:00Z')
      const date8 = new Date('2025-01-13T10:08:00Z')
      const date25 = new Date('2025-01-13T10:25:00Z')

      expect(matchesCron('10-20/5 * * * *', date10)).toBe(true)
      expect(matchesCron('10-20/5 * * * *', date15)).toBe(true)
      expect(matchesCron('10-20/5 * * * *', date8)).toBe(false)
      expect(matchesCron('10-20/5 * * * *', date25)).toBe(false)
    })
  })

  describe('comma-separated values', () => {
    test('matches weekdays', () => {
      const monday = new Date('2025-01-13T10:00:00Z')
      const saturday = new Date('2025-01-11T10:00:00')

      expect(matchesCron('0 9-17 * * 1,2,3,4,5', monday)).toBe(true)
      expect(matchesCron('0 9-17 * * 1,2,3,4,5', saturday)).toBe(false)
    })

    test('matches specific hours', () => {
      const date9 = new Date('2025-01-13T09:00:00Z')
      const date12 = new Date('2025-01-13T12:00:00Z')
      const date10 = new Date('2025-01-13T10:00:00Z')

      expect(matchesCron('0 9,12,17 * * *', date9)).toBe(true)
      expect(matchesCron('0 9,12,17 * * *', date12)).toBe(true)
      expect(matchesCron('0 9,12,17 * * *', date10)).toBe(false)
    })
  })

  describe('business hours', () => {
    test('matches business hours on weekdays', () => {
      const mondayMorning = new Date('2025-01-13T10:00:00Z')
      const fridayAfternoon = new Date('2025-01-17T15:00:00Z')
      const saturdayMorning = new Date('2025-01-18T10:00:00Z')
      const mondayEvening = new Date('2025-01-13T18:00:00Z')

      expect(matchesCron('0 9-16 * * 1,2,3,4,5', mondayMorning)).toBe(true)
      expect(matchesCron('0 9-16 * * 1,2,3,4,5', fridayAfternoon)).toBe(true)
      expect(matchesCron('0 9-16 * * 1,2,3,4,5', saturdayMorning)).toBe(false)
      expect(matchesCron('0 9-16 * * 1,2,3,4,5', mondayEvening)).toBe(false)
    })
  })

  test('returns false for invalid cron expressions', () => {
    const date = new Date('2025-01-13T10:00:00Z')
    expect(matchesCron('invalid', date)).toBe(false)
    expect(matchesCron('* * * *', date)).toBe(false)
  })

  describe('edge case handling', () => {
    test('handles invalid range values gracefully', () => {
      const date = new Date('2025-01-13T10:00:00Z')
      // Invalid ranges should return false (caught by our NaN checks)
      expect(matchesCron('0 abc-xyz * * *', date)).toBe(false)
      expect(matchesCron('0 9- * * *', date)).toBe(false)
      expect(matchesCron('0 -17 * * *', date)).toBe(false)
    })

    test('handles backward ranges (start > end)', () => {
      const date = new Date('2025-01-13T10:00:00Z')
      // Our validation now catches these
      expect(matchesCron('0 17-9 * * *', date)).toBe(false)
      expect(matchesCron('30-10 * * * *', date)).toBe(false)
    })

    test('handles empty or malformed fields', () => {
      const date = new Date('2025-01-13T10:00:00Z')
      // Leading/trailing spaces are handled by trim()
      expect(matchesCron(' * * * *', date)).toBe(false) // Only 4 fields after trim
      // Multiple spaces between fields are normalized by split(/\s+/)
      expect(matchesCron('*  * * * *', date)).toBe(true) // Valid - normalized to 5 fields
      // Actually malformed patterns
      expect(matchesCron('* * * * * extra', date)).toBe(false) // Too many fields
    })
  })
})

describe('createEveryProxy', () => {
  describe('basic periods', () => {
    test('creates hourly schedule', () => {
      const every = createEveryProxy(mockRuntimeContext)
      const callback = vi.fn()

      const schedule = every.hour(callback)

      // Callback should NOT be called immediately
      expect(callback).not.toHaveBeenCalled()

      // Should return a Schedule object
      expect(schedule).toMatchObject({
        id: expect.any(String),
        pattern: 'hour',
        cron: '0 * * * *',
        description: 'every hour',
        callback: callback,
        createdAt: expect.any(Date),
        status: 'active',
      })
    })

    test('creates daily schedule', () => {
      const every = createEveryProxy(mockRuntimeContext)
      const callback = vi.fn()

      const schedule = every.day(callback)

      expect(callback).not.toHaveBeenCalled()
      expect(schedule).toMatchObject({
        id: expect.any(String),
        pattern: 'day',
        cron: '0 0 * * *',
        description: 'every day',
        callback: callback,
        createdAt: expect.any(Date),
        status: 'active',
      })
    })

    test('creates weekly schedule', () => {
      const every = createEveryProxy(mockRuntimeContext)
      const callback = vi.fn()

      const schedule = every.week(callback)

      expect(callback).not.toHaveBeenCalled()
      expect(schedule).toMatchObject({
        id: expect.any(String),
        pattern: 'week',
        cron: '0 0 * * 0',
        description: 'every week',
        callback: callback,
        createdAt: expect.any(Date),
        status: 'active',
      })
    })

    test('creates monthly schedule', () => {
      const every = createEveryProxy(mockRuntimeContext)
      const callback = vi.fn()

      const schedule = every.month(callback)

      expect(callback).not.toHaveBeenCalled()
      expect(schedule).toMatchObject({
        id: expect.any(String),
        pattern: 'month',
        cron: '0 0 1 * *',
        description: 'every month',
        callback: callback,
        createdAt: expect.any(Date),
        status: 'active',
      })
    })
  })

  describe('day names', () => {
    test('creates monday schedule', () => {
      const every = createEveryProxy(mockRuntimeContext)
      const callback = vi.fn()

      const schedule = every.monday(callback)

      // Callback should NOT be called immediately
      expect(callback).not.toHaveBeenCalled()

      expect(schedule).toMatchObject({
        id: expect.any(String),
        pattern: 'monday',
        cron: '0 0 * * 1',
        description: 'every monday',
        callback: callback,
        createdAt: expect.any(Date),
        status: 'active',
      })
    })

    test('creates friday schedule', () => {
      const every = createEveryProxy(mockRuntimeContext)
      const callback = vi.fn()

      const schedule = every.friday(callback)

      // Callback should NOT be called immediately
      expect(callback).not.toHaveBeenCalled()

      expect(schedule).toMatchObject({
        id: expect.any(String),
        pattern: 'friday',
        cron: '0 0 * * 5',
        description: 'every friday',
        callback: callback,
        createdAt: expect.any(Date),
        status: 'active',
      })
    })

    test('creates sunday schedule', () => {
      const every = createEveryProxy(mockRuntimeContext)
      const callback = vi.fn()

      const schedule = every.sunday(callback)

      // Callback should NOT be called immediately
      expect(callback).not.toHaveBeenCalled()

      expect(schedule).toMatchObject({
        id: expect.any(String),
        pattern: 'sunday',
        cron: '0 0 * * 0',
        description: 'every sunday',
        callback: callback,
        createdAt: expect.any(Date),
        status: 'active',
      })
    })
  })

  describe('time of day', () => {
    test('creates 2am daily schedule', () => {
      const every = createEveryProxy(mockRuntimeContext)
      const callback = vi.fn()

      const schedule = every.day['2am'](callback)

      // Callback should NOT be called immediately
      expect(callback).not.toHaveBeenCalled()

      expect(schedule).toMatchObject({
        id: expect.any(String),
        cron: '0 2 * * *',
        callback: callback,
        createdAt: expect.any(Date),
        status: 'active',
      })
    })

    test('creates 3pm daily schedule', () => {
      const every = createEveryProxy(mockRuntimeContext)
      const callback = vi.fn()

      const schedule = every.day['3pm'](callback)

      // Callback should NOT be called immediately
      expect(callback).not.toHaveBeenCalled()

      expect(schedule).toMatchObject({
        id: expect.any(String),
        cron: '0 15 * * *',
        callback: callback,
        createdAt: expect.any(Date),
        status: 'active',
      })
    })

    test('handles 12am (midnight) correctly', () => {
      const every = createEveryProxy(mockRuntimeContext)
      const callback = vi.fn()

      const schedule = every.day['12am'](callback)

      // Callback should NOT be called immediately
      expect(callback).not.toHaveBeenCalled()

      expect(schedule).toMatchObject({
        id: expect.any(String),
        cron: '0 0 * * *',
        callback: callback,
        createdAt: expect.any(Date),
        status: 'active',
      })
    })

    test('handles 12pm (noon) correctly', () => {
      const every = createEveryProxy(mockRuntimeContext)
      const callback = vi.fn()

      const schedule = every.day['12pm'](callback)

      // Callback should NOT be called immediately
      expect(callback).not.toHaveBeenCalled()

      expect(schedule).toMatchObject({
        id: expect.any(String),
        cron: '0 12 * * *',
        callback: callback,
        createdAt: expect.any(Date),
        status: 'active',
      })
    })
  })

  describe('business hours', () => {
    test('creates business hour schedule', () => {
      const every = createEveryProxy(mockRuntimeContext)
      const callback = vi.fn()

      const schedule = every.business.hour(callback)

      // Callback should NOT be called immediately
      expect(callback).not.toHaveBeenCalled()

      expect(schedule).toMatchObject({
        id: expect.any(String),
        pattern: 'business.hour',
        cron: '0 9-16 * * 1,2,3,4,5',
        description: 'every business hour (Mon-Fri 9 AM - 5 PM)',
        callback: callback,
        createdAt: expect.any(Date),
        status: 'active',
      })
    })

    test('creates business day schedule', () => {
      const every = createEveryProxy(mockRuntimeContext)
      const callback = vi.fn()

      const schedule = every.business.day(callback)

      // Callback should NOT be called immediately
      expect(callback).not.toHaveBeenCalled()

      expect(schedule).toMatchObject({
        id: expect.any(String),
        cron: '0 0 * * 1,2,3,4,5',
        description: 'every business day (Mon-Fri)',
        callback: callback,
        createdAt: expect.any(Date),
        status: 'active',
      })
    })

    test('creates minute during business hours schedule', () => {
      const every = createEveryProxy(mockRuntimeContext)
      const callback = vi.fn()

      const schedule = every.minute.during.business.hours(callback)

      // Callback should NOT be called immediately
      expect(callback).not.toHaveBeenCalled()

      expect(schedule).toMatchObject({
        id: expect.any(String),
        cron: '* 9-16 * * 1,2,3,4,5',
        description: 'every minute during business hours (Mon-Fri 9 AM - 5 PM)',
        callback: callback,
        createdAt: expect.any(Date),
        status: 'active',
      })
    })

    test('creates business hours schedule (alternative syntax)', () => {
      const every = createEveryProxy(mockRuntimeContext)
      const callback = vi.fn()

      const schedule = every.business.hours(callback)

      // Callback should NOT be called immediately
      expect(callback).not.toHaveBeenCalled()

      expect(schedule).toMatchObject({
        id: expect.any(String),
        cron: '0 9-16 * * 1,2,3,4,5',
        callback: callback,
        createdAt: expect.any(Date),
        status: 'active',
      })
    })
  })

  describe('context and metadata', () => {
    test('returns schedule with complete metadata', () => {
      const every = createEveryProxy(mockRuntimeContext)
      const callback = vi.fn()

      const schedule = every.hour(callback)

      // Callback should NOT be called immediately
      expect(callback).not.toHaveBeenCalled()

      // Schedule object should contain all metadata
      expect(schedule).toMatchObject({
        id: expect.any(String),
        pattern: 'hour',
        cron: '0 * * * *',
        description: 'every hour',
        callback: callback,
        createdAt: expect.any(Date),
        status: 'active',
      })
    })

    test('schedule callback would receive runtime context when executed', () => {
      const every = createEveryProxy(mockRuntimeContext)
      const callback = vi.fn()

      const schedule = every.day(callback)

      // Callback should NOT be called immediately
      expect(callback).not.toHaveBeenCalled()

      // The schedule object stores the callback for later execution
      expect(schedule.callback).toBe(callback)
      expect(typeof schedule.callback).toBe('function')
    })
  })

  describe('error handling', () => {
    test('throws error for non-function callback', () => {
      const every = createEveryProxy(mockRuntimeContext)

      expect(() => {
        every.hour('not a function' as any)
      }).toThrow(TypeError)
      expect(() => {
        every.hour('not a function' as any)
      }).toThrow('Schedule callback must be a function')
    })

    test('defaults to valid cron for unrecognized patterns', () => {
      const every = createEveryProxy(mockRuntimeContext)
      const callback = vi.fn()

      // Unrecognized patterns default to "every hour" (valid cron)
      const schedule = every.invalid.pattern.that.generates.bad.cron(callback)

      // Callback should NOT be called immediately
      expect(callback).not.toHaveBeenCalled()

      expect(schedule).toMatchObject({
        cron: '0 * * * *', // Defaults to every hour
      })
    })
  })

  describe('proxy behavior', () => {
    test('does not interfere with promise methods', () => {
      const every = createEveryProxy(mockRuntimeContext)

      expect(every.then).toBeUndefined()
      expect(every.catch).toBeUndefined()
      expect(every.finally).toBeUndefined()
    })

    test('allows arbitrary chaining', () => {
      const every = createEveryProxy(mockRuntimeContext)
      const callback = vi.fn()

      // Should not throw even with nonsensical chains
      const schedule = every.foo.bar.baz(callback)

      // Callback should NOT be called immediately
      expect(callback).not.toHaveBeenCalled()

      // Should create a schedule with default cron (every hour)
      expect(schedule).toMatchObject({
        cron: '0 * * * *',
      })
    })
  })

  describe('schedule limit enforcement', () => {
    test('allows up to 100 schedules per context', () => {
      // Create a fresh context to avoid interference from other tests
      const freshContext = createFreshTestContext()
      const every = createEveryProxy(freshContext)
      const callback = vi.fn()

      // Create 100 schedules - should all succeed
      for (let i = 0; i < 100; i++) {
        expect(() => every.hour(callback)).not.toThrow()
      }

      // Callbacks should NOT be called immediately
      expect(callback).not.toHaveBeenCalled()

      // Verify all 100 schedules were created
      const schedules = listSchedules(freshContext)
      expect(schedules).toHaveLength(100)
    })

    test('throws error when exceeding 100 schedules per context', () => {
      // Create a fresh context
      const freshContext = createFreshTestContext()
      const every = createEveryProxy(freshContext)
      const callback = vi.fn()

      // Create 100 schedules - should all succeed
      for (let i = 0; i < 100; i++) {
        every.hour(callback)
      }

      // 101st schedule should throw
      expect(() => every.hour(callback)).toThrow('Maximum schedule limit reached')
      expect(() => every.hour(callback)).toThrow('100 schedules per context')
    })

    test('schedule limit is per-context', () => {
      // Create two separate contexts
      const context1 = createFreshTestContext()
      const context2 = createFreshTestContext()

      const every1 = createEveryProxy(context1)
      const every2 = createEveryProxy(context2)
      const callback = vi.fn()

      // Fill up context1
      for (let i = 0; i < 100; i++) {
        every1.hour(callback)
      }

      // context1 should be at limit
      expect(() => every1.hour(callback)).toThrow('Maximum schedule limit reached')

      // context2 should still work
      expect(() => every2.hour(callback)).not.toThrow()
    })
  })

  describe('callback behavior', () => {
    test('stores async callbacks correctly', () => {
      const every = createEveryProxy(mockRuntimeContext)
      const callback = vi.fn().mockResolvedValue(undefined)

      const schedule = every.hour(callback)

      // Callback should NOT be called immediately
      expect(callback).not.toHaveBeenCalled()

      // Async callback should be stored for later execution
      expect(schedule.callback).toBe(callback)
    })

    test('stores sync callbacks correctly', () => {
      const every = createEveryProxy(mockRuntimeContext)
      const callback = vi.fn()

      const schedule = every.hour(callback)

      // Callback should NOT be called immediately
      expect(callback).not.toHaveBeenCalled()

      // Sync callback should be stored for later execution
      expect(schedule.callback).toBe(callback)
    })

    test('stores callbacks for business hours', () => {
      const every = createEveryProxy(mockRuntimeContext)
      const callback = vi.fn().mockResolvedValue(undefined)

      const schedule = every.business.hour(callback)

      // Callback should NOT be called immediately
      expect(callback).not.toHaveBeenCalled()

      // Verify schedule metadata
      expect(schedule.pattern).toBe('business.hour')
      expect(schedule.cron).toBe('0 9-16 * * 1,2,3,4,5')
      expect(schedule.callback).toBe(callback)
    })
  })

  describe('concurrent schedule creation', () => {
    test('handles multiple schedule creation safely', () => {
      const every = createEveryProxy(mockRuntimeContext)
      const callback = vi.fn()

      // Create 10 schedules
      const schedules = Array.from({ length: 10 }, () => every.hour(callback))

      // Callbacks should NOT be called immediately
      expect(callback).not.toHaveBeenCalled()

      // All schedules should be created successfully
      expect(schedules).toHaveLength(10)
      schedules.forEach((schedule) => {
        expect(schedule.id).toBeDefined()
        expect(schedule.callback).toBe(callback)
      })
    })

    test('concurrent creation respects schedule limit', () => {
      const freshContext = createFreshTestContext()
      const every = createEveryProxy(freshContext)
      const callback = vi.fn()

      // Create 99 schedules first
      for (let i = 0; i < 99; i++) {
        every.hour(callback)
      }

      // The 100th should succeed
      expect(() => every.hour(callback)).not.toThrow()

      // The 101st should fail
      expect(() => every.hour(callback)).toThrow('Maximum schedule limit reached')
    })
  })

  describe('invalid pattern edge cases', () => {
    test('handles empty pattern parts gracefully', () => {
      const every = createEveryProxy(mockRuntimeContext)
      const callback = vi.fn()

      // Empty pattern should default to 'every hour'
      const schedule = every[''](callback)
      // Callback should NOT be called immediately
      expect(callback).not.toHaveBeenCalled()
      // Should default to every hour
      expect(schedule.cron).toBe('0 * * * *')
    })

    test('handles special characters in patterns', () => {
      const every = createEveryProxy(mockRuntimeContext)
      const callback = vi.fn()

      // Special characters should be treated as regular pattern parts
      const schedule = every['@special'](callback)
      // Callback should NOT be called immediately
      expect(callback).not.toHaveBeenCalled()
      // Should default to every hour
      expect(schedule.cron).toBe('0 * * * *')
    })

    test('handles numeric string patterns', () => {
      const every = createEveryProxy(mockRuntimeContext)
      const callback = vi.fn()

      // Numeric strings should be treated as interval modifiers
      const schedule = every['5'].minutes(callback)
      // Callback should NOT be called immediately
      expect(callback).not.toHaveBeenCalled()
      expect(schedule.cron).toBe('*/5 * * * *')
    })

    test('handles very long pattern chains', () => {
      const every = createEveryProxy(mockRuntimeContext)
      const callback = vi.fn()

      // Very long chains should still work
      const schedule = every.a.b.c.d.e.f.g.h.i.j.hour(callback)
      // Callback should NOT be called immediately
      expect(callback).not.toHaveBeenCalled()
      // Should create a schedule
      expect(schedule).toBeDefined()
    })
  })

  describe('business hours boundary tests', () => {
    test('8:00 AM is not within business hours', () => {
      const date = new Date('2025-01-13T08:00:00Z') // Monday 8:00 AM
      expect(matchesCron('0 9-16 * * 1,2,3,4,5', date)).toBe(false)
    })

    test('9:00 AM is within business hours', () => {
      const date = new Date('2025-01-13T09:00:00Z') // Monday 9:00 AM
      expect(matchesCron('0 9-16 * * 1,2,3,4,5', date)).toBe(true)
    })

    test('4:00 PM (hour 16) is within business hours', () => {
      const date = new Date('2025-01-13T16:00:00Z') // Monday 4:00 PM
      expect(matchesCron('0 9-16 * * 1,2,3,4,5', date)).toBe(true)
    })

    test('5:00 PM (hour 17) is not within business hours', () => {
      const date = new Date('2025-01-13T17:00:00Z') // Monday 5:00 PM
      expect(matchesCron('0 9-16 * * 1,2,3,4,5', date)).toBe(false)
    })

    test('Saturday 10 AM is not within business hours', () => {
      const date = new Date('2025-01-11T10:00:00') // Saturday 10 AM
      expect(matchesCron('0 9-16 * * 1,2,3,4,5', date)).toBe(false)
    })

    test('Sunday 10 AM is not within business hours', () => {
      const date = new Date('2025-01-12T10:00:00') // Sunday 10 AM
      expect(matchesCron('0 9-16 * * 1,2,3,4,5', date)).toBe(false)
    })

    test('Friday 10 AM is within business hours', () => {
      const date = new Date('2025-01-17T10:00:00') // Friday 10:00 AM
      expect(matchesCron('0 9-16 * * 1,2,3,4,5', date)).toBe(true)
    })

    test('matches every minute during business hours', () => {
      const date = new Date('2025-01-13T10:30:00Z') // Monday 10:30 AM
      expect(matchesCron('* 9-16 * * 1,2,3,4,5', date)).toBe(true)
    })
  })

  describe('numeric interval validation', () => {
    test('accepts valid minute intervals (1-59)', () => {
      const every = createEveryProxy(mockRuntimeContext)
      const callback = vi.fn()

      // Valid minute intervals should work
      expect(() => every['5'].minutes(callback)).not.toThrow()
      expect(() => every['30'].minutes(callback)).not.toThrow()
      expect(() => every['59'].minutes(callback)).not.toThrow()
    })

    test('rejects invalid minute intervals (< 1 or > 59)', () => {
      const every = createEveryProxy(mockRuntimeContext)
      const callback = vi.fn()

      // 60 minutes is invalid
      expect(() => every['60'].minutes(callback)).toThrow('Invalid minute interval "60". Minute intervals must be between 1 and 59.')

      // 100 minutes is invalid
      expect(() => every['100'].minutes(callback)).toThrow('Invalid minute interval "100". Minute intervals must be between 1 and 59.')
    })

    test('accepts valid hour intervals (1-23)', () => {
      const every = createEveryProxy(mockRuntimeContext)
      const callback = vi.fn()

      // Valid hour intervals should work
      expect(() => every['1'].hours(callback)).not.toThrow()
      expect(() => every['12'].hours(callback)).not.toThrow()
      expect(() => every['23'].hours(callback)).not.toThrow()
    })

    test('rejects invalid hour intervals (< 1 or > 23)', () => {
      const every = createEveryProxy(mockRuntimeContext)
      const callback = vi.fn()

      // 24 hours is invalid
      expect(() => every['24'].hours(callback)).toThrow('Invalid hour interval "24". Hour intervals must be between 1 and 23.')

      // 50 hours is invalid
      expect(() => every['50'].hours(callback)).toThrow('Invalid hour interval "50". Hour intervals must be between 1 and 23.')
    })

    test('accepts valid day intervals (1-31)', () => {
      const every = createEveryProxy(mockRuntimeContext)
      const callback = vi.fn()

      // Valid day intervals should work
      expect(() => every['1'].days(callback)).not.toThrow()
      expect(() => every['15'].days(callback)).not.toThrow()
      expect(() => every['31'].days(callback)).not.toThrow()
    })

    test('rejects invalid day intervals (< 1 or > 31)', () => {
      const every = createEveryProxy(mockRuntimeContext)
      const callback = vi.fn()

      // 32 days is invalid
      expect(() => every['32'].days(callback)).toThrow('Invalid day interval "32". Day intervals must be between 1 and 31.')
    })

    test('validates invalid hour in time patterns', () => {
      const every = createEveryProxy(mockRuntimeContext)
      const callback = vi.fn()

      // Invalid hours in am/pm format (13+ are invalid)
      expect(() => every.day['13pm'](callback)).toThrow('Invalid hour "13" in time pattern "13pm". Hours must be between 1 and 12 for am/pm format.')

      expect(() => every.day['25am'](callback)).toThrow('Invalid hour "25" in time pattern "25am". Hours must be between 1 and 12 for am/pm format.')
    })
  })

  describe('schedule management', () => {
    test('listSchedules returns all registered schedules', () => {
      // Use fresh context to ensure no interference from other tests
      const freshContext = createFreshTestContext()
      const every = createEveryProxy(freshContext)
      const callback1 = vi.fn()
      const callback2 = vi.fn()
      const callback3 = vi.fn()

      // Initially empty
      expect(listSchedules(freshContext)).toEqual([])

      // Register schedules
      const schedule1 = every.hour(callback1)
      const schedule2 = every.day(callback2)
      const schedule3 = every.week(callback3)

      // List should contain all 3
      const schedules = listSchedules(freshContext)
      expect(schedules).toHaveLength(3)
      expect(schedules).toContainEqual(expect.objectContaining({ id: schedule1.id }))
      expect(schedules).toContainEqual(expect.objectContaining({ id: schedule2.id }))
      expect(schedules).toContainEqual(expect.objectContaining({ id: schedule3.id }))
    })

    test('getSchedule returns specific schedule by ID', () => {
      const every = createEveryProxy(mockRuntimeContext)
      const callback = vi.fn()

      const schedule = every.hour(callback)

      // Get by ID
      const retrieved = getSchedule(mockRuntimeContext, schedule.id)
      expect(retrieved).toEqual(schedule)
      expect(retrieved?.pattern).toBe('hour')
      expect(retrieved?.cron).toBe('0 * * * *')
    })

    test('getSchedule returns undefined for non-existent ID', () => {
      const result = getSchedule(mockRuntimeContext, 'non-existent-id')
      expect(result).toBeUndefined()
    })

    test('cancelSchedule cancels a schedule', () => {
      const every = createEveryProxy(mockRuntimeContext)
      const callback = vi.fn()

      const schedule = every.hour(callback)
      expect(schedule.status).toBe('active')

      // Cancel the schedule
      const cancelled = cancelSchedule(mockRuntimeContext, schedule.id)
      expect(cancelled).toBe(true)

      // Check status updated
      const retrieved = getSchedule(mockRuntimeContext, schedule.id)
      expect(retrieved?.status).toBe('cancelled')
    })

    test('cancelSchedule returns false for non-existent ID', () => {
      const result = cancelSchedule(mockRuntimeContext, 'non-existent-id')
      expect(result).toBe(false)
    })

    test('cancelSchedule throws error for invalid ID', () => {
      expect(() => cancelSchedule(mockRuntimeContext, '')).toThrow('Schedule ID must be a non-empty string')
      expect(() => cancelSchedule(mockRuntimeContext, null as any)).toThrow('Schedule ID must be a non-empty string')
    })

    test('pauseSchedule pauses a schedule', () => {
      const every = createEveryProxy(mockRuntimeContext)
      const callback = vi.fn()

      const schedule = every.hour(callback)
      expect(schedule.status).toBe('active')

      // Pause the schedule
      const paused = pauseSchedule(mockRuntimeContext, schedule.id)
      expect(paused).toBe(true)

      // Check status updated
      const retrieved = getSchedule(mockRuntimeContext, schedule.id)
      expect(retrieved?.status).toBe('paused')
    })

    test('pauseSchedule returns false for non-existent ID', () => {
      const result = pauseSchedule(mockRuntimeContext, 'non-existent-id')
      expect(result).toBe(false)
    })

    test('resumeSchedule resumes a paused schedule', () => {
      const every = createEveryProxy(mockRuntimeContext)
      const callback = vi.fn()

      const schedule = every.hour(callback)

      // Pause then resume
      pauseSchedule(mockRuntimeContext, schedule.id)
      const retrieved1 = getSchedule(mockRuntimeContext, schedule.id)
      expect(retrieved1?.status).toBe('paused')

      const resumed = resumeSchedule(mockRuntimeContext, schedule.id)
      expect(resumed).toBe(true)

      const retrieved2 = getSchedule(mockRuntimeContext, schedule.id)
      expect(retrieved2?.status).toBe('active')
    })

    test('resumeSchedule returns false for non-existent ID', () => {
      const result = resumeSchedule(mockRuntimeContext, 'non-existent-id')
      expect(result).toBe(false)
    })

    test('schedule objects have unique IDs', () => {
      const every = createEveryProxy(mockRuntimeContext)
      const callback = vi.fn()

      const schedule1 = every.hour(callback)
      const schedule2 = every.hour(callback)
      const schedule3 = every.hour(callback)

      expect(schedule1.id).not.toBe(schedule2.id)
      expect(schedule2.id).not.toBe(schedule3.id)
      expect(schedule1.id).not.toBe(schedule3.id)
    })
  })

  describe('Error Cases', () => {
    test('works when logger is undefined', () => {
      // Use fresh context to avoid schedule limit issues
      const contextWithoutLogger = {
        ...createFreshTestContext(),
        logger: undefined,
      }

      const every = createEveryProxy(contextWithoutLogger)
      const callback = vi.fn()

      // Should not throw when logger is undefined
      expect(() => every.hour(callback)).not.toThrow()
    })

    test('works when logger exists but lacks log method', () => {
      // Use fresh context to avoid schedule limit issues
      const contextWithBrokenLogger = {
        ...createFreshTestContext(),
        logger: {} as any, // Empty object with no methods
      }

      const every = createEveryProxy(contextWithBrokenLogger)
      const callback = vi.fn()

      // Should not throw when logger lacks methods
      expect(() => every.hour(callback)).not.toThrow()
    })

    test('schedule limit edge case: exactly 100 schedules', () => {
      // Use fresh context to avoid schedule limit issues from other tests
      const freshContext = createFreshTestContext()

      const every = createEveryProxy(freshContext)
      const callback = vi.fn()

      // Create exactly 100 schedules
      for (let i = 0; i < 100; i++) {
        every.hour(callback)
      }

      // 101st schedule should throw
      expect(() => every.hour(callback)).toThrow('Maximum schedule limit reached')
    })

    test('cancelSchedule throws for empty string ID', () => {
      expect(() => cancelSchedule(mockRuntimeContext, '')).toThrow('Schedule ID must be a non-empty string')
    })

    test('pauseSchedule throws for empty string ID', () => {
      expect(() => pauseSchedule(mockRuntimeContext, '')).toThrow('Schedule ID must be a non-empty string')
    })

    test('resumeSchedule throws for empty string ID', () => {
      expect(() => resumeSchedule(mockRuntimeContext, '')).toThrow('Schedule ID must be a non-empty string')
    })

    test('cancelSchedule throws for non-string ID', () => {
      expect(() => cancelSchedule(mockRuntimeContext, null as any)).toThrow('Schedule ID must be a non-empty string')
      expect(() => cancelSchedule(mockRuntimeContext, undefined as any)).toThrow('Schedule ID must be a non-empty string')
      expect(() => cancelSchedule(mockRuntimeContext, 123 as any)).toThrow('Schedule ID must be a non-empty string')
    })

    test('allows any property access for backward compatibility', () => {
      const every = createEveryProxy(mockRuntimeContext)

      // Invalid properties are allowed for backward compatibility
      // They default to "every hour" pattern
      expect(() => (every as any).invalidProperty).not.toThrow()
    })

    test('arbitrary properties create schedules with default pattern', () => {
      const every = createEveryProxy(mockRuntimeContext)
      const callback = vi.fn()

      // Access property that doesn't match known patterns
      const schedule = (every as any).daily(callback)

      // Should create a schedule with default cron
      expect(schedule).toBeDefined()
      expect(schedule.cron).toBe('0 * * * *')
      // Callback should NOT be called immediately
      expect(callback).not.toHaveBeenCalled()
    })

    test('clearCancelledSchedules removes cancelled schedules', () => {
      // Use fresh context to avoid schedule limit issues from other tests
      const freshContext = createFreshTestContext()

      const every = createEveryProxy(freshContext)
      const callback = vi.fn()

      // Create 5 schedules
      const schedule1 = every.hour(callback)
      const schedule2 = every.day(callback)
      const schedule3 = every.week(callback)
      const schedule4 = every.month(callback)
      const schedule5 = every.year(callback)

      // Cancel 3 of them
      cancelSchedule(freshContext, schedule1.id)
      cancelSchedule(freshContext, schedule3.id)
      cancelSchedule(freshContext, schedule5.id)

      // Verify 5 schedules exist before cleanup
      expect(listSchedules(freshContext).length).toBe(5)

      // Clean up cancelled schedules
      const removed = clearCancelledSchedules(freshContext)

      // Should have removed 3 cancelled schedules
      expect(removed).toBe(3)

      // Should have 2 active schedules remaining
      const remaining = listSchedules(freshContext)
      expect(remaining.length).toBe(2)
      expect(remaining.map((s) => s.id)).toEqual([schedule2.id, schedule4.id])
    })

    test('clearCancelledSchedules returns 0 when no schedules exist', () => {
      const emptyContext = createFreshTestContext()
      const removed = clearCancelledSchedules(emptyContext)
      expect(removed).toBe(0)
    })

    test('clearCancelledSchedules returns 0 when no cancelled schedules exist', () => {
      // Use fresh context to avoid schedule limit issues from other tests
      const freshContext = createFreshTestContext()

      const every = createEveryProxy(freshContext)
      const callback = vi.fn()

      // Create 3 active schedules
      every.hour(callback)
      every.day(callback)
      every.week(callback)

      // Try to clean up (should find none)
      const removed = clearCancelledSchedules(freshContext)
      expect(removed).toBe(0)

      // All schedules should still exist
      expect(listSchedules(freshContext).length).toBe(3)
    })
  })
})
