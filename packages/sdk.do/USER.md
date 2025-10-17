# User Object - SDK.do

The `.do` platform provides a comprehensive user management system that supports multi-tenant authentication, authorization, and analytics.

## Overview

The user object is designed to be a clean, simple abstraction that combines the best aspects of:

- **Payload CMS**: Role-based access control and custom fields
- **Better Auth**: Strong TypeScript support and extensible metadata
- **WorkOS**: Multi-tenant organization memberships and RBAC

## User Object Structure

```typescript
interface User {
  id: string
  email: string
  name?: string
  image?: string
  emailVerified?: boolean

  // Multi-tenant support
  organizations?: OrganizationMembership[]
  currentOrganization?: string // organizationId

  // Metadata (ISO 8601 date strings)
  createdAt: DateString
  updatedAt: DateString
  lastLoginAt?: DateString

  // Extensible metadata for custom fields
  metadata?: Record<string, any>
}
```

## Organization

Organizations are the top-level entities that users belong to:

```typescript
interface Organization {
  id: string
  name: string
  slug?: string
  image?: string
  createdAt: DateString
  updatedAt: DateString
  metadata?: Record<string, any>
}
```

## Organization Memberships

Users can belong to multiple organizations with different roles and permissions:

```typescript
interface OrganizationMembership {
  id: string
  organizationId: string
  role: string
  permissions?: string[]
  status: 'active' | 'invited' | 'suspended'
  createdAt: DateString
  updatedAt: DateString
}
```

## User Service API

The `user` service provides methods for managing user context, organizations, and permissions via RPC:

### Current User Context

```typescript
// Get the current authenticated user
const user = await $.user.current()

// Update the current user (only safe fields allowed)
const updated = await $.user.update({
  name: 'John Doe',
  image: 'https://example.com/avatar.jpg',
  metadata: { theme: 'dark' },
})
```

**Note**: The `update()` method uses `UserUpdateInput` which only allows updating safe user fields (`name`, `image`, `metadata`). Sensitive fields like `id`, `email`, `createdAt`, and `organizations` cannot be modified through this method.

### Organization Management

```typescript
// List all organizations for the current user (paginated)
const orgs = await $.user.listOrganizations({ limit: 20, offset: 0 })
console.log(`Showing ${orgs.items.length} of ${orgs.total} organizations`)
if (orgs.hasMore) {
  console.log('Load more...')
}

// Switch to a different organization context
const user = await $.user.switchOrganization('org_123')

// Get specific organization membership
const membership = await $.user.getOrganization('org_123')

// Get current organization membership (helper method)
const currentMembership = await $.user.getCurrentOrganizationMembership()
if (currentMembership) {
  console.log(`Current role: ${currentMembership.role}`)
  console.log(`Permissions: ${currentMembership.permissions?.join(', ') || 'none'}`)
} else {
  console.log('No current organization set')
}
```

**Edge Cases for `getCurrentOrganizationMembership()`:**

- Returns `null` if the user has no `currentOrganization` set
- Returns `null` if the user's `currentOrganization` is not in their `organizations` array
- Returns `null` if the user has no organizations at all
- Always validate the return value before accessing properties

### Permissions & Roles

```typescript
// Check if user has a specific permission
const canEdit = await $.user.hasPermission('posts.edit')

// Check permission in a specific organization
const canAdmin = await $.user.hasPermission('admin.access', 'org_123')

// Check if user has a role
const isAdmin = await $.user.hasRole('admin')

// Get all permissions for current organization
const permissions = await $.user.getPermissions()
```

### Analytics & Activity

```typescript
// Get user analytics
const analytics = await $.user.getAnalytics({
  startDate: '2025-01-01',
  endDate: '2025-12-31',
})

// Get user activity log
const activities = await $.user.getActivity({
  limit: 50,
  type: 'login',
})

// Get active sessions (paginated)
const sessions = await $.user.getSessions({ limit: 20, active: true })
console.log(`Active sessions: ${sessions.items.length} of ${sessions.total}`)

// Get all sessions with pagination
const allSessions = await $.user.getSessions({ limit: 50, offset: 0 })

// Revoke a specific session
await $.user.revokeSession('session_123')
```

## Usage Examples

### Basic User Information

```typescript
import { $ } from 'sdk.do'

// Get current user
const user = await $.user.current()

if (user) {
  console.log(`Welcome, ${user.name || user.email}!`)
  console.log(`Member of ${user.organizations?.length || 0} organizations`)
}
```

### Multi-Tenant Access Control

```typescript
import { $ } from 'sdk.do'

async function canUserEditPost(postId: string) {
  // Check if user has edit permission in current organization
  const canEdit = await $.user.hasPermission('posts.edit')

  if (!canEdit) {
    throw new Error('Insufficient permissions')
  }

  // Proceed with edit
  await $.db.update('posts', postId, { title: 'Updated Title' })
}
```

### Organization Switching

```typescript
import { $ } from 'sdk.do'

async function switchToOrganization(orgId: string) {
  // Switch user context to different organization
  const updatedUser = await $.user.switchOrganization(orgId)

  console.log(`Switched to: ${orgId}`)
  console.log(`Current role: ${updatedUser.organizations?.find((o) => o.organizationId === orgId)?.role}`)

  return updatedUser
}
```

### User Analytics Dashboard

```typescript
import { $ } from 'sdk.do'

async function getUserDashboardData() {
  const [user, analytics, recentActivity] = await Promise.all([$.user.current(), $.user.getAnalytics(), $.user.getActivity({ limit: 10 })])

  return {
    user,
    stats: {
      totalLogins: analytics.loginCount,
      activeSessions: analytics.activeSessions,
      organizations: analytics.organizationCount,
    },
    recentActivity,
  }
}
```

## Type Definitions

All user-related types are exported from `sdk.do`:

```typescript
import type {
  User,
  UserUpdateInput,
  Organization,
  OrganizationMembership,
  Session,
  Activity,
  UserAnalytics,
  AnalyticsOptions,
  ActivityOptions,
  DateString,
  UserService,
  Permission,
  PaginatedResponse,
  UserServiceError,
  UserServiceErrorCode,
} from 'sdk.do'
import { isValidDateString, toDateString, UserServiceErrorClass } from 'sdk.do'
```

### Type Safety

- **`DateString`**: Branded type for ISO 8601 date strings (e.g., "2025-10-10T10:30:00Z")
  - Use `toDateString(date)` to convert a Date object to DateString
  - Use `isValidDateString(str)` to validate a string is a valid ISO 8601 date
- **`UserUpdateInput`**: Safe subset of User fields that can be updated
- **`Session`**: Does not expose sensitive token field for security
- **`Permission`**: Type-safe permission string following `resource.action` pattern
- **`PaginatedResponse<T>`**: Paginated results with total count and hasMore flag

### Generic User Metadata

The `User`, `UserUpdateInput`, and `UserService` interfaces support generic metadata types for compile-time type safety:

```typescript
// Define your app's user metadata schema
interface MyAppUserMetadata {
  theme: 'light' | 'dark'
  language: string
  notifications: boolean
  preferences: {
    emailDigest: boolean
    twoFactorEnabled: boolean
  }
}

// Create type-safe user context
const user: User<MyAppUserMetadata> = await $.user.current()

// Type-safe metadata access
if (user?.metadata?.theme === 'dark') {
  // TypeScript knows theme is 'light' | 'dark'
}

// Type-safe updates
await $.user.update({
  metadata: {
    theme: 'light', // ✅ Valid
    language: 'es',
    notifications: false,
    preferences: {
      emailDigest: true,
      twoFactorEnabled: true,
    },
    // theme: 'blue' // ❌ TypeScript error: not assignable to 'light' | 'dark'
  },
})
```

### Permission Format

Permissions follow the `resource.action` pattern with compile-time type safety:

```typescript
type Permission = `${string}.${string}` // Template literal enforces pattern

// Examples:
const permissions: Permission[] = ['posts.edit', 'posts.delete', 'users.manage', 'admin.access', 'billing.view', 'analytics.export']

// ✅ Valid permissions
const valid1: Permission = 'posts.edit'
const valid2: Permission = 'users.manage'
const valid3: Permission = 'admin.full_access'

// ❌ TypeScript errors (invalid format)
// const invalid1: Permission = 'posts' // Missing dot and action
// const invalid2: Permission = 'edit' // Missing resource and dot
```

### Paginated Responses

List operations return paginated results:

```typescript
interface PaginatedResponse<T> {
  items: T[]
  total: number
  hasMore: boolean
  limit?: number
  offset?: number
}

// Example usage:
const result = await $.user.getActivity({ limit: 50, offset: 0 })
console.log(`Showing ${result.items.length} of ${result.total} activities`)
if (result.hasMore) {
  console.log('Load more...')
}
```

### Error Handling

The SDK provides a typed error class for user service operations:

```typescript
import { UserServiceErrorClass } from 'sdk.do'
import type { UserServiceErrorCode } from 'sdk.do'

try {
  await $.user.switchOrganization('org_invalid')
} catch (error) {
  if (error instanceof UserServiceErrorClass) {
    switch (error.code) {
      case 'UNAUTHORIZED':
        console.error('Not authorized to switch to this organization')
        break
      case 'NOT_FOUND':
        console.error('Organization not found')
        break
      case 'NETWORK_ERROR':
        console.error('Network error, please try again')
        break
      case 'INVALID_INPUT':
        console.error('Invalid input provided')
        break
      case 'FORBIDDEN':
        console.error('Action forbidden')
        break
    }
  }
}
```

### Date String Helpers

```typescript
import { toDateString, isValidDateString } from 'sdk.do'

// Convert Date to DateString
const now: DateString = toDateString() // Current time
const specific: DateString = toDateString(new Date('2025-10-10'))

// Validate date strings (validates format AND actual date values)
if (isValidDateString('2025-10-10T10:00:00Z')) {
  console.log('Valid ISO 8601 date')
}

// Catches invalid dates
isValidDateString('2025-13-01T10:00:00Z') // false (invalid month)
isValidDateString('2025-02-30T10:00:00Z') // false (invalid day)
isValidDateString('2025-10-10T25:00:00Z') // false (invalid hour)
```

## Common Patterns

### Error Handling with UserServiceError

```typescript
import { UserServiceErrorClass } from 'sdk.do'
import type { UserServiceErrorCode } from 'sdk.do'

try {
  await $.user.switchOrganization('org_invalid')
} catch (error) {
  if (error instanceof UserServiceErrorClass) {
    // Handle typed error codes
    switch (error.code) {
      case 'UNAUTHORIZED':
        console.error('Not authorized to switch to this organization')
        showToast('You do not have access to this organization')
        break

      case 'NOT_FOUND':
        console.error('Organization not found')
        showToast('Organization does not exist')
        break

      case 'NETWORK_ERROR':
        console.error('Network error, please try again')
        showToast('Connection failed, retrying...')
        // Implement retry logic
        break

      case 'INVALID_INPUT':
        console.error('Invalid input provided')
        showToast('Invalid organization ID')
        break

      case 'FORBIDDEN':
        console.error('Action forbidden')
        showToast('This action is not allowed')
        break
    }
  } else {
    // Handle unexpected errors
    console.error('Unexpected error:', error)
  }
}
```

### Caching User Context

```typescript
// Cache user data in request context
let cachedUser: User | null = null

async function getCurrentUser() {
  if (!cachedUser) {
    cachedUser = await $.user.current()
  }
  return cachedUser
}

// Invalidate cache on updates
async function updateUserProfile(data: UserUpdateInput) {
  const updated = await $.user.update(data)
  cachedUser = updated // Update cache
  return updated
}

// Clear cache on logout
function logout() {
  cachedUser = null
  // ... other logout logic
}
```

### Graceful Organization Switching

```typescript
async function switchToOrganization(orgId: string) {
  try {
    // Check if user has membership first
    const membership = await $.user.getOrganization(orgId)

    if (!membership) {
      throw new Error('You are not a member of this organization')
    }

    if (membership.status !== 'active') {
      throw new Error(`Membership status is ${membership.status}`)
    }

    // Perform the switch
    const updatedUser = await $.user.switchOrganization(orgId)

    // Update UI or state
    console.log(`Switched to: ${orgId}`)
    console.log(`Role: ${membership.role}`)

    return updatedUser
  } catch (error) {
    if (error instanceof UserServiceErrorClass && error.code === 'FORBIDDEN') {
      // Handle permission denied
      console.error('Permission denied')
      return null
    }
    throw error
  }
}
```

### Pagination Helper

```typescript
async function loadAllActivities(userId: string) {
  const allActivities: Activity[] = []
  let offset = 0
  const limit = 100

  while (true) {
    const result = await $.user.getActivity({ limit, offset })

    allActivities.push(...result.items)

    if (!result.hasMore) {
      break
    }

    offset += limit
  }

  return allActivities
}

// Or with async generator
async function* paginateActivities(options?: Omit<ActivityOptions, 'offset'>) {
  let offset = 0
  const limit = options?.limit || 50

  while (true) {
    const result = await $.user.getActivity({ ...options, limit, offset })

    yield* result.items

    if (!result.hasMore) {
      break
    }

    offset += limit
  }
}

// Usage
for await (const activity of paginateActivities({ type: 'login' })) {
  console.log(activity)
}
```

### Permission Guards

```typescript
// Create reusable permission guards
async function requirePermission(permission: Permission) {
  const hasPermission = await $.user.hasPermission(permission)

  if (!hasPermission) {
    throw new UserServiceError('FORBIDDEN', `Missing required permission: ${permission}`)
  }
}

async function requireRole(role: string) {
  const hasRole = await $.user.hasRole(role)

  if (!hasRole) {
    throw new UserServiceError('FORBIDDEN', `Missing required role: ${role}`)
  }
}

// Usage in API handlers
async function deletePost(postId: string) {
  await requirePermission('posts.delete')

  // Proceed with deletion
  await $.db.delete('posts', postId)
}

async function accessAdminPanel() {
  await requireRole('admin')

  // Proceed with admin operations
  // ...
}
```

### Session Management

```typescript
async function listActiveSessionsWithDetails() {
  const sessions = await $.user.getSessions({ active: true, limit: 50 })

  return sessions.items.map((session) => ({
    id: session.id,
    device: parseUserAgent(session.userAgent),
    location: lookupIP(session.ipAddress),
    expiresIn: calculateTimeRemaining(session.expiresAt),
    isCurrent: session.id === getCurrentSessionId(),
  }))
}

async function revokeAllOtherSessions(currentSessionId: string) {
  const allSessions = await $.user.getSessions({ limit: 100 })

  const otherSessions = allSessions.items.filter((s) => s.id !== currentSessionId)

  await Promise.all(otherSessions.map((s) => $.user.revokeSession(s.id)))

  console.log(`Revoked ${otherSessions.length} sessions`)
}
```

## Integration with Other Services

The user object integrates seamlessly with other SDK services:

```typescript
import { $ } from 'sdk.do'

// Get current user's posts
const user = await $.user.current()
const posts = await $.db.list('posts', {
  filter: { authorId: user?.id },
})

// Check permission before AI generation
const canGenerate = await $.user.hasPermission('ai.generate')
if (canGenerate) {
  const result = await $.ai.generate('Write a blog post about...')
}

// Log user activity
await $.db.create('activities', {
  userId: user?.id,
  type: 'post.created',
  description: 'Created a new blog post',
})
```

## RPC Implementation

The user service methods are implemented via CapnWeb RPC, allowing seamless communication between the SDK and the `.do` platform workers. All methods are fully typed and return Promises for async operations.

## Security Considerations

- User data is always fetched from the authenticated session
- Permissions are validated server-side via RPC
- Organization switching validates membership before allowing context change
- Session management includes revocation for security
- All sensitive fields (passwords, tokens) are never exposed in the User object
- The `Session` interface does not expose the `token` field to prevent accidental leakage
- `UserUpdateInput` restricts which fields can be modified, preventing unauthorized changes to `id`, `email`, `createdAt`, etc.

## Extensibility

The `metadata` field allows for custom user properties without modifying the core schema:

```typescript
await $.user.update({
  metadata: {
    theme: 'dark',
    language: 'en',
    notifications: true,
  },
})
```

## Migration Guide

### Migrating from Custom User Management

If you're migrating from a custom user management system, follow these steps:

#### 1. Map Your User Schema

```typescript
// Your existing user schema
interface OldUser {
  userId: string
  emailAddress: string
  fullName: string
  customField1: string
  customField2: number
}

// Map to new User type with metadata
interface MyMetadata {
  customField1: string
  customField2: number
}

const newUser: User<MyMetadata> = {
  id: oldUser.userId,
  email: oldUser.emailAddress,
  name: oldUser.fullName,
  createdAt: toDateString(new Date(oldUser.createdAt)),
  updatedAt: toDateString(new Date(oldUser.updatedAt)),
  metadata: {
    customField1: oldUser.customField1,
    customField2: oldUser.customField2,
  },
}
```

#### 2. Replace Authentication Calls

```typescript
// Before: Custom auth
const user = await customAuth.getCurrentUser()
await customAuth.checkAccess(user, 'posts.edit')

// After: SDK user service
const user = await $.user.current()
const canEdit = await $.user.hasPermission('posts.edit')
```

#### 3. Update Organization Logic

```typescript
// Before: Manual organization switching
await setUserOrganization(userId, orgId)
const role = await getUserRoleInOrg(userId, orgId)

// After: Built-in organization switching
const updatedUser = await $.user.switchOrganization(orgId)
const membership = await $.user.getCurrentOrganizationMembership()
console.log(`Role: ${membership?.role}`)
```

#### 4. Migrate Activity Logging

```typescript
// Before: Custom activity tracking
await activityLog.create({
  userId: user.id,
  action: 'login',
  timestamp: Date.now(),
})

// After: Use SDK activity tracking
// Activity is automatically logged by the platform
// Query it with:
const activities = await $.user.getActivity({ type: 'login', limit: 10 })
```

### Breaking Changes from Legacy Systems

- **Email is immutable**: Use `UserUpdateInput` which doesn't allow email changes. Handle email updates separately via verification flow.
- **Sessions are managed server-side**: Session tokens are never exposed in the client API.
- **Organization memberships are read-only**: Cannot directly modify memberships via user service; use organization management API.
- **Permissions are server-validated**: All permission checks go through RPC for security.

## Performance Considerations

### Caching Strategies

#### User Context Caching

The current user context can be expensive to fetch repeatedly. Implement request-level caching:

```typescript
// Per-request cache (e.g., in Express middleware)
app.use(async (req, res, next) => {
  req.user = await $.user.current()
  next()
})

// Use cached user throughout request lifecycle
app.get('/api/posts', async (req, res) => {
  const user = req.user // No additional RPC call
  // ...
})
```

**Cache Duration Recommendations:**

- **User data**: Cache for request duration (no persistent cache recommended)
- **Permissions**: Cache for 5-15 minutes with invalidation on role changes
- **Organization memberships**: Cache for request duration
- **Analytics**: Cache for 1-24 hours depending on use case

#### Permission Caching

Permission checks can be frequent. Consider caching with a short TTL:

```typescript
const permissionCache = new Map<string, { result: boolean; expiresAt: number }>()

async function hasPermissionCached(permission: Permission, orgId?: string): Promise<boolean> {
  const cacheKey = `${permission}:${orgId || 'default'}`
  const cached = permissionCache.get(cacheKey)

  if (cached && Date.now() < cached.expiresAt) {
    return cached.result
  }

  const result = await $.user.hasPermission(permission, orgId)

  permissionCache.set(cacheKey, {
    result,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
  })

  return result
}
```

**Important**: Always invalidate permission cache when:

- User switches organizations
- User role changes
- Permissions are modified

### Query Optimization

#### Batch Permission Checks

Instead of checking permissions one at a time:

```typescript
// ❌ Inefficient: Multiple RPC calls
const canEdit = await $.user.hasPermission('posts.edit')
const canDelete = await $.user.hasPermission('posts.delete')
const canPublish = await $.user.hasPermission('posts.publish')

// ✅ Efficient: Single RPC call
const permissions = await $.user.getPermissions()
const permissionSet = new Set(permissions)

const canEdit = permissionSet.has('posts.edit')
const canDelete = permissionSet.has('posts.delete')
const canPublish = permissionSet.has('posts.publish')
```

#### Pagination Best Practices

Always use pagination for list operations:

```typescript
// ❌ Avoid: Fetching all data at once
const allActivities = await loadAllActivities() // Could be thousands of records

// ✅ Better: Use pagination
const activities = await $.user.getActivity({ limit: 50, offset: 0 })

// ✅ Best: Progressive loading with hasMore flag
async function loadActivitiesProgressively() {
  let offset = 0
  const limit = 100

  while (true) {
    const batch = await $.user.getActivity({ limit, offset })

    // Process batch
    processBatch(batch.items)

    // Check if more data exists
    if (!batch.hasMore) break

    offset += limit
  }
}
```

### Network Performance

#### Parallel Requests

When fetching independent data, use `Promise.all()`:

```typescript
// ❌ Sequential: 600ms total (3 × 200ms)
const user = await $.user.current() // 200ms
const analytics = await $.user.getAnalytics() // 200ms
const activity = await $.user.getActivity({ limit: 10 }) // 200ms

// ✅ Parallel: 200ms total (max of all requests)
const [user, analytics, activity] = await Promise.all([$.user.current(), $.user.getAnalytics(), $.user.getActivity({ limit: 10 })])
```

#### Request Deduplication

Prevent duplicate in-flight requests:

```typescript
let currentUserRequest: Promise<User | null> | null = null

async function getCurrentUser(): Promise<User | null> {
  if (currentUserRequest) {
    return currentUserRequest
  }

  currentUserRequest = $.user.current()

  try {
    return await currentUserRequest
  } finally {
    currentUserRequest = null
  }
}
```

### Database/Analytics Performance

#### Activity Tracking Volume

Activity logging can generate high write volume:

- **Use sampling** for high-frequency events (e.g., page views)
- **Batch writes** when possible
- **Use analytics database** (ClickHouse, BigQuery) for historical queries

```typescript
// Sample high-frequency events
const shouldLog = Math.random() < 0.1 // Log 10% of events

if (shouldLog) {
  // Log activity
}
```

#### Analytics Query Optimization

Specify date ranges to limit query scope:

```typescript
// ❌ Expensive: Queries entire history
const analytics = await $.user.getAnalytics()

// ✅ Efficient: Limits to specific time range
const analytics = await $.user.getAnalytics({
  startDate: toDateString(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)), // Last 30 days
  endDate: toDateString(),
})
```

### Memory Considerations

#### Organization List Size

Users in many organizations can have large organization arrays:

```typescript
// For users with 100+ organizations, consider pagination
const orgs = await $.user.listOrganizations({ limit: 20, offset: 0 })

// Or lazy-load on demand
const membership = await $.user.getOrganization(orgId)
```

#### Session Management

Session lists can grow large over time:

```typescript
// ✅ Filter for active sessions only
const activeSessions = await $.user.getSessions({ active: true, limit: 10 })

// Regularly revoke old sessions
const sessions = await $.user.getSessions({ active: false })
sessions.items.forEach(async (session) => {
  if (isOlderThan(session.createdAt, '90 days')) {
    await $.user.revokeSession(session.id)
  }
})
```

### Performance Monitoring

Track key metrics:

- **P95 latency** for `$.user.current()` calls
- **Cache hit rate** for permission checks
- **RPC call volume** per request
- **Pagination usage** (avoid offset > 10000)

**Recommended Alerts:**

- `$.user.current()` P95 > 500ms
- Permission cache hit rate < 80%
- More than 5 RPC calls per request
- Pagination offset > 1000 (consider cursor-based pagination)

## Future Enhancements

Planned enhancements include:

- User preferences management
- Profile picture upload
- Email verification workflows
- Two-factor authentication support
- Audit log integration
- Advanced RBAC with custom permission models
- Cursor-based pagination for large datasets
- WebSocket support for real-time user updates
