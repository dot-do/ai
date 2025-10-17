/**
 * Composio E2E Tests
 *
 * End-to-end tests for Composio integration platform functionality.
 * Tests cover apps, actions, triggers, and connected accounts.
 *
 * Prerequisites:
 * - COMPOSIO_API_KEY environment variable must be set
 * - Test user account for connection testing
 *
 * Test Categories:
 * 1. App/Integration Management (5 tests)
 * 2. Action Discovery & Execution (6 tests)
 * 3. Trigger Management (4 tests)
 * 4. Connected Accounts (5 tests)
 * 5. Error Handling (3 tests)
 * 6. Integration Workflows (2 tests)
 */

import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import { E2ETestRunner } from './runner'
import { getTimeout } from './config'

describe('Composio E2E Tests', () => {
  let runner: E2ETestRunner

  beforeEach(() => {
    runner = new E2ETestRunner('composio')
  })

  afterEach(async () => {
    await runner.teardown()
  })

  // =============================================================================
  // App/Integration Management
  // =============================================================================

  test(
    'should list available apps with pagination',
    async () => {
      const sdk = runner.getSDK()

      const response = await sdk.api.composio.listApps({
        page: 1,
        pageSize: 20,
      })

      expect(response).toHaveProperty('items')
      expect(response).toHaveProperty('pageInfo')
      expect(response.items).toBeInstanceOf(Array)
      expect(response.items.length).toBeGreaterThan(0)
      expect(response.items.length).toBeLessThanOrEqual(20)

      // Verify app structure
      const app = response.items[0]
      expect(app).toHaveProperty('key')
      expect(app).toHaveProperty('name')
      expect(app).toHaveProperty('appId')
      expect(app).toHaveProperty('categories')
      expect(app).toHaveProperty('auth_schemes')
      expect(app.categories).toBeInstanceOf(Array)
      expect(app.auth_schemes).toBeInstanceOf(Array)
    },
    getTimeout()
  )

  test(
    'should search apps by name',
    async () => {
      const sdk = runner.getSDK()

      const response = await sdk.api.composio.listApps({
        search: 'github',
        pageSize: 10,
      })

      expect(response.items).toBeInstanceOf(Array)
      expect(response.items.length).toBeGreaterThan(0)

      // Verify all results contain "github" in name or key
      response.items.forEach((app) => {
        const searchTerm = 'github'
        const matchesSearch = app.name.toLowerCase().includes(searchTerm) || app.key.toLowerCase().includes(searchTerm)
        expect(matchesSearch).toBe(true)
      })
    },
    getTimeout()
  )

  test(
    'should get specific app details',
    async () => {
      const sdk = runner.getSDK()

      // Get GitHub app details
      const app = await sdk.api.composio.getApp('github')

      expect(app).toHaveProperty('key', 'github')
      expect(app).toHaveProperty('name')
      expect(app).toHaveProperty('description')
      expect(app).toHaveProperty('categories')
      expect(app).toHaveProperty('auth_schemes')
      expect(app.categories).toContain('developer_tools')
      expect(app.auth_schemes).toContain('OAUTH2')
    },
    getTimeout()
  )

  test(
    'should list apps by category',
    async () => {
      const sdk = runner.getSDK()

      // Get first page to see available categories
      const response = await sdk.api.composio.listApps({
        page: 1,
        pageSize: 50,
      })

      // Find apps with specific category (e.g., communication)
      const communicationApps = response.items.filter((app) => app.categories.includes('communication'))

      expect(communicationApps.length).toBeGreaterThan(0)
      communicationApps.forEach((app) => {
        expect(app.categories).toContain('communication')
      })
    },
    getTimeout()
  )

  test(
    'should handle pagination correctly',
    async () => {
      const sdk = runner.getSDK()

      // Get first page
      const page1 = await sdk.api.composio.listApps({
        page: 1,
        pageSize: 10,
      })

      // Get second page
      const page2 = await sdk.api.composio.listApps({
        page: 2,
        pageSize: 10,
      })

      expect(page1.items.length).toBe(10)
      expect(page2.items.length).toBeGreaterThan(0)

      // Verify pages are different
      const page1Keys = page1.items.map((app) => app.key)
      const page2Keys = page2.items.map((app) => app.key)
      const overlap = page1Keys.filter((key) => page2Keys.includes(key))
      expect(overlap.length).toBe(0)

      // Verify pagination info
      expect(page1.pageInfo.page).toBe(1)
      expect(page1.pageInfo.pageSize).toBe(10)
      expect(page1.pageInfo.hasNext).toBe(true)
    },
    getTimeout()
  )

  // =============================================================================
  // Action Discovery & Execution
  // =============================================================================

  test(
    'should list actions for specific app',
    async () => {
      const sdk = runner.getSDK()

      const actions = await sdk.api.composio.listActions({
        appName: 'github',
        pageSize: 20,
      })

      expect(actions).toBeInstanceOf(Array)
      expect(actions.length).toBeGreaterThan(0)

      // Verify action structure
      const action = actions[0]
      expect(action).toHaveProperty('name')
      expect(action).toHaveProperty('appName', 'github')
      expect(action).toHaveProperty('description')
      expect(action).toHaveProperty('parameters')
      expect(action.parameters).toHaveProperty('type', 'object')
      expect(action.parameters).toHaveProperty('properties')
    },
    getTimeout()
  )

  test(
    'should get specific action details',
    async () => {
      const sdk = runner.getSDK()

      // Get GitHub create issue action
      const action = await sdk.api.composio.getAction('GITHUB_CREATE_ISSUE')

      expect(action).toHaveProperty('name', 'GITHUB_CREATE_ISSUE')
      expect(action).toHaveProperty('appName', 'github')
      expect(action).toHaveProperty('description')
      expect(action.parameters).toHaveProperty('properties')

      // Verify required parameters
      const properties = action.parameters.properties
      expect(properties).toHaveProperty('owner')
      expect(properties).toHaveProperty('repo')
      expect(properties).toHaveProperty('title')
    },
    getTimeout()
  )

  test(
    'should list actions with search filter',
    async () => {
      const sdk = runner.getSDK()

      const actions = await sdk.api.composio.listActions({
        appName: 'github',
        search: 'issue',
        pageSize: 10,
      })

      expect(actions).toBeInstanceOf(Array)
      expect(actions.length).toBeGreaterThan(0)

      // Verify all actions relate to issues
      actions.forEach((action) => {
        const nameContainsIssue = action.name.toLowerCase().includes('issue')
        const descContainsIssue = action.description.toLowerCase().includes('issue')
        expect(nameContainsIssue || descContainsIssue).toBe(true)
      })
    },
    getTimeout()
  )

  test(
    'should execute action with valid parameters',
    async () => {
      const sdk = runner.getSDK()

      // Note: This requires a valid connected account
      // In real E2E tests, you would set this up in beforeEach
      const testUserId = `test_user_${runner.testId}`

      try {
        // Attempt to execute a simple action (like listing repos)
        // This may fail with authentication error, which is expected
        const result = await sdk.api.composio.executeAction({
          actionName: 'GITHUB_LIST_USER_REPOS',
          userId: testUserId,
          params: {
            username: 'octocat', // Public GitHub user
          },
        })

        // If we get here, the action executed successfully
        expect(result).toBeDefined()
      } catch (error: any) {
        // Expected to fail without connected account
        expect(error.message).toMatch(/connected account|authentication|not found/i)
      }
    },
    getTimeout()
  )

  test(
    'should validate action parameters',
    async () => {
      const sdk = runner.getSDK()

      // Get action to see required parameters
      const action = await sdk.api.composio.getAction('GITHUB_CREATE_ISSUE')

      expect(action.parameters.required).toContain('owner')
      expect(action.parameters.required).toContain('repo')
      expect(action.parameters.required).toContain('title')

      // Verify parameter schemas
      const properties = action.parameters.properties
      expect(properties.owner.type).toBe('string')
      expect(properties.repo.type).toBe('string')
      expect(properties.title.type).toBe('string')
    },
    getTimeout()
  )

  test(
    'should handle action execution errors',
    async () => {
      const sdk = runner.getSDK()

      await expect(
        sdk.api.composio.executeAction({
          actionName: 'INVALID_ACTION_NAME',
          userId: 'test_user',
          params: {},
        })
      ).rejects.toThrow()
    },
    getTimeout()
  )

  // =============================================================================
  // Trigger Management
  // =============================================================================

  test(
    'should list triggers for specific app',
    async () => {
      const sdk = runner.getSDK()

      const triggers = await sdk.api.composio.listTriggers({
        appName: 'github',
        pageSize: 20,
      })

      expect(triggers).toBeInstanceOf(Array)
      expect(triggers.length).toBeGreaterThan(0)

      // Verify trigger structure
      const trigger = triggers[0]
      expect(trigger).toHaveProperty('id')
      expect(trigger).toHaveProperty('name')
      expect(trigger).toHaveProperty('appName', 'github')
      expect(trigger).toHaveProperty('description')
    },
    getTimeout()
  )

  test(
    'should search triggers by name',
    async () => {
      const sdk = runner.getSDK()

      const triggers = await sdk.api.composio.listTriggers({
        appName: 'github',
        search: 'push',
        pageSize: 10,
      })

      expect(triggers).toBeInstanceOf(Array)
      expect(triggers.length).toBeGreaterThan(0)

      // Verify results contain "push"
      triggers.forEach((trigger) => {
        const matchesSearch = trigger.name.toLowerCase().includes('push') || trigger.description.toLowerCase().includes('push')
        expect(matchesSearch).toBe(true)
      })
    },
    getTimeout()
  )

  test(
    'should setup trigger for connected account',
    async () => {
      const sdk = runner.getSDK()
      const testUserId = `test_user_${runner.testId}`

      // Note: This requires a valid connected account
      // In real E2E tests, connection would be established first
      try {
        const triggerInstance = await sdk.api.composio.setupTrigger({
          userId: testUserId,
          triggerName: 'GITHUB_PUSH_EVENT',
          config: {
            repository: 'test/repo',
          },
        })

        // If successful, verify trigger instance
        expect(triggerInstance).toHaveProperty('id')
        expect(triggerInstance).toHaveProperty('name')

        // Register cleanup
        if (triggerInstance.id) {
          runner.registerCleanup(async () => {
            // Cleanup trigger (API method would be implemented)
            console.log(`Cleanup trigger: ${triggerInstance.id}`)
          })
        }
      } catch (error: any) {
        // Expected to fail without connected account
        expect(error.message).toMatch(/connected account|authentication|not found/i)
      }
    },
    getTimeout()
  )

  test(
    'should list all triggers across apps',
    async () => {
      const sdk = runner.getSDK()

      const triggers = await sdk.api.composio.listTriggers({
        pageSize: 50,
      })

      expect(triggers).toBeInstanceOf(Array)
      expect(triggers.length).toBeGreaterThan(0)

      // Verify we have triggers from multiple apps
      const appNames = new Set(triggers.map((t) => t.appName))
      expect(appNames.size).toBeGreaterThan(1)
    },
    getTimeout()
  )

  // =============================================================================
  // Connected Accounts
  // =============================================================================

  test(
    'should list connected accounts for user',
    async () => {
      const sdk = runner.getSDK()
      const testUserId = `test_user_${runner.testId}`

      const connections = await sdk.api.composio.listConnections({
        userId: testUserId,
      })

      expect(connections).toBeInstanceOf(Array)
      // May be empty if no connections exist
    },
    getTimeout()
  )

  test(
    'should filter connections by app',
    async () => {
      const sdk = runner.getSDK()
      const testUserId = `test_user_${runner.testId}`

      const connections = await sdk.api.composio.listConnections({
        userId: testUserId,
        appName: 'github',
      })

      expect(connections).toBeInstanceOf(Array)
      connections.forEach((conn) => {
        expect(conn.appName).toBe('github')
      })
    },
    getTimeout()
  )

  test(
    'should initiate connection for user',
    async () => {
      const sdk = runner.getSDK()
      const testUserId = `test_user_${runner.testId}`

      const result = await sdk.api.composio.initiateConnection({
        userId: testUserId,
        authConfigId: 'github',
        redirectUrl: 'https://example.com/callback',
      })

      expect(result).toHaveProperty('redirectUrl')
      expect(result).toHaveProperty('connectionId')
      expect(result.redirectUrl).toMatch(/^https:\/\//)

      // Register cleanup
      runner.registerCleanup(async () => {
        try {
          await sdk.api.composio.deleteConnection(result.connectionId)
        } catch (error) {
          console.warn(`Failed to cleanup connection: ${result.connectionId}`)
        }
      })
    },
    getTimeout()
  )

  test(
    'should get connection details',
    async () => {
      const sdk = runner.getSDK()
      const testUserId = `test_user_${runner.testId}`

      // First initiate a connection
      const init = await sdk.api.composio.initiateConnection({
        userId: testUserId,
        authConfigId: 'github',
      })

      // Then get connection details
      const connection = await sdk.api.composio.getConnection(init.connectionId)

      expect(connection).toHaveProperty('id', init.connectionId)
      expect(connection).toHaveProperty('userId', testUserId)
      expect(connection).toHaveProperty('status')
      expect(connection).toHaveProperty('createdAt')

      // Cleanup
      runner.registerCleanup(async () => {
        await sdk.api.composio.deleteConnection(init.connectionId)
      })
    },
    getTimeout()
  )

  test(
    'should delete connection',
    async () => {
      const sdk = runner.getSDK()
      const testUserId = `test_user_${runner.testId}`

      // Create connection
      const init = await sdk.api.composio.initiateConnection({
        userId: testUserId,
        authConfigId: 'github',
      })

      // Delete connection
      await sdk.api.composio.deleteConnection(init.connectionId)

      // Verify deletion
      await expect(sdk.api.composio.getConnection(init.connectionId)).rejects.toThrow()
    },
    getTimeout()
  )

  // =============================================================================
  // Error Handling
  // =============================================================================

  test(
    'should handle invalid app key',
    async () => {
      const sdk = runner.getSDK()

      await expect(sdk.api.composio.getApp('invalid_app_that_does_not_exist')).rejects.toThrow()
    },
    getTimeout()
  )

  test(
    'should handle invalid action name',
    async () => {
      const sdk = runner.getSDK()

      await expect(sdk.api.composio.getAction('INVALID_ACTION_NAME')).rejects.toThrow()
    },
    getTimeout()
  )

  test(
    'should handle invalid connection ID',
    async () => {
      const sdk = runner.getSDK()

      await expect(sdk.api.composio.getConnection('invalid_connection_id')).rejects.toThrow()
    },
    getTimeout()
  )

  // =============================================================================
  // Integration Workflows
  // =============================================================================

  test(
    'should complete full app discovery workflow',
    async () => {
      const sdk = runner.getSDK()

      // 1. List apps
      const apps = await sdk.api.composio.listApps({ pageSize: 10 })
      expect(apps.items.length).toBeGreaterThan(0)

      // 2. Get specific app
      const appKey = apps.items[0].key
      const app = await sdk.api.composio.getApp(appKey)
      expect(app.key).toBe(appKey)

      // 3. List actions for app
      const actions = await sdk.api.composio.listActions({
        appName: appKey,
        pageSize: 5,
      })
      expect(actions.length).toBeGreaterThan(0)

      // 4. Get action details
      const actionName = actions[0].name
      const action = await sdk.api.composio.getAction(actionName)
      expect(action.name).toBe(actionName)

      // 5. List triggers for app
      const triggers = await sdk.api.composio.listTriggers({
        appName: appKey,
        pageSize: 5,
      })
      // May be empty if app has no triggers
    },
    getTimeout()
  )

  test(
    'should complete connection lifecycle',
    async () => {
      const sdk = runner.getSDK()
      const testUserId = `test_user_${runner.testId}`

      // 1. List initial connections (should be empty)
      const initialConnections = await sdk.api.composio.listConnections({
        userId: testUserId,
      })

      // 2. Initiate new connection
      const init = await sdk.api.composio.initiateConnection({
        userId: testUserId,
        authConfigId: 'github',
        redirectUrl: 'https://example.com/callback',
      })

      expect(init.redirectUrl).toBeTruthy()
      expect(init.connectionId).toBeTruthy()

      // 3. Get connection details
      const connection = await sdk.api.composio.getConnection(init.connectionId)
      expect(connection.id).toBe(init.connectionId)
      expect(connection.userId).toBe(testUserId)

      // 4. List connections (should include new one)
      const updatedConnections = await sdk.api.composio.listConnections({
        userId: testUserId,
      })
      expect(updatedConnections.length).toBe(initialConnections.length + 1)

      // 5. Delete connection
      await sdk.api.composio.deleteConnection(init.connectionId)

      // 6. Verify deletion
      await expect(sdk.api.composio.getConnection(init.connectionId)).rejects.toThrow()

      // 7. List connections (should be back to initial state)
      const finalConnections = await sdk.api.composio.listConnections({
        userId: testUserId,
      })
      expect(finalConnections.length).toBe(initialConnections.length)
    },
    getTimeout()
  )
})
