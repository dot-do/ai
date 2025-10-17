/**
 * Examples of using the `every` scheduling API
 *
 * This demonstrates the human-readable scheduling syntax powered by Proxy
 */

import { $, type ScheduleContext } from '../src/index'

// Example 1: Run every hour
export async function everyHourExample() {
  const runtime = await $()

  runtime.every.hour(async ($: ScheduleContext) => {
    console.log('Running hourly task at:', $.schedule.timestamp)
    console.log('Cron pattern:', $.schedule.cron)

    // Access all SDK functions through the context
    const users = await $.db.list('users')
    console.log('Found users:', users)
  })
}

// Example 2: Run every business hour (Mon-Fri 9 AM - 5 PM)
export async function everyBusinessHourExample() {
  const runtime = await $()

  runtime.every.business.hour(async ($: ScheduleContext) => {
    console.log('Running business hour task')
    console.log('Description:', $.schedule.description)

    // Generate reports during business hours
    const report = await $.ai.generate('Generate daily business summary')
    await $.db.upsert('reports', 'daily', report)
  })
}

// Example 3: Run every minute during business hours
export async function everyMinuteDuringBusinessHoursExample() {
  const runtime = await $()

  runtime.every.minute.during.business.hours(async ($: ScheduleContext) => {
    console.log('Monitoring systems during business hours')

    // Check system health frequently during business hours
    const status = await $.api.get('https://status.example.com/health')
    if (!status.ok) {
      await $.send.alert({ type: 'system_down', timestamp: new Date() })
    }
  })
}

// Example 4: Run every Monday
export async function everyMondayExample() {
  const runtime = await $()

  runtime.every.monday(async ($: ScheduleContext) => {
    console.log('Running Monday task')

    // Send weekly report every Monday
    const report = await $.ai.generate('Generate weekly summary report')
    await $.send.email({
      to: 'team@example.com',
      subject: 'Weekly Report',
      body: report,
    })
  })
}

// Example 5: Run every day at 2 AM
export async function everyDayAt2AMExample() {
  const runtime = await $()

  runtime.every.day['2am'](async ($: ScheduleContext) => {
    console.log('Running daily backup at 2 AM')
    console.log('Event type:', $.event.type)

    // Perform daily backup
    const data = await $.db.list('all-collections')
    await $.api.post('https://backup.example.com/backup', { data })
  })
}

// Example 6: Run every 5 minutes (numeric intervals)
export async function every5MinutesExample() {
  const runtime = await $()

  // This would require extending the syntax to support: every[5].minutes
  // For now, this is a placeholder to show the desired API
  // runtime.every[5].minutes(async ($: ScheduleContext) => {
  //   console.log('Running every 5 minutes')
  // })
}

// Example 7: Chaining multiple schedules
export async function multipleSchedulesExample() {
  const runtime = await $()

  // Different tasks on different schedules
  runtime.every.hour(async ($) => {
    console.log('Hourly sync')
    await $.db.upsert('sync', 'hourly', { timestamp: new Date() })
  })

  runtime.every.business.day(async ($) => {
    console.log('Business day task')
    await $.db.upsert('sync', 'daily', { timestamp: new Date() })
  })

  runtime.every.monday(async ($) => {
    console.log('Weekly task')
    await $.db.upsert('sync', 'weekly', { timestamp: new Date() })
  })
}

// Example 8: Access to schedule metadata
export async function scheduleMetadataExample() {
  const runtime = await $()

  runtime.every.business.hour(async ($: ScheduleContext) => {
    // Access schedule information
    console.log('Schedule pattern:', $.schedule.pattern) // "business.hour"
    console.log('Cron expression:', $.schedule.cron) // "0 9-17 * * 1,2,3,4,5"
    console.log('Description:', $.schedule.description) // "every business hour (Mon-Fri 9 AM - 5 PM)"
    console.log('Timestamp:', $.schedule.timestamp)

    // Access event information
    console.log('Event type:', $.event.type) // "scheduled"
    console.log('Scheduled time:', $.event.scheduledTime)

    // Use all SDK services
    await $.db.upsert('logs', 'schedule-run', {
      pattern: $.schedule.pattern,
      cron: $.schedule.cron,
      timestamp: $.schedule.timestamp,
    })
  })
}
