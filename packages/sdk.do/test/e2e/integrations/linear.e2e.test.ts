/**
 * Linear Integration E2E Tests
 *
 * End-to-end tests for Linear API integration.
 * Tests cover issues, projects, teams, users, comments, labels, workflows, and webhooks.
 *
 * Prerequisites:
 * - LINEAR_API_KEY environment variable must be set (API key from linear.app/settings/api)
 * - LINEAR_TEAM_ID environment variable must be set (team ID to use for testing)
 * - API key requires read and write permissions
 *
 * Test Categories:
 * 1. Issue Operations (7 tests)
 * 2. Project Operations (4 tests)
 * 3. Team Operations (3 tests)
 * 4. User Operations (2 tests)
 * 5. Comment Operations (3 tests)
 * 6. Label Operations (3 tests)
 * 7. Workflow Operations (2 tests)
 * 8. Webhook Operations (1 test)
 * 9. Error Handling (1 test)
 */

import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import { E2ETestRunner } from '../runner'
import { getTimeout } from '../config'
import crypto from 'crypto'

describe('Linear Integration E2E Tests', () => {
  let runner: E2ETestRunner
  let createdIssues: string[] = []
  let createdProjects: string[] = []
  let createdComments: string[] = []
  let createdLabels: string[] = []
  let teamId: string

  beforeEach(async () => {
    runner = new E2ETestRunner('linear')

    // Check for API key
    const apiKey = process.env.LINEAR_API_KEY
    if (!apiKey) {
      throw new Error('LINEAR_API_KEY environment variable is required for Linear E2E tests')
    }

    // Check for team ID
    teamId = process.env.LINEAR_TEAM_ID || ''
    if (!teamId) {
      throw new Error('LINEAR_TEAM_ID environment variable is required for Linear E2E tests')
    }

    // Reset tracking arrays
    createdIssues = []
    createdProjects = []
    createdComments = []
    createdLabels = []
  })

  afterEach(async () => {
    const sdk = runner.getSDK()

    // Clean up comments (delete in reverse order)
    for (const commentId of [...createdComments].reverse()) {
      try {
        await sdk.api.linear.comments.delete(commentId)
      } catch (error) {
        console.warn(`Failed to delete comment ${commentId}:`, error)
      }
    }

    // Clean up labels (delete in reverse order)
    for (const labelId of [...createdLabels].reverse()) {
      try {
        await sdk.api.linear.labels.delete(labelId)
      } catch (error) {
        console.warn(`Failed to delete label ${labelId}:`, error)
      }
    }

    // Clean up issues (delete in reverse order)
    for (const issueId of [...createdIssues].reverse()) {
      try {
        await sdk.api.linear.issues.delete(issueId)
      } catch (error) {
        console.warn(`Failed to delete issue ${issueId}:`, error)
      }
    }

    // Clean up projects (delete in reverse order)
    for (const projectId of [...createdProjects].reverse()) {
      try {
        await sdk.api.linear.projects.delete(projectId)
      } catch (error) {
        console.warn(`Failed to delete project ${projectId}:`, error)
      }
    }

    await runner.teardown()
  })

  // =============================================================================
  // 1. Issue Operations (7 tests)
  // =============================================================================

  test(
    'should create issue with title and description',
    async () => {
      const sdk = runner.getSDK()
      const issueTitle = `E2E Test Issue - ${runner.testId}`
      const issueDescription = `This is a test issue created by E2E tests.\n\nTest ID: ${runner.testId}`

      // Create issue
      const result = await sdk.api.linear.issues.create({
        teamId,
        title: issueTitle,
        description: issueDescription,
        priority: 3, // Normal priority
      })

      expect(result).toBeDefined()
      expect(result.success).toBe(true)
      expect(result.issue).toBeDefined()
      expect(result.issue.id).toBeTruthy()
      expect(result.issue.title).toBe(issueTitle)
      expect(result.issue.description).toBe(issueDescription)
      expect(result.issue.teamId).toBe(teamId)
      expect(result.issue.priority).toBe(3)

      // Track for cleanup
      createdIssues.push(result.issue.id)
    },
    getTimeout()
  )

  test(
    'should get issue by ID',
    async () => {
      const sdk = runner.getSDK()
      const issueTitle = `Test Issue for Retrieval - ${runner.testId}`

      // Create issue first
      const created = await sdk.api.linear.issues.create({
        teamId,
        title: issueTitle,
        description: 'Testing issue retrieval',
      })

      createdIssues.push(created.issue.id)

      // Wait for issue to be fully created
      await runner.wait(1000)

      // Retrieve issue
      const retrieved = await sdk.api.linear.issues.get(created.issue.id)

      expect(retrieved).toBeDefined()
      expect(retrieved.id).toBe(created.issue.id)
      expect(retrieved.title).toBe(issueTitle)
      expect(retrieved.description).toBe('Testing issue retrieval')
      expect(retrieved.teamId).toBe(teamId)
    },
    getTimeout()
  )

  test(
    'should update issue title and description',
    async () => {
      const sdk = runner.getSDK()
      const initialTitle = `Initial Title - ${runner.testId}`
      const updatedTitle = `Updated Title - ${runner.testId}`
      const initialDescription = 'Initial description'
      const updatedDescription = 'Updated description with more details'

      // Create issue
      const created = await sdk.api.linear.issues.create({
        teamId,
        title: initialTitle,
        description: initialDescription,
      })

      createdIssues.push(created.issue.id)

      // Wait for issue to be created
      await runner.wait(1000)

      // Update issue
      const result = await sdk.api.linear.issues.update(created.issue.id, {
        title: updatedTitle,
        description: updatedDescription,
      })

      expect(result).toBeDefined()
      expect(result.success).toBe(true)
      expect(result.issue).toBeDefined()
      expect(result.issue.id).toBe(created.issue.id)

      // Verify update
      const retrieved = await sdk.api.linear.issues.get(created.issue.id)
      expect(retrieved.title).toBe(updatedTitle)
      expect(retrieved.description).toBe(updatedDescription)
    },
    getTimeout()
  )

  test(
    'should update issue state (workflow transition)',
    async () => {
      const sdk = runner.getSDK()
      const issueTitle = `State Transition Test - ${runner.testId}`

      // Create issue
      const created = await sdk.api.linear.issues.create({
        teamId,
        title: issueTitle,
        description: 'Testing state transitions',
      })

      createdIssues.push(created.issue.id)

      // Wait for issue to be created
      await runner.wait(1000)

      // Get workflow states for the team
      const states = await sdk.api.linear.workflows.listStates(teamId)
      expect(states).toBeDefined()
      expect(states.length).toBeGreaterThan(0)

      // Find a "Done" or "Completed" state
      const completedState = states.find((s: any) => s.name.toLowerCase().includes('done') || s.name.toLowerCase().includes('completed'))

      if (completedState) {
        // Update issue state
        const result = await sdk.api.linear.issues.update(created.issue.id, {
          stateId: completedState.id,
        })

        expect(result).toBeDefined()
        expect(result.success).toBe(true)

        // Verify state change
        const retrieved = await sdk.api.linear.issues.get(created.issue.id)
        expect(retrieved.stateId).toBe(completedState.id)
      }
    },
    getTimeout()
  )

  test(
    'should update issue priority',
    async () => {
      const sdk = runner.getSDK()
      const issueTitle = `Priority Test - ${runner.testId}`

      // Create issue with low priority
      const created = await sdk.api.linear.issues.create({
        teamId,
        title: issueTitle,
        description: 'Testing priority changes',
        priority: 4, // Low priority
      })

      createdIssues.push(created.issue.id)

      // Wait for issue to be created
      await runner.wait(1000)

      // Update to high priority (1)
      const result = await sdk.api.linear.issues.update(created.issue.id, {
        priority: 1, // Urgent
      })

      expect(result).toBeDefined()
      expect(result.success).toBe(true)

      // Verify priority change
      const retrieved = await sdk.api.linear.issues.get(created.issue.id)
      expect(retrieved.priority).toBe(1)
    },
    getTimeout()
  )

  test(
    'should assign issue to user',
    async () => {
      const sdk = runner.getSDK()
      const issueTitle = `Assignment Test - ${runner.testId}`

      // Get current user
      const currentUser = await sdk.api.linear.users.me()
      expect(currentUser).toBeDefined()
      expect(currentUser.id).toBeTruthy()

      // Create issue
      const created = await sdk.api.linear.issues.create({
        teamId,
        title: issueTitle,
        description: 'Testing issue assignment',
      })

      createdIssues.push(created.issue.id)

      // Wait for issue to be created
      await runner.wait(1000)

      // Assign issue to current user
      const result = await sdk.api.linear.issues.update(created.issue.id, {
        assigneeId: currentUser.id,
      })

      expect(result).toBeDefined()
      expect(result.success).toBe(true)

      // Verify assignment
      const retrieved = await sdk.api.linear.issues.get(created.issue.id)
      expect(retrieved.assigneeId).toBe(currentUser.id)
    },
    getTimeout()
  )

  test(
    'should delete issue',
    async () => {
      const sdk = runner.getSDK()
      const issueTitle = `Issue to Delete - ${runner.testId}`

      // Create issue
      const created = await sdk.api.linear.issues.create({
        teamId,
        title: issueTitle,
        description: 'This issue will be deleted',
      })

      // Wait for issue to be created
      await runner.wait(1000)

      // Delete issue
      const result = await sdk.api.linear.issues.delete(created.issue.id)

      expect(result).toBeDefined()
      expect(result.success).toBe(true)

      // Verify deletion (should throw or return null)
      await expect(sdk.api.linear.issues.get(created.issue.id)).rejects.toThrow()
    },
    getTimeout()
  )

  // =============================================================================
  // 2. Project Operations (4 tests)
  // =============================================================================

  test(
    'should create project',
    async () => {
      const sdk = runner.getSDK()
      const projectName = `E2E Test Project - ${runner.testId}`
      const projectDescription = `Test project created by E2E tests. Test ID: ${runner.testId}`

      // Create project
      const result = await sdk.api.linear.projects.create({
        teamIds: [teamId],
        name: projectName,
        description: projectDescription,
      })

      expect(result).toBeDefined()
      expect(result.success).toBe(true)
      expect(result.project).toBeDefined()
      expect(result.project.id).toBeTruthy()
      expect(result.project.name).toBe(projectName)
      expect(result.project.description).toBe(projectDescription)

      // Track for cleanup
      createdProjects.push(result.project.id)
    },
    getTimeout()
  )

  test(
    'should get project by ID',
    async () => {
      const sdk = runner.getSDK()
      const projectName = `Project for Retrieval - ${runner.testId}`

      // Create project first
      const created = await sdk.api.linear.projects.create({
        teamIds: [teamId],
        name: projectName,
        description: 'Testing project retrieval',
      })

      createdProjects.push(created.project.id)

      // Wait for project to be created
      await runner.wait(1000)

      // Retrieve project
      const retrieved = await sdk.api.linear.projects.get(created.project.id)

      expect(retrieved).toBeDefined()
      expect(retrieved.id).toBe(created.project.id)
      expect(retrieved.name).toBe(projectName)
      expect(retrieved.description).toBe('Testing project retrieval')
    },
    getTimeout()
  )

  test(
    'should update project',
    async () => {
      const sdk = runner.getSDK()
      const initialName = `Initial Project Name - ${runner.testId}`
      const updatedName = `Updated Project Name - ${runner.testId}`

      // Create project
      const created = await sdk.api.linear.projects.create({
        teamIds: [teamId],
        name: initialName,
        description: 'Initial description',
      })

      createdProjects.push(created.project.id)

      // Wait for project to be created
      await runner.wait(1000)

      // Update project
      const result = await sdk.api.linear.projects.update(created.project.id, {
        name: updatedName,
        description: 'Updated description',
      })

      expect(result).toBeDefined()
      expect(result.success).toBe(true)

      // Verify update
      const retrieved = await sdk.api.linear.projects.get(created.project.id)
      expect(retrieved.name).toBe(updatedName)
      expect(retrieved.description).toBe('Updated description')
    },
    getTimeout()
  )

  test(
    'should list projects for team',
    async () => {
      const sdk = runner.getSDK()
      const projectName = `List Test Project - ${runner.testId}`

      // Create test project
      const created = await sdk.api.linear.projects.create({
        teamIds: [teamId],
        name: projectName,
        description: 'Project for list testing',
      })

      createdProjects.push(created.project.id)

      // Wait for indexing
      await runner.wait(2000)

      // List projects for team
      const projects = await sdk.api.linear.projects.list({
        teamId,
      })

      expect(projects).toBeDefined()
      expect(Array.isArray(projects)).toBe(true)
      expect(projects.length).toBeGreaterThan(0)

      // Find our test project
      const testProject = projects.find((p: any) => p.id === created.project.id)
      expect(testProject).toBeDefined()
      expect(testProject.name).toBe(projectName)
    },
    getTimeout()
  )

  // =============================================================================
  // 3. Team Operations (3 tests)
  // =============================================================================

  test(
    'should get team by ID',
    async () => {
      const sdk = runner.getSDK()

      // Get team
      const team = await sdk.api.linear.teams.get(teamId)

      expect(team).toBeDefined()
      expect(team.id).toBe(teamId)
      expect(team.name).toBeTruthy()
      expect(team.key).toBeTruthy() // Team key (e.g., "ENG", "PROD")
    },
    getTimeout()
  )

  test(
    'should list all teams',
    async () => {
      const sdk = runner.getSDK()

      // List teams
      const teams = await sdk.api.linear.teams.list()

      expect(teams).toBeDefined()
      expect(Array.isArray(teams)).toBe(true)
      expect(teams.length).toBeGreaterThan(0)

      // Verify team structure
      const team = teams[0]
      expect(team.id).toBeTruthy()
      expect(team.name).toBeTruthy()
      expect(team.key).toBeTruthy()

      // Verify our test team exists
      const testTeam = teams.find((t: any) => t.id === teamId)
      expect(testTeam).toBeDefined()
    },
    getTimeout()
  )

  test(
    'should get team members',
    async () => {
      const sdk = runner.getSDK()

      // Get team members
      const members = await sdk.api.linear.teams.getMembers(teamId)

      expect(members).toBeDefined()
      expect(Array.isArray(members)).toBe(true)
      expect(members.length).toBeGreaterThan(0)

      // Verify member structure
      const member = members[0]
      expect(member.id).toBeTruthy()
      expect(member.name).toBeTruthy()
      expect(member.email).toBeTruthy()
    },
    getTimeout()
  )

  // =============================================================================
  // 4. User Operations (2 tests)
  // =============================================================================

  test(
    'should get current user',
    async () => {
      const sdk = runner.getSDK()

      // Get current user (bot or authenticated user)
      const user = await sdk.api.linear.users.me()

      expect(user).toBeDefined()
      expect(user.id).toBeTruthy()
      expect(user.name).toBeTruthy()
      expect(user.email).toBeTruthy()
      expect(user.active).toBe(true)
    },
    getTimeout()
  )

  test(
    'should list all users',
    async () => {
      const sdk = runner.getSDK()

      // List users
      const users = await sdk.api.linear.users.list()

      expect(users).toBeDefined()
      expect(Array.isArray(users)).toBe(true)
      expect(users.length).toBeGreaterThan(0)

      // Verify user structure
      const user = users[0]
      expect(user.id).toBeTruthy()
      expect(user.name).toBeTruthy()
      expect(user.email).toBeTruthy()
    },
    getTimeout()
  )

  // =============================================================================
  // 5. Comment Operations (3 tests)
  // =============================================================================

  test(
    'should create comment on issue',
    async () => {
      const sdk = runner.getSDK()
      const issueTitle = `Comment Test Issue - ${runner.testId}`
      const commentBody = `E2E test comment - ${runner.testId}`

      // Create issue first
      const issueResult = await sdk.api.linear.issues.create({
        teamId,
        title: issueTitle,
        description: 'Issue for comment testing',
      })

      createdIssues.push(issueResult.issue.id)

      // Wait for issue to be created
      await runner.wait(1000)

      // Create comment
      const result = await sdk.api.linear.comments.create({
        issueId: issueResult.issue.id,
        body: commentBody,
      })

      expect(result).toBeDefined()
      expect(result.success).toBe(true)
      expect(result.comment).toBeDefined()
      expect(result.comment.id).toBeTruthy()
      expect(result.comment.body).toBe(commentBody)
      expect(result.comment.issueId).toBe(issueResult.issue.id)

      // Track for cleanup
      createdComments.push(result.comment.id)
    },
    getTimeout()
  )

  test(
    'should update comment',
    async () => {
      const sdk = runner.getSDK()
      const issueTitle = `Comment Update Test - ${runner.testId}`
      const initialComment = 'Initial comment text'
      const updatedComment = 'Updated comment text with more details'

      // Create issue
      const issueResult = await sdk.api.linear.issues.create({
        teamId,
        title: issueTitle,
        description: 'Issue for comment update testing',
      })

      createdIssues.push(issueResult.issue.id)

      // Wait for issue to be created
      await runner.wait(1000)

      // Create comment
      const commentResult = await sdk.api.linear.comments.create({
        issueId: issueResult.issue.id,
        body: initialComment,
      })

      createdComments.push(commentResult.comment.id)

      // Wait for comment to be created
      await runner.wait(1000)

      // Update comment
      const result = await sdk.api.linear.comments.update(commentResult.comment.id, {
        body: updatedComment,
      })

      expect(result).toBeDefined()
      expect(result.success).toBe(true)

      // Verify update
      const retrieved = await sdk.api.linear.comments.get(commentResult.comment.id)
      expect(retrieved.body).toBe(updatedComment)
    },
    getTimeout()
  )

  test(
    'should delete comment',
    async () => {
      const sdk = runner.getSDK()
      const issueTitle = `Comment Delete Test - ${runner.testId}`
      const commentBody = 'Comment to be deleted'

      // Create issue
      const issueResult = await sdk.api.linear.issues.create({
        teamId,
        title: issueTitle,
        description: 'Issue for comment deletion testing',
      })

      createdIssues.push(issueResult.issue.id)

      // Wait for issue to be created
      await runner.wait(1000)

      // Create comment
      const commentResult = await sdk.api.linear.comments.create({
        issueId: issueResult.issue.id,
        body: commentBody,
      })

      // Wait for comment to be created
      await runner.wait(1000)

      // Delete comment
      const result = await sdk.api.linear.comments.delete(commentResult.comment.id)

      expect(result).toBeDefined()
      expect(result.success).toBe(true)

      // Verify deletion
      await expect(sdk.api.linear.comments.get(commentResult.comment.id)).rejects.toThrow()
    },
    getTimeout()
  )

  // =============================================================================
  // 6. Label Operations (3 tests)
  // =============================================================================

  test(
    'should create label',
    async () => {
      const sdk = runner.getSDK()
      const labelName = `e2e-test-${runner.testId}`
      const labelDescription = `E2E test label - ${runner.testId}`

      // Create label
      const result = await sdk.api.linear.labels.create({
        teamId,
        name: labelName,
        description: labelDescription,
        color: '#FF5733', // Orange color
      })

      expect(result).toBeDefined()
      expect(result.success).toBe(true)
      expect(result.label).toBeDefined()
      expect(result.label.id).toBeTruthy()
      expect(result.label.name).toBe(labelName)
      expect(result.label.description).toBe(labelDescription)
      expect(result.label.color).toBe('#FF5733')

      // Track for cleanup
      createdLabels.push(result.label.id)
    },
    getTimeout()
  )

  test(
    'should update label',
    async () => {
      const sdk = runner.getSDK()
      const initialName = `e2e-initial-${runner.testId}`
      const updatedName = `e2e-updated-${runner.testId}`

      // Create label
      const created = await sdk.api.linear.labels.create({
        teamId,
        name: initialName,
        description: 'Initial description',
        color: '#3366FF',
      })

      createdLabels.push(created.label.id)

      // Wait for label to be created
      await runner.wait(1000)

      // Update label
      const result = await sdk.api.linear.labels.update(created.label.id, {
        name: updatedName,
        description: 'Updated description',
        color: '#FF3366',
      })

      expect(result).toBeDefined()
      expect(result.success).toBe(true)

      // Verify update
      const retrieved = await sdk.api.linear.labels.get(created.label.id)
      expect(retrieved.name).toBe(updatedName)
      expect(retrieved.description).toBe('Updated description')
      expect(retrieved.color).toBe('#FF3366')
    },
    getTimeout()
  )

  test(
    'should list labels for team',
    async () => {
      const sdk = runner.getSDK()
      const labelName = `e2e-list-${runner.testId}`

      // Create test label
      const created = await sdk.api.linear.labels.create({
        teamId,
        name: labelName,
        description: 'Label for list testing',
        color: '#33FF66',
      })

      createdLabels.push(created.label.id)

      // Wait for indexing
      await runner.wait(1000)

      // List labels for team
      const labels = await sdk.api.linear.labels.list({
        teamId,
      })

      expect(labels).toBeDefined()
      expect(Array.isArray(labels)).toBe(true)
      expect(labels.length).toBeGreaterThan(0)

      // Find our test label
      const testLabel = labels.find((l: any) => l.id === created.label.id)
      expect(testLabel).toBeDefined()
      expect(testLabel.name).toBe(labelName)
    },
    getTimeout()
  )

  // =============================================================================
  // 7. Workflow Operations (2 tests)
  // =============================================================================

  test(
    'should get workflow state',
    async () => {
      const sdk = runner.getSDK()

      // Get workflow states for team
      const states = await sdk.api.linear.workflows.listStates(teamId)

      expect(states).toBeDefined()
      expect(Array.isArray(states)).toBe(true)
      expect(states.length).toBeGreaterThan(0)

      // Get first state details
      const state = states[0]
      expect(state.id).toBeTruthy()
      expect(state.name).toBeTruthy()
      expect(state.type).toBeTruthy() // e.g., "triage", "backlog", "started", "completed", "canceled"
      expect(state.teamId).toBe(teamId)

      // Get state by ID
      const retrieved = await sdk.api.linear.workflows.getState(state.id)
      expect(retrieved).toBeDefined()
      expect(retrieved.id).toBe(state.id)
      expect(retrieved.name).toBe(state.name)
    },
    getTimeout()
  )

  test(
    'should list workflow states for team',
    async () => {
      const sdk = runner.getSDK()

      // List workflow states
      const states = await sdk.api.linear.workflows.listStates(teamId)

      expect(states).toBeDefined()
      expect(Array.isArray(states)).toBe(true)
      expect(states.length).toBeGreaterThan(0)

      // Verify state structure
      states.forEach((state: any) => {
        expect(state.id).toBeTruthy()
        expect(state.name).toBeTruthy()
        expect(state.type).toBeTruthy()
        expect(state.teamId).toBe(teamId)
      })

      // Verify common states exist
      const stateNames = states.map((s: any) => s.name.toLowerCase())
      const hasBacklog = stateNames.some((n: string) => n.includes('backlog') || n.includes('todo'))
      const hasInProgress = stateNames.some((n: string) => n.includes('progress') || n.includes('started'))
      const hasDone = stateNames.some((n: string) => n.includes('done') || n.includes('completed'))

      expect(hasBacklog || hasInProgress || hasDone).toBe(true)
    },
    getTimeout()
  )

  // =============================================================================
  // 8. Webhook Operations (1 test)
  // =============================================================================

  test(
    'should verify webhook signature',
    async () => {
      const sdk = runner.getSDK()

      // Linear webhook secret (from webhook configuration)
      const webhookSecret = process.env.LINEAR_WEBHOOK_SECRET || 'test-webhook-secret'

      // Create test webhook payload
      const payload = JSON.stringify({
        action: 'create',
        type: 'Issue',
        data: {
          id: 'test-issue-id',
          title: 'Test Issue',
          teamId,
        },
        createdAt: new Date().toISOString(),
      })

      // Generate valid signature (Linear uses HMAC SHA256)
      const signature = crypto.createHmac('sha256', webhookSecret).update(payload).digest('hex')

      // Verify signature
      const isValid = await sdk.api.linear.webhooks.verify({
        body: payload,
        signature,
        secret: webhookSecret,
      })

      expect(isValid).toBe(true)

      // Test with invalid signature
      const invalidSignature = 'invalid_signature_value'
      const isInvalid = await sdk.api.linear.webhooks.verify({
        body: payload,
        signature: invalidSignature,
        secret: webhookSecret,
      })

      expect(isInvalid).toBe(false)
    },
    getTimeout()
  )

  // =============================================================================
  // 9. Error Handling (1 test)
  // =============================================================================

  test(
    'should handle various Linear API errors',
    async () => {
      const sdk = runner.getSDK()

      // Test 1: Unauthorized (invalid API key)
      try {
        await sdk.api.linear.withToken('lin_api_invalid_token').users.me()
        expect(true).toBe(false) // Should not reach here
      } catch (error: any) {
        expect(error).toBeDefined()
        expect(error.message).toBeTruthy()
        expect(error.message.toLowerCase()).toMatch(/unauthorized|invalid|authentication/)
      }

      // Test 2: Not found (non-existent issue)
      try {
        await sdk.api.linear.issues.get('00000000-0000-0000-0000-000000000000')
        expect(true).toBe(false) // Should not reach here
      } catch (error: any) {
        expect(error).toBeDefined()
        expect(error.message).toBeTruthy()
        expect(error.message.toLowerCase()).toMatch(/not found|does not exist/)
      }

      // Test 3: Rate limit
      // Linear rate limit: 100 requests per minute (burst), 1000 per hour
      // This test documents expected rate limit behavior
      try {
        // Check if rate limit info is available in response headers
        const issues = await sdk.api.linear.issues.list({ teamId })
        expect(issues).toBeDefined()
      } catch (error: any) {
        // If rate limited, error should indicate this
        if (error.message.toLowerCase().includes('rate limit')) {
          expect(error.message).toMatch(/rate limit|too many requests/i)
        }
      }

      // Test 4: Validation error (invalid priority)
      try {
        await sdk.api.linear.issues.create({
          teamId,
          title: 'Test Issue',
          priority: 999, // Invalid priority (should be 0-4)
        })
        expect(true).toBe(false) // Should not reach here
      } catch (error: any) {
        expect(error).toBeDefined()
        expect(error.message).toBeTruthy()
        expect(error.message.toLowerCase()).toMatch(/invalid|validation|priority/)
      }
    },
    getTimeout()
  )
})
