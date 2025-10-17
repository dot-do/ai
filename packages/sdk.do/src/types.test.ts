import { describe, it, expect, vi } from 'vitest'
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
} from './types'
import { isValidDateString, toDateString, UserServiceError } from './types'

describe('User Types', () => {
  describe('User', () => {
    it('should have correct structure', () => {
      const user: User = {
        id: 'user_123',
        email: 'test@example.com',
        name: 'Test User',
        image: 'https://example.com/avatar.jpg',
        emailVerified: true,
        organizations: [],
        currentOrganization: 'org_123',
        createdAt: '2025-10-10T10:00:00Z',
        updatedAt: '2025-10-10T10:00:00Z',
        lastLoginAt: '2025-10-10T10:00:00Z',
        metadata: { theme: 'dark' },
      }

      expect(user.id).toBe('user_123')
      expect(user.email).toBe('test@example.com')
      expect(user.name).toBe('Test User')
    })

    it('should allow optional fields', () => {
      const minimalUser: User = {
        id: 'user_456',
        email: 'minimal@example.com',
        createdAt: '2025-10-10T10:00:00Z',
        updatedAt: '2025-10-10T10:00:00Z',
      }

      expect(minimalUser.id).toBe('user_456')
      expect(minimalUser.name).toBeUndefined()
      expect(minimalUser.organizations).toBeUndefined()
    })
  })

  describe('UserUpdateInput', () => {
    it('should only allow safe user fields', () => {
      const updateData: UserUpdateInput = {
        name: 'Updated Name',
        image: 'https://example.com/new-avatar.jpg',
        metadata: { theme: 'light' },
      }

      expect(updateData.name).toBe('Updated Name')
      expect(updateData.metadata?.theme).toBe('light')
    })

    it('should not allow updating sensitive fields', () => {
      // TypeScript will catch these at compile time
      // @ts-expect-error - id should not be in UserUpdateInput
      const invalid1: UserUpdateInput = { id: 'user_123' }
      // @ts-expect-error - email should not be in UserUpdateInput
      const invalid2: UserUpdateInput = { email: 'test@example.com' }
      // @ts-expect-error - createdAt should not be in UserUpdateInput
      const invalid3: UserUpdateInput = { createdAt: '2025-10-10T10:00:00Z' }

      expect(true).toBe(true) // Type checking happens at compile time
    })

    it('should allow partial updates', () => {
      const nameOnly: UserUpdateInput = { name: 'New Name' }
      const metadataOnly: UserUpdateInput = { metadata: { key: 'value' } }

      expect(nameOnly.name).toBe('New Name')
      expect(metadataOnly.metadata?.key).toBe('value')
    })
  })

  describe('Organization', () => {
    it('should have correct structure', () => {
      const org: Organization = {
        id: 'org_123',
        name: 'Acme Corp',
        slug: 'acme-corp',
        image: 'https://example.com/logo.jpg',
        createdAt: '2025-10-10T10:00:00Z',
        updatedAt: '2025-10-10T10:00:00Z',
        metadata: { industry: 'tech' },
      }

      expect(org.id).toBe('org_123')
      expect(org.name).toBe('Acme Corp')
      expect(org.slug).toBe('acme-corp')
    })

    it('should allow minimal organization', () => {
      const minimalOrg: Organization = {
        id: 'org_456',
        name: 'Minimal Org',
        createdAt: '2025-10-10T10:00:00Z',
        updatedAt: '2025-10-10T10:00:00Z',
      }

      expect(minimalOrg.slug).toBeUndefined()
      expect(minimalOrg.metadata).toBeUndefined()
    })
  })

  describe('OrganizationMembership', () => {
    it('should have correct structure', () => {
      const membership: OrganizationMembership = {
        id: 'mem_123',
        organizationId: 'org_123',
        role: 'admin',
        permissions: ['posts.edit', 'users.manage'],
        status: 'active',
        createdAt: '2025-10-10T10:00:00Z',
        updatedAt: '2025-10-10T10:00:00Z',
      }

      expect(membership.organizationId).toBe('org_123')
      expect(membership.role).toBe('admin')
      expect(membership.status).toBe('active')
      expect(membership.permissions).toContain('posts.edit')
    })

    it('should enforce status enum', () => {
      const activeStatus: OrganizationMembership = {
        id: 'mem_1',
        organizationId: 'org_1',
        role: 'member',
        status: 'active',
        createdAt: '2025-10-10T10:00:00Z',
        updatedAt: '2025-10-10T10:00:00Z',
      }

      const invitedStatus: OrganizationMembership = {
        id: 'mem_2',
        organizationId: 'org_2',
        role: 'member',
        status: 'invited',
        createdAt: '2025-10-10T10:00:00Z',
        updatedAt: '2025-10-10T10:00:00Z',
      }

      const suspendedStatus: OrganizationMembership = {
        id: 'mem_3',
        organizationId: 'org_3',
        role: 'member',
        status: 'suspended',
        createdAt: '2025-10-10T10:00:00Z',
        updatedAt: '2025-10-10T10:00:00Z',
      }

      expect(activeStatus.status).toBe('active')
      expect(invitedStatus.status).toBe('invited')
      expect(suspendedStatus.status).toBe('suspended')
    })
  })

  describe('Session', () => {
    it('should have correct structure without token', () => {
      const session: Session = {
        id: 'session_123',
        userId: 'user_123',
        expiresAt: '2025-10-11T10:00:00Z',
        createdAt: '2025-10-10T10:00:00Z',
        userAgent: 'Mozilla/5.0',
        ipAddress: '192.168.1.1',
      }

      expect(session.id).toBe('session_123')
      expect(session.userId).toBe('user_123')
      expect(session.expiresAt).toBe('2025-10-11T10:00:00Z')
    })

    it('should not expose token field', () => {
      const session: Session = {
        id: 'session_123',
        userId: 'user_123',
        expiresAt: '2025-10-11T10:00:00Z',
        createdAt: '2025-10-10T10:00:00Z',
      }

      // @ts-expect-error - token should not be in Session interface
      expect(session.token).toBeUndefined()
    })

    it('should allow optional fields', () => {
      const minimalSession: Session = {
        id: 'session_456',
        userId: 'user_456',
        expiresAt: '2025-10-11T10:00:00Z',
        createdAt: '2025-10-10T10:00:00Z',
      }

      expect(minimalSession.userAgent).toBeUndefined()
      expect(minimalSession.ipAddress).toBeUndefined()
    })
  })

  describe('Activity', () => {
    it('should have correct structure', () => {
      const activity: Activity = {
        id: 'activity_123',
        userId: 'user_123',
        type: 'login',
        description: 'User logged in',
        metadata: { ip: '192.168.1.1' },
        createdAt: '2025-10-10T10:00:00Z',
      }

      expect(activity.type).toBe('login')
      expect(activity.description).toBe('User logged in')
      expect(activity.metadata?.ip).toBe('192.168.1.1')
    })
  })

  describe('UserAnalytics', () => {
    it('should have correct structure', () => {
      const analytics: UserAnalytics = {
        userId: 'user_123',
        loginCount: 42,
        lastLogin: '2025-10-10T10:00:00Z',
        totalSessions: 50,
        activeSessions: 2,
        organizationCount: 3,
        metrics: { avgSessionDuration: 1800 },
      }

      expect(analytics.loginCount).toBe(42)
      expect(analytics.totalSessions).toBe(50)
      expect(analytics.activeSessions).toBe(2)
      expect(analytics.organizationCount).toBe(3)
    })

    it('should allow optional lastLogin', () => {
      const analytics: UserAnalytics = {
        userId: 'user_456',
        loginCount: 0,
        totalSessions: 0,
        activeSessions: 0,
        organizationCount: 0,
      }

      expect(analytics.lastLogin).toBeUndefined()
    })
  })

  describe('AnalyticsOptions', () => {
    it('should accept date filters', () => {
      const options: AnalyticsOptions = {
        startDate: '2025-01-01T00:00:00Z',
        endDate: '2025-12-31T23:59:59Z',
        metrics: ['loginCount', 'sessionDuration'],
      }

      expect(options.startDate).toBe('2025-01-01T00:00:00Z')
      expect(options.metrics).toContain('loginCount')
    })

    it('should allow empty options', () => {
      const options: AnalyticsOptions = {}
      expect(options).toEqual({})
    })
  })

  describe('ActivityOptions', () => {
    it('should accept pagination and filters', () => {
      const options: ActivityOptions = {
        limit: 50,
        offset: 0,
        type: 'login',
        startDate: '2025-10-01T00:00:00Z',
        endDate: '2025-10-31T23:59:59Z',
      }

      expect(options.limit).toBe(50)
      expect(options.type).toBe('login')
      expect(options.startDate).toBe('2025-10-01T00:00:00Z')
    })

    it('should allow empty options', () => {
      const options: ActivityOptions = {}
      expect(options).toEqual({})
    })
  })

  describe('DateString', () => {
    it('should be compatible with string type', () => {
      const date: DateString = '2025-10-10T10:00:00Z'
      expect(typeof date).toBe('string')
    })

    it('should allow ISO 8601 format', () => {
      const isoDate: DateString = '2025-10-10T10:30:45.123Z'
      expect(isoDate).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
    })
  })

  describe('UserService', () => {
    it('should define all required methods', () => {
      // This is a type-level test - we're just checking that the interface
      // has all expected methods with correct signatures
      const mockUserService: UserService = {
        current: async () => null,
        update: async (data: UserUpdateInput) => ({
          id: 'user_123',
          email: 'test@example.com',
          name: data.name,
          createdAt: toDateString(),
          updatedAt: toDateString(),
        }),
        switchOrganization: async (orgId: string) => ({
          id: 'user_123',
          email: 'test@example.com',
          currentOrganization: orgId,
          createdAt: toDateString(),
          updatedAt: toDateString(),
        }),
        listOrganizations: async () => ({
          items: [],
          total: 0,
          hasMore: false,
        }),
        getOrganization: async () => null,
        getCurrentOrganizationMembership: async () => null,
        hasPermission: async () => false,
        hasRole: async () => false,
        getPermissions: async () => [],
        getAnalytics: async () => ({
          userId: 'user_123',
          loginCount: 0,
          totalSessions: 0,
          activeSessions: 0,
          organizationCount: 0,
        }),
        getActivity: async () => ({
          items: [],
          total: 0,
          hasMore: false,
        }),
        getSessions: async () => ({
          items: [],
          total: 0,
          hasMore: false,
        }),
        revokeSession: async () => {},
      }

      expect(mockUserService.current).toBeDefined()
      expect(mockUserService.update).toBeDefined()
      expect(mockUserService.switchOrganization).toBeDefined()
      expect(mockUserService.hasPermission).toBeDefined()
      expect(mockUserService.getCurrentOrganizationMembership).toBeDefined()
    })
  })

  describe('Permission', () => {
    it('should be a string type', () => {
      const permission: Permission = 'posts.edit'
      expect(typeof permission).toBe('string')
    })

    it('should follow resource.action pattern', () => {
      const permissions: Permission[] = ['posts.edit', 'users.manage', 'admin.access']
      expect(permissions).toHaveLength(3)
      expect(permissions[0]).toBe('posts.edit')
    })
  })

  describe('PaginatedResponse', () => {
    it('should have correct structure', () => {
      const response: PaginatedResponse<Activity> = {
        items: [
          {
            id: 'activity_1',
            userId: 'user_123',
            type: 'login',
            description: 'User logged in',
            createdAt: toDateString(),
          },
        ],
        total: 100,
        hasMore: true,
        limit: 50,
        offset: 0,
      }

      expect(response.items).toHaveLength(1)
      expect(response.total).toBe(100)
      expect(response.hasMore).toBe(true)
    })

    it('should work with empty results', () => {
      const response: PaginatedResponse<Activity> = {
        items: [],
        total: 0,
        hasMore: false,
      }

      expect(response.items).toHaveLength(0)
      expect(response.hasMore).toBe(false)
    })
  })

  describe('UserServiceError', () => {
    it('should create error with code', () => {
      const error = new UserServiceError('UNAUTHORIZED', 'User not authorized')

      expect(error).toBeInstanceOf(Error)
      expect(error.name).toBe('UserServiceError')
      expect(error.code).toBe('UNAUTHORIZED')
      expect(error.message).toBe('User not authorized')
    })

    it('should support all error codes', () => {
      const codes = ['UNAUTHORIZED', 'NOT_FOUND', 'NETWORK_ERROR', 'INVALID_INPUT', 'FORBIDDEN'] as const

      codes.forEach((code) => {
        const error = new UserServiceError(code, `Test error: ${code}`)
        expect(error.code).toBe(code)
      })
    })
  })

  describe('DateString helpers', () => {
    describe('isValidDateString', () => {
      it('should validate valid ISO 8601 dates', () => {
        expect(isValidDateString('2025-10-10T10:00:00Z')).toBe(true)
        expect(isValidDateString('2025-10-10T10:30:45.123Z')).toBe(true)
      })

      it('should accept dates with milliseconds', () => {
        expect(isValidDateString('2025-10-10T10:00:00.000Z')).toBe(true)
        expect(isValidDateString('2025-10-10T10:00:00.123Z')).toBe(true)
        expect(isValidDateString('2025-10-10T10:00:00.999Z')).toBe(true)
      })

      it('should accept dates with timezone offsets', () => {
        expect(isValidDateString('2025-10-10T10:00:00+05:00')).toBe(true)
        expect(isValidDateString('2025-10-10T10:00:00-08:00')).toBe(true)
        expect(isValidDateString('2025-10-10T10:00:00.123+05:30')).toBe(true)
      })

      it('should reject invalid dates', () => {
        expect(isValidDateString('not a date')).toBe(false)
        expect(isValidDateString('2025-13-45')).toBe(false)
        expect(isValidDateString('')).toBe(false)
        // Test invalid month
        expect(isValidDateString('2025-13-01T10:00:00Z')).toBe(false)
        // Test invalid day
        expect(isValidDateString('2025-02-30T10:00:00Z')).toBe(false)
        // Test invalid time
        expect(isValidDateString('2025-10-10T25:00:00Z')).toBe(false)
      })
    })

    describe('toDateString', () => {
      it('should convert Date to DateString', () => {
        const date = new Date('2025-10-10T10:00:00Z')
        const dateString = toDateString(date)

        expect(typeof dateString).toBe('string')
        expect(dateString).toBe('2025-10-10T10:00:00.000Z')
      })

      it('should use current date when no argument provided', () => {
        const dateString = toDateString()
        expect(isValidDateString(dateString)).toBe(true)
      })
    })
  })

  describe('Generic User Metadata', () => {
    interface MyAppMetadata {
      theme: 'light' | 'dark'
      language: string
      notifications: boolean
    }

    it('should support type-safe metadata', () => {
      const user: User<MyAppMetadata> = {
        id: 'user_123',
        email: 'test@example.com',
        createdAt: toDateString(),
        updatedAt: toDateString(),
        metadata: {
          theme: 'dark',
          language: 'en',
          notifications: true,
        },
      }

      expect(user.metadata?.theme).toBe('dark')
      expect(user.metadata?.language).toBe('en')
      expect(user.metadata?.notifications).toBe(true)
    })

    it('should support type-safe update input', () => {
      const updateData: UserUpdateInput<MyAppMetadata> = {
        name: 'Updated Name',
        metadata: {
          theme: 'light',
          language: 'es',
          notifications: false,
        },
      }

      expect(updateData.metadata?.theme).toBe('light')
      expect(updateData.metadata?.language).toBe('es')
    })
  })

  describe('UserService Integration', () => {
    it('should fetch current user via RPC', async () => {
      const mockRPC = vi.fn().mockResolvedValue({
        id: 'user_123',
        email: 'test@example.com',
        createdAt: toDateString(),
        updatedAt: toDateString(),
      })

      const mockUserService: UserService = {
        current: async () => {
          const result = await mockRPC('user', 'current', [])
          return result
        },
        update: async () => ({ id: 'user_123', email: 'test@example.com', createdAt: toDateString(), updatedAt: toDateString() }),
        switchOrganization: async () => ({ id: 'user_123', email: 'test@example.com', createdAt: toDateString(), updatedAt: toDateString() }),
        listOrganizations: async () => ({ items: [], total: 0, hasMore: false }),
        getOrganization: async () => null,
        getCurrentOrganizationMembership: async () => null,
        hasPermission: async () => false,
        hasRole: async () => false,
        getPermissions: async () => [],
        getAnalytics: async () => ({ userId: 'user_123', loginCount: 0, totalSessions: 0, activeSessions: 0, organizationCount: 0 }),
        getActivity: async () => ({ items: [], total: 0, hasMore: false }),
        getSessions: async () => ({ items: [], total: 0, hasMore: false }),
        revokeSession: async () => {},
      }

      const user = await mockUserService.current()

      expect(mockRPC).toHaveBeenCalledWith('user', 'current', [])
      expect(user?.id).toBe('user_123')
      expect(user?.email).toBe('test@example.com')
    })

    it('should handle permission checks', async () => {
      const mockRPC = vi.fn().mockResolvedValue(true)

      const mockUserService: UserService = {
        current: async () => null,
        update: async () => ({ id: 'user_123', email: 'test@example.com', createdAt: toDateString(), updatedAt: toDateString() }),
        switchOrganization: async () => ({ id: 'user_123', email: 'test@example.com', createdAt: toDateString(), updatedAt: toDateString() }),
        listOrganizations: async () => ({ items: [], total: 0, hasMore: false }),
        getOrganization: async () => null,
        getCurrentOrganizationMembership: async () => null,
        hasPermission: async (permission: Permission) => {
          const result = await mockRPC('user', 'hasPermission', [permission])
          return result
        },
        hasRole: async () => false,
        getPermissions: async () => [],
        getAnalytics: async () => ({ userId: 'user_123', loginCount: 0, totalSessions: 0, activeSessions: 0, organizationCount: 0 }),
        getActivity: async () => ({ items: [], total: 0, hasMore: false }),
        getSessions: async () => ({ items: [], total: 0, hasMore: false }),
        revokeSession: async () => {},
      }

      const canEdit = await mockUserService.hasPermission('posts.edit')

      expect(mockRPC).toHaveBeenCalledWith('user', 'hasPermission', ['posts.edit'])
      expect(canEdit).toBe(true)
    })

    it('should handle paginated activity results', async () => {
      const mockActivities: Activity[] = [
        { id: 'activity_1', userId: 'user_123', type: 'login', description: 'Logged in', createdAt: toDateString() },
        { id: 'activity_2', userId: 'user_123', type: 'logout', description: 'Logged out', createdAt: toDateString() },
      ]

      const mockRPC = vi.fn().mockResolvedValue({
        items: mockActivities,
        total: 2,
        hasMore: false,
      })

      const mockUserService: UserService = {
        current: async () => null,
        update: async () => ({ id: 'user_123', email: 'test@example.com', createdAt: toDateString(), updatedAt: toDateString() }),
        switchOrganization: async () => ({ id: 'user_123', email: 'test@example.com', createdAt: toDateString(), updatedAt: toDateString() }),
        listOrganizations: async () => ({ items: [], total: 0, hasMore: false }),
        getOrganization: async () => null,
        getCurrentOrganizationMembership: async () => null,
        hasPermission: async () => false,
        hasRole: async () => false,
        getPermissions: async () => [],
        getAnalytics: async () => ({ userId: 'user_123', loginCount: 0, totalSessions: 0, activeSessions: 0, organizationCount: 0 }),
        getActivity: async (options?: ActivityOptions) => {
          const result = await mockRPC('user', 'getActivity', [options])
          return result
        },
        getSessions: async () => ({ items: [], total: 0, hasMore: false }),
        revokeSession: async () => {},
      }

      const result = await mockUserService.getActivity({ limit: 50, offset: 0 })

      expect(mockRPC).toHaveBeenCalledWith('user', 'getActivity', [{ limit: 50, offset: 0 }])
      expect(result.items).toHaveLength(2)
      expect(result.total).toBe(2)
      expect(result.hasMore).toBe(false)
    })

    it('should handle getCurrentOrganizationMembership', async () => {
      const mockMembership: OrganizationMembership = {
        id: 'mem_123',
        organizationId: 'org_123',
        role: 'admin',
        permissions: ['posts.edit', 'users.manage'],
        status: 'active',
        createdAt: toDateString(),
        updatedAt: toDateString(),
      }

      const mockRPC = vi.fn().mockResolvedValue(mockMembership)

      const mockUserService: UserService = {
        current: async () => null,
        update: async () => ({ id: 'user_123', email: 'test@example.com', createdAt: toDateString(), updatedAt: toDateString() }),
        switchOrganization: async () => ({ id: 'user_123', email: 'test@example.com', createdAt: toDateString(), updatedAt: toDateString() }),
        listOrganizations: async () => ({ items: [], total: 0, hasMore: false }),
        getOrganization: async () => null,
        getCurrentOrganizationMembership: async () => {
          const result = await mockRPC('user', 'getCurrentOrganizationMembership', [])
          return result
        },
        hasPermission: async () => false,
        hasRole: async () => false,
        getPermissions: async () => [],
        getAnalytics: async () => ({ userId: 'user_123', loginCount: 0, totalSessions: 0, activeSessions: 0, organizationCount: 0 }),
        getActivity: async () => ({ items: [], total: 0, hasMore: false }),
        getSessions: async () => ({ items: [], total: 0, hasMore: false }),
        revokeSession: async () => {},
      }

      const membership = await mockUserService.getCurrentOrganizationMembership()

      expect(mockRPC).toHaveBeenCalledWith('user', 'getCurrentOrganizationMembership', [])
      expect(membership?.id).toBe('mem_123')
      expect(membership?.role).toBe('admin')
      expect(membership?.permissions).toContain('posts.edit')
    })

    it('should handle paginated organizations list', async () => {
      const mockOrganizations: OrganizationMembership[] = [
        {
          id: 'mem_1',
          organizationId: 'org_1',
          role: 'admin',
          status: 'active',
          createdAt: toDateString(),
          updatedAt: toDateString(),
        },
        {
          id: 'mem_2',
          organizationId: 'org_2',
          role: 'member',
          status: 'active',
          createdAt: toDateString(),
          updatedAt: toDateString(),
        },
      ]

      const mockRPC = vi.fn().mockResolvedValue({
        items: mockOrganizations,
        total: 2,
        hasMore: false,
      })

      const mockUserService: UserService = {
        current: async () => null,
        update: async () => ({ id: 'user_123', email: 'test@example.com', createdAt: toDateString(), updatedAt: toDateString() }),
        switchOrganization: async () => ({ id: 'user_123', email: 'test@example.com', createdAt: toDateString(), updatedAt: toDateString() }),
        listOrganizations: async (options?: { limit?: number; offset?: number }) => {
          const result = await mockRPC('user', 'listOrganizations', [options])
          return result
        },
        getOrganization: async () => null,
        getCurrentOrganizationMembership: async () => null,
        hasPermission: async () => false,
        hasRole: async () => false,
        getPermissions: async () => [],
        getAnalytics: async () => ({ userId: 'user_123', loginCount: 0, totalSessions: 0, activeSessions: 0, organizationCount: 0 }),
        getActivity: async () => ({ items: [], total: 0, hasMore: false }),
        getSessions: async () => ({ items: [], total: 0, hasMore: false }),
        revokeSession: async () => {},
      }

      const result = await mockUserService.listOrganizations({ limit: 10, offset: 0 })

      expect(mockRPC).toHaveBeenCalledWith('user', 'listOrganizations', [{ limit: 10, offset: 0 }])
      expect(result.items).toHaveLength(2)
      expect(result.total).toBe(2)
      expect(result.hasMore).toBe(false)
    })

    it('should handle paginated sessions list', async () => {
      const mockSessions: Session[] = [
        {
          id: 'session_1',
          userId: 'user_123',
          expiresAt: toDateString(new Date(Date.now() + 86400000)),
          createdAt: toDateString(),
          userAgent: 'Mozilla/5.0',
        },
        {
          id: 'session_2',
          userId: 'user_123',
          expiresAt: toDateString(new Date(Date.now() + 86400000)),
          createdAt: toDateString(),
          userAgent: 'Chrome/90.0',
        },
      ]

      const mockRPC = vi.fn().mockResolvedValue({
        items: mockSessions,
        total: 2,
        hasMore: false,
      })

      const mockUserService: UserService = {
        current: async () => null,
        update: async () => ({ id: 'user_123', email: 'test@example.com', createdAt: toDateString(), updatedAt: toDateString() }),
        switchOrganization: async () => ({ id: 'user_123', email: 'test@example.com', createdAt: toDateString(), updatedAt: toDateString() }),
        listOrganizations: async () => ({ items: [], total: 0, hasMore: false }),
        getOrganization: async () => null,
        getCurrentOrganizationMembership: async () => null,
        hasPermission: async () => false,
        hasRole: async () => false,
        getPermissions: async () => [],
        getAnalytics: async () => ({ userId: 'user_123', loginCount: 0, totalSessions: 0, activeSessions: 0, organizationCount: 0 }),
        getActivity: async () => ({ items: [], total: 0, hasMore: false }),
        getSessions: async (options?: any) => {
          const result = await mockRPC('user', 'getSessions', [options])
          return result
        },
        revokeSession: async () => {},
      }

      const result = await mockUserService.getSessions({ limit: 10, active: true })

      expect(mockRPC).toHaveBeenCalledWith('user', 'getSessions', [{ limit: 10, active: true }])
      expect(result.items).toHaveLength(2)
      expect(result.total).toBe(2)
      expect(result.hasMore).toBe(false)
    })
  })

  describe('Permission Type Validation', () => {
    it('should accept valid permission strings', () => {
      const validPermissions: Permission[] = ['posts.edit', 'users.manage', 'admin.access', 'billing.view']

      expect(validPermissions).toHaveLength(4)
      expect(validPermissions[0]).toBe('posts.edit')
    })

    it('should enforce resource.action pattern at compile time', () => {
      // These are valid (compile-time check)
      const valid1: Permission = 'posts.edit'
      const valid2: Permission = 'users.delete'
      const valid3: Permission = 'admin.full_access'

      expect(valid1).toBe('posts.edit')
      expect(valid2).toBe('users.delete')
      expect(valid3).toBe('admin.full_access')

      // These would cause TypeScript errors (compile-time check):
      // const invalid1: Permission = 'posts' // ❌ Missing dot and action
      // const invalid2: Permission = 'edit' // ❌ Missing resource and dot
      // const invalid3: Permission = '' // ❌ Empty string
    })
  })

  describe('Error Handling', () => {
    it('should throw UserServiceError on unauthorized access', async () => {
      const mockRPC = vi.fn().mockRejectedValue(new UserServiceError('UNAUTHORIZED', 'Not authorized'))

      const mockUserService: UserService = {
        current: async () => null,
        update: async () => ({ id: 'user_123', email: 'test@example.com', createdAt: toDateString(), updatedAt: toDateString() }),
        switchOrganization: async (orgId: string) => {
          await mockRPC('user', 'switchOrganization', [orgId])
          return { id: 'user_123', email: 'test@example.com', createdAt: toDateString(), updatedAt: toDateString() }
        },
        listOrganizations: async () => ({ items: [], total: 0, hasMore: false }),
        getOrganization: async () => null,
        getCurrentOrganizationMembership: async () => null,
        hasPermission: async () => false,
        hasRole: async () => false,
        getPermissions: async () => [],
        getAnalytics: async () => ({ userId: 'user_123', loginCount: 0, totalSessions: 0, activeSessions: 0, organizationCount: 0 }),
        getActivity: async () => ({ items: [], total: 0, hasMore: false }),
        getSessions: async () => ({ items: [], total: 0, hasMore: false }),
        revokeSession: async () => {},
      }

      await expect(mockUserService.switchOrganization('org_invalid')).rejects.toThrow('Not authorized')
    })

    it('should handle empty pagination results', async () => {
      const emptyResult: PaginatedResponse<Activity> = {
        items: [],
        total: 0,
        hasMore: false,
      }

      expect(emptyResult.items).toHaveLength(0)
      expect(emptyResult.total).toBe(0)
      expect(emptyResult.hasMore).toBe(false)
    })

    it('should handle pagination with hasMore flag', async () => {
      const partialResult: PaginatedResponse<Activity> = {
        items: [{ id: 'activity_1', userId: 'user_123', type: 'login', description: 'Logged in', createdAt: toDateString() }],
        total: 100,
        hasMore: true,
        limit: 1,
        offset: 0,
      }

      expect(partialResult.items).toHaveLength(1)
      expect(partialResult.total).toBe(100)
      expect(partialResult.hasMore).toBe(true)
    })
  })

  describe('RPC Error Mapping', () => {
    it('should map unauthorized errors correctly', async () => {
      const mockRPC = vi.fn().mockRejectedValue(new UserServiceError('UNAUTHORIZED', 'User not authorized to access this resource'))

      const mockUserService: UserService = {
        current: async () => null,
        update: async () => {
          await mockRPC('user', 'update', [])
          return { id: 'user_123', email: 'test@example.com', createdAt: toDateString(), updatedAt: toDateString() }
        },
        switchOrganization: async () => ({ id: 'user_123', email: 'test@example.com', createdAt: toDateString(), updatedAt: toDateString() }),
        listOrganizations: async () => ({ items: [], total: 0, hasMore: false }),
        getOrganization: async () => null,
        getCurrentOrganizationMembership: async () => null,
        hasPermission: async () => false,
        hasRole: async () => false,
        getPermissions: async () => [],
        getAnalytics: async () => ({ userId: 'user_123', loginCount: 0, totalSessions: 0, activeSessions: 0, organizationCount: 0 }),
        getActivity: async () => ({ items: [], total: 0, hasMore: false }),
        getSessions: async () => ({ items: [], total: 0, hasMore: false }),
        revokeSession: async () => {},
      }

      await expect(mockUserService.update({ name: 'Test' })).rejects.toThrow(UserServiceError)
      await expect(mockUserService.update({ name: 'Test' })).rejects.toMatchObject({
        code: 'UNAUTHORIZED',
        message: 'User not authorized to access this resource',
      })
    })

    it('should map not found errors correctly', async () => {
      const mockRPC = vi.fn().mockRejectedValue(new UserServiceError('NOT_FOUND', 'Organization not found'))

      const mockUserService: UserService = {
        current: async () => null,
        update: async () => ({ id: 'user_123', email: 'test@example.com', createdAt: toDateString(), updatedAt: toDateString() }),
        switchOrganization: async () => ({ id: 'user_123', email: 'test@example.com', createdAt: toDateString(), updatedAt: toDateString() }),
        listOrganizations: async () => ({ items: [], total: 0, hasMore: false }),
        getOrganization: async (orgId: string) => {
          await mockRPC('user', 'getOrganization', [orgId])
          return null
        },
        getCurrentOrganizationMembership: async () => null,
        hasPermission: async () => false,
        hasRole: async () => false,
        getPermissions: async () => [],
        getAnalytics: async () => ({ userId: 'user_123', loginCount: 0, totalSessions: 0, activeSessions: 0, organizationCount: 0 }),
        getActivity: async () => ({ items: [], total: 0, hasMore: false }),
        getSessions: async () => ({ items: [], total: 0, hasMore: false }),
        revokeSession: async () => {},
      }

      await expect(mockUserService.getOrganization('org_invalid')).rejects.toThrow(UserServiceError)
      await expect(mockUserService.getOrganization('org_invalid')).rejects.toMatchObject({
        code: 'NOT_FOUND',
        message: 'Organization not found',
      })
    })

    it('should map forbidden errors correctly', async () => {
      const mockRPC = vi.fn().mockRejectedValue(new UserServiceError('FORBIDDEN', 'Access denied to this organization'))

      const mockUserService: UserService = {
        current: async () => null,
        update: async () => ({ id: 'user_123', email: 'test@example.com', createdAt: toDateString(), updatedAt: toDateString() }),
        switchOrganization: async (orgId: string) => {
          await mockRPC('user', 'switchOrganization', [orgId])
          return { id: 'user_123', email: 'test@example.com', createdAt: toDateString(), updatedAt: toDateString() }
        },
        listOrganizations: async () => ({ items: [], total: 0, hasMore: false }),
        getOrganization: async () => null,
        getCurrentOrganizationMembership: async () => null,
        hasPermission: async () => false,
        hasRole: async () => false,
        getPermissions: async () => [],
        getAnalytics: async () => ({ userId: 'user_123', loginCount: 0, totalSessions: 0, activeSessions: 0, organizationCount: 0 }),
        getActivity: async () => ({ items: [], total: 0, hasMore: false }),
        getSessions: async () => ({ items: [], total: 0, hasMore: false }),
        revokeSession: async () => {},
      }

      await expect(mockUserService.switchOrganization('org_forbidden')).rejects.toThrow(UserServiceError)
      await expect(mockUserService.switchOrganization('org_forbidden')).rejects.toMatchObject({
        code: 'FORBIDDEN',
        message: 'Access denied to this organization',
      })
    })

    it('should map invalid input errors correctly', async () => {
      const mockRPC = vi.fn().mockRejectedValue(new UserServiceError('INVALID_INPUT', 'Invalid email format'))

      const mockUserService: UserService = {
        current: async () => null,
        update: async (data: UserUpdateInput) => {
          await mockRPC('user', 'update', [data])
          return { id: 'user_123', email: 'test@example.com', createdAt: toDateString(), updatedAt: toDateString() }
        },
        switchOrganization: async () => ({ id: 'user_123', email: 'test@example.com', createdAt: toDateString(), updatedAt: toDateString() }),
        listOrganizations: async () => ({ items: [], total: 0, hasMore: false }),
        getOrganization: async () => null,
        getCurrentOrganizationMembership: async () => null,
        hasPermission: async () => false,
        hasRole: async () => false,
        getPermissions: async () => [],
        getAnalytics: async () => ({ userId: 'user_123', loginCount: 0, totalSessions: 0, activeSessions: 0, organizationCount: 0 }),
        getActivity: async () => ({ items: [], total: 0, hasMore: false }),
        getSessions: async () => ({ items: [], total: 0, hasMore: false }),
        revokeSession: async () => {},
      }

      await expect(mockUserService.update({ name: '' })).rejects.toThrow(UserServiceError)
      await expect(mockUserService.update({ name: '' })).rejects.toMatchObject({
        code: 'INVALID_INPUT',
        message: 'Invalid email format',
      })
    })

    it('should map network errors correctly', async () => {
      const mockRPC = vi.fn().mockRejectedValue(new UserServiceError('NETWORK_ERROR', 'Failed to connect to server'))

      const mockUserService: UserService = {
        current: async () => {
          await mockRPC('user', 'current', [])
          return null
        },
        update: async () => ({ id: 'user_123', email: 'test@example.com', createdAt: toDateString(), updatedAt: toDateString() }),
        switchOrganization: async () => ({ id: 'user_123', email: 'test@example.com', createdAt: toDateString(), updatedAt: toDateString() }),
        listOrganizations: async () => ({ items: [], total: 0, hasMore: false }),
        getOrganization: async () => null,
        getCurrentOrganizationMembership: async () => null,
        hasPermission: async () => false,
        hasRole: async () => false,
        getPermissions: async () => [],
        getAnalytics: async () => ({ userId: 'user_123', loginCount: 0, totalSessions: 0, activeSessions: 0, organizationCount: 0 }),
        getActivity: async () => ({ items: [], total: 0, hasMore: false }),
        getSessions: async () => ({ items: [], total: 0, hasMore: false }),
        revokeSession: async () => {},
      }

      await expect(mockUserService.current()).rejects.toThrow(UserServiceError)
      await expect(mockUserService.current()).rejects.toMatchObject({
        code: 'NETWORK_ERROR',
        message: 'Failed to connect to server',
      })
    })
  })
})
