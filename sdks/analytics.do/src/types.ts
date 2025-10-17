/**
 * analytics.do SDK - TypeScript Types
 */

export interface AnalyticsConfig {
  writeKey?: string
  host?: string
  debug?: boolean
  batchSize?: number
  batchInterval?: number
  timeout?: number
  headers?: Record<string, string>
}

export type Primitive = string | number | boolean | null | undefined

export interface EventProperties {
  [key: string]: Primitive | Primitive[] | Record<string, Primitive>
}

export interface UserTraits {
  [key: string]: Primitive | Primitive[] | Record<string, Primitive>
}

export interface PageProperties {
  title?: string
  url?: string
  path?: string
  referrer?: string
  search?: string
  [key: string]: Primitive | Primitive[] | Record<string, Primitive>
}

export interface TrackEvent {
  event: string
  userId?: string
  anonymousId?: string
  properties?: EventProperties
  context?: EventContext
  timestamp?: string
  messageId?: string
}

export interface PageEvent {
  name?: string
  userId?: string
  anonymousId?: string
  properties?: PageProperties
  context?: EventContext
  timestamp?: string
  messageId?: string
}

export interface IdentifyEvent {
  userId: string
  anonymousId?: string
  traits?: UserTraits
  context?: EventContext
  timestamp?: string
  messageId?: string
}

export interface GroupEvent {
  userId: string
  groupId: string
  traits?: Record<string, Primitive | Primitive[] | Record<string, Primitive>>
  context?: EventContext
  timestamp?: string
  messageId?: string
}

export interface AliasEvent {
  userId: string
  previousId: string
  context?: EventContext
  timestamp?: string
  messageId?: string
}

export interface EventContext {
  library?: {
    name: string
    version: string
  }
  page?: {
    title?: string
    url?: string
    path?: string
    referrer?: string
    search?: string
  }
  userAgent?: string
  locale?: string
  timezone?: string
  screen?: {
    width?: number
    height?: number
  }
  campaign?: {
    name?: string
    source?: string
    medium?: string
    term?: string
    content?: string
  }
  [key: string]: Primitive | Record<string, Primitive> | undefined
}

export interface QueryOptions {
  event?: string
  userId?: string
  from?: string
  to?: string
  limit?: number
  offset?: number
  sort?: Record<string, 'asc' | 'desc'>
  filter?: Record<string, Primitive | Primitive[]>
}

export interface AggregateOptions {
  metric: 'count' | 'sum' | 'avg' | 'min' | 'max' | 'unique'
  field?: string
  groupBy?: string[]
  from?: string
  to?: string
  interval?: 'hour' | 'day' | 'week' | 'month'
  filter?: Record<string, Primitive | Primitive[]>
}

export interface CohortOptions {
  activation: string
  retention: string
  period: 'day' | 'week' | 'month'
  cohorts: number
  from?: string
}

export interface FunnelOptions {
  steps: string[]
  from?: string
  to?: string
  groupBy?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  limit: number
  offset: number
  hasMore: boolean
}

export interface AggregateResult {
  groups: Array<{
    key: Record<string, Primitive>
    value: number
  }>
  total: number
  from: string
  to: string
}

export interface CohortResult {
  cohorts: Array<{
    cohort: string
    size: number
    periods: Array<{
      period: number
      retained: number
      percentage: number
    }>
  }>
}

export interface FunnelResult {
  steps: Array<{
    step: string
    count: number
    percentage: number
    dropoff?: number
  }>
  conversion: number
}
