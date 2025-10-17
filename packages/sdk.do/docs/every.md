# `every` - Scheduling API

The `every` function provides a human-readable, Proxy-based API for scheduling tasks with intuitive syntax.

## ⚠️ Backend Integration Status

**Important**: The current implementation provides the client-side API and pattern-to-cron conversion, but **does not yet integrate with the Cloudflare Workers scheduling backend**.

**Current behavior:**

- Schedules are registered and validated locally
- **✅ Callbacks are NOT executed immediately** - they are stored for later execution
- Schedule objects are returned with metadata (ID, pattern, cron, status)
- Schedule metadata is logged to console
- Schedules can be managed with `listSchedules()`, `getSchedule()`, `cancelSchedule()`, etc.

**Future work needed:**

- Backend API endpoint to persist schedules
- Integration with Cloudflare Workers cron triggers to execute callbacks at scheduled times
- Backend schedule storage and retrieval

See the [Backend Integration](#backend-integration) and [Schedule Management](#schedule-management) sections for more details.

## Installation

```bash
npm install sdk.do
# or
pnpm add sdk.do
```

## Basic Usage

```typescript
import { $ } from 'sdk.do'

const runtime = await $()

// Register a schedule to run every hour
const schedule = runtime.every.hour(async ($) => {
  console.log('Running hourly task')
  // Access all SDK services through the context
  await $.db.upsert('logs', 'hourly', { timestamp: new Date() })
})

console.log(`Schedule registered: ${schedule.id}`)
console.log(`Cron pattern: ${schedule.cron}`)
console.log(`Status: ${schedule.status}`)
```

**✅ Important**: The callback is **NOT executed immediately** when you register the schedule. Instead, a Schedule object is returned with metadata. The callback will be executed at the scheduled times once the backend integration is complete.

### ⚠️ Important: Timezone Considerations

**All schedules use UTC timezone** by default, as this is the standard for Cloudflare Workers cron triggers.

- Time specifications (e.g., `every.day.2am()`) are interpreted in **UTC**, not local time
- Business hours (`9 AM - 5 PM`) refer to **UTC time**
- If you need schedules in a specific timezone, convert to UTC when defining the schedule
- DST (Daylight Saving Time) does not apply to UTC, so schedules won't automatically adjust for local DST changes

See the [Timezone and DST Considerations](#timezone-and-dst-considerations) section for more details.

## Syntax Patterns

### Time-based Scheduling

```typescript
// Every minute
runtime.every.minute(async ($) => {
  console.log('Every minute')
})

// Every hour
runtime.every.hour(async ($) => {
  console.log('Every hour')
})

// Every day
runtime.every.day(async ($) => {
  console.log('Every day at midnight')
})

// Every week
runtime.every.week(async ($) => {
  console.log('Every Sunday at midnight')
})

// Every month
runtime.every.month(async ($) => {
  console.log('First day of every month')
})
```

### Day-based Scheduling

```typescript
// Specific days of the week
runtime.every.monday(async ($) => {
  console.log('Every Monday')
})

runtime.every.tuesday(async ($) => {
  console.log('Every Tuesday')
})

runtime.every.friday(async ($) => {
  console.log('Every Friday')
})
```

### Time of Day

```typescript
// Specific time of day
runtime.every.day['2am'](async ($) => {
  console.log('Every day at 2 AM')
})

runtime.every.day['3pm'](async ($) => {
  console.log('Every day at 3 PM')
})

// Can also use property access
runtime.every.day.9am(async ($) => {
  console.log('Every day at 9 AM')
})
```

### Business Hours

Business hours are defined as Monday-Friday, 9 AM - 4:59 PM (hours 9-16 in 24-hour format).

**Note on hour ranges**: The range `9-16` in cron expressions is inclusive on both ends, meaning schedules will run during hours 9:00-9:59, 10:00-10:59, ..., 16:00-16:59. Hour 16 is 4:00-4:59 PM, so the range effectively covers 9 AM through 4:59 PM. This is a standard 9-to-5 business day (the "5" in "9-to-5" means end of work at 5 PM, not a schedule that runs at 5 PM).

```typescript
// Every business hour (9 AM - 5 PM, Mon-Fri)
runtime.every.business.hour(async ($) => {
  console.log('Every business hour')
})

// Every minute during business hours
runtime.every.minute.during.business.hours(async ($) => {
  console.log('Every minute during business hours')
})

// Every business day (Mon-Fri at midnight)
runtime.every.business.day(async ($) => {
  console.log('Every business day')
})
```

## Schedule Context

The callback function receives a `ScheduleContext` object that extends the standard `RuntimeContext` with schedule-specific information:

```typescript
interface ScheduleContext extends RuntimeContext {
  schedule: {
    pattern: string // e.g., "business.hour"
    cron: string // e.g., "0 9-17 * * 1,2,3,4,5"
    description: string // e.g., "every business hour (Mon-Fri 9 AM - 5 PM)"
    timestamp: Date // When the schedule was registered
  }
  event: {
    type: 'scheduled'
    scheduledTime: Date // When this execution was scheduled
  }
}
```

### Using Schedule Context

```typescript
runtime.every.business.hour(async ($) => {
  // Access schedule metadata
  console.log('Pattern:', $.schedule.pattern)
  console.log('Cron:', $.schedule.cron)
  console.log('Description:', $.schedule.description)

  // Access event information
  console.log('Event type:', $.event.type)
  console.log('Scheduled time:', $.event.scheduledTime)

  // Use all SDK services
  await $.db.upsert('logs', 'schedule', {
    pattern: $.schedule.pattern,
    timestamp: $.schedule.timestamp,
  })

  // Generate AI content
  const summary = await $.ai.generate('Generate hourly summary')

  // Send events
  await $.send.notification({ type: 'summary', content: summary })
})
```

## Cron Expression Generation

The `every` API automatically converts human-readable patterns to cron expressions:

| Pattern                              | Cron Expression        | Description                          |
| ------------------------------------ | ---------------------- | ------------------------------------ |
| `every.minute`                       | `* * * * *`            | Every minute                         |
| `every.hour`                         | `0 * * * *`            | Every hour at :00                    |
| `every.day`                          | `0 0 * * *`            | Every day at midnight                |
| `every.week`                         | `0 0 * * 0`            | Every Sunday at midnight             |
| `every.month`                        | `0 0 1 * *`            | First day of month                   |
| `every.monday`                       | `0 0 * * 1`            | Every Monday at midnight             |
| `every.business.hour`                | `0 9-16 * * 1,2,3,4,5` | Mon-Fri, 9 AM - 4:59 PM              |
| `every.minute.during.business.hours` | `* 9-16 * * 1,2,3,4,5` | Every minute, Mon-Fri, 9 AM - 4:59PM |
| `every.day.2am`                      | `0 2 * * *`            | Every day at 2 AM                    |

## Schedule Management

The `every` API provides functions to manage registered schedules:

### Listing Schedules

```typescript
import { listSchedules } from 'sdk.do'

const runtime = await $()

// Register some schedules
const schedule1 = runtime.every.hour(async ($) => {
  /* ... */
})
const schedule2 = runtime.every.day(async ($) => {
  /* ... */
})

// List all schedules
const schedules = listSchedules(runtime)
console.log(`Total schedules: ${schedules.length}`)

schedules.forEach((schedule) => {
  console.log(`${schedule.id}: ${schedule.description} (${schedule.status})`)
})
```

### Getting a Specific Schedule

```typescript
import { getSchedule } from 'sdk.do'

const schedule = getSchedule(runtime, 'schedule_123')
if (schedule) {
  console.log(`Pattern: ${schedule.pattern}`)
  console.log(`Cron: ${schedule.cron}`)
  console.log(`Status: ${schedule.status}`)
  console.log(`Created: ${schedule.createdAt}`)
}
```

### Cancelling a Schedule

```typescript
import { cancelSchedule } from 'sdk.do'

const cancelled = cancelSchedule(runtime, 'schedule_123')
if (cancelled) {
  console.log('Schedule cancelled successfully')
} else {
  console.log('Schedule not found')
}
```

### Pausing and Resuming Schedules

```typescript
import { pauseSchedule, resumeSchedule } from 'sdk.do'

// Pause a schedule (temporarily stop execution)
const paused = pauseSchedule(runtime, 'schedule_123')
if (paused) {
  console.log('Schedule paused')
}

// Resume a paused schedule
const resumed = resumeSchedule(runtime, 'schedule_123')
if (resumed) {
  console.log('Schedule resumed')
}
```

### Schedule Object Properties

When you register a schedule, you receive a `Schedule` object with these properties:

```typescript
interface Schedule {
  id: string // Unique schedule identifier
  pattern: string // Human-readable pattern (e.g., 'business.hour')
  cron: string // Generated cron expression
  description: string // Description (e.g., 'every business hour')
  callback: ScheduleCallback // The callback function
  createdAt: Date // When the schedule was created
  status: 'active' | 'paused' | 'cancelled' // Current status
}
```

## Utility Functions

### `parseCron(cron: string)`

Parse and validate a cron expression:

```typescript
import { parseCron } from 'sdk.do'

const result = parseCron('0 9-17 * * 1,2,3,4,5')
console.log(result)
// {
//   valid: true,
//   minute: '0',
//   hour: '9-17',
//   dayOfMonth: '*',
//   month: '*',
//   dayOfWeek: '1,2,3,4,5'
// }
```

### `matchesCron(cron: string, date?: Date)`

Check if a date matches a cron pattern:

```typescript
import { matchesCron } from 'sdk.do'

const date = new Date('2025-01-13T10:00:00') // Monday at 10 AM
const matches = matchesCron('0 9-17 * * 1,2,3,4,5', date)
console.log(matches) // true - it's a weekday within business hours
```

## Implementation Details

The `every` API is implemented using JavaScript Proxy objects, which allows for flexible method chaining and property access. When you chain properties like `every.business.hour`, the Proxy captures each property access and builds up a pattern array (e.g., `['business', 'hour']`).

When the final function is called, the pattern is converted to a cron expression and registered with the backend scheduling service.

## Timezone and DST Considerations

**Important**: All schedules use **UTC timezone** by default, as this is the standard for Cloudflare Workers cron triggers.

### Timezone Assumptions

- All time specifications (e.g., `every.day.2am()`) are interpreted in **UTC**
- Business hours (`9 AM - 5 PM`) refer to **UTC time**, not local time
- If you need schedules in a specific timezone, you'll need to convert to UTC when defining the schedule

### Daylight Saving Time (DST)

Since cron expressions operate on UTC (which does not observe DST), your schedules will not automatically adjust for DST transitions in local timezones:

- A schedule at `2am` local time will shift to `3am` after DST spring forward (in timezones that observe DST)
- Conversely, it will shift to `1am` after DST fall back
- To maintain consistent local times across DST changes, you may need to update schedules twice a year

**Future Enhancement**: Timezone-aware scheduling with automatic DST handling is planned for a future release (e.g., `every.hour.in('America/New_York')()`).

## Backend Integration

The `every` function is designed to integrate with Cloudflare Workers' scheduled events system. When you register a schedule:

1. The pattern is converted to a cron expression
2. The schedule is registered with the backend API
3. The backend configures Cloudflare Workers cron triggers
4. Your callback is executed at the scheduled times

### Callback Serialization Strategy

**Important architectural consideration**: JavaScript functions cannot be directly serialized and stored in databases while preserving their closure scope. When implementing backend integration, one of the following strategies should be used:

#### Option 1: Named Task Handlers (Recommended)

Instead of inline callbacks, register named task handlers that can be referenced by string identifiers:

```typescript
// Register task handlers
registerTask('generate-reports', async ($) => {
  // Implementation
})

// Schedule by task name
runtime.every.hour({ task: 'generate-reports' })
```

#### Option 2: Webhook Pattern

Accept HTTP endpoint URLs that will be called on schedule:

```typescript
runtime.every.hour({
  webhook: 'https://api.example.com/scheduled/reports',
  method: 'POST',
  headers: { Authorization: 'Bearer token' },
})
```

#### Option 3: Code-as-Data (Workflow DSL)

Accept serializable workflow definitions in JSON format:

```typescript
runtime.every.hour({
  workflow: {
    steps: [
      { action: 'db.query', params: { sql: '...' } },
      { action: 'ai.generate', params: { prompt: '...' } },
    ],
  },
})
```

#### Option 4: Hybrid Approach

Support both inline callbacks (for testing/development) and production identifiers:

```typescript
// Development: inline callback (not persisted)
runtime.every.hour(async ($) => {
  /* ... */
})

// Production: named task reference (persisted)
runtime.every.hour({ task: 'hourly-sync' })
```

**Current Implementation**: The current client-side API accepts callbacks and stores them in memory for testing, but these callbacks are not persisted or executed by the backend. Backend integration will require implementing one of the strategies above.

## Examples

See `examples/every-examples.ts` for comprehensive usage examples including:

- Basic time-based scheduling
- Business hours scheduling
- Day-specific scheduling
- Time-of-day scheduling
- Multiple concurrent schedules
- Accessing schedule metadata

## Future Enhancements

Potential future additions to the `every` API:

- Numeric intervals: `every[5].minutes()`
- Duration-based: `every.2.hours()`
- Complex patterns: `every.weekday.9am()`
- Timezone support: `every.hour.in('America/New_York')()`
- Conditional scheduling: `every.hour.when(condition)()`

## Related

- [SDK Documentation](../README.md)
- [Cron Expression Syntax](https://crontab.guru/)
- [Cloudflare Workers Scheduled Events](https://developers.cloudflare.com/workers/runtime-apis/handlers/scheduled/)
