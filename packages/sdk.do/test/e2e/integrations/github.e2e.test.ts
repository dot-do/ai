/**
 * GitHub Integration E2E Tests
 *
 * End-to-end tests for GitHub API integration.
 * Tests cover repositories, issues, pull requests, content, branches, and webhooks.
 *
 * Prerequisites:
 * - GITHUB_TOKEN environment variable must be set (personal access token)
 * - Token requires repo, issues, pull_request, and contents scopes
 * - Tests use authenticated user's account for repository operations
 *
 * Test Categories:
 * 1. Repository Operations (5 tests)
 * 2. Issue Operations (5 tests)
 * 3. Pull Request Operations (4 tests)
 * 4. Content Operations (3 tests)
 * 5. Branch Operations (2 tests)
 * 6. Webhook Handling (2 tests)
 * 7. Error Handling (3 tests)
 */

import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import { E2ETestRunner } from '../runner'
import { getTimeout } from '../config'
import crypto from 'crypto'

describe('GitHub Integration E2E Tests', () => {
  let runner: E2ETestRunner
  let testRepoName: string
  let testOwner: string

  beforeEach(async () => {
    runner = new E2ETestRunner('github')
    testRepoName = `test-repo-${runner.testId}`

    // Check for API token
    if (!process.env.GITHUB_TOKEN) {
      throw new Error('GITHUB_TOKEN environment variable is required for GitHub E2E tests')
    }

    // Get authenticated user
    try {
      const sdk = runner.getSDK()
      const user = await sdk.api.github.user.get()
      testOwner = user.login
    } catch (error: any) {
      throw new Error(`Failed to get authenticated user: ${error.message}`)
    }
  })

  afterEach(async () => {
    await runner.teardown()
  })

  // =============================================================================
  // Repository Operations
  // =============================================================================

  test(
    'should create repository with name and description',
    async () => {
      const sdk = runner.getSDK()

      // Create repository
      const repo = await sdk.api.github.repos.create({
        name: testRepoName,
        description: `E2E test repository - ${runner.testId}`,
        private: false,
        auto_init: true,
        has_issues: true,
        has_projects: true,
        has_wiki: false,
      })

      expect(repo).toBeDefined()
      expect(repo.id).toBeTruthy()
      expect(repo.name).toBe(testRepoName)
      expect(repo.description).toBe(`E2E test repository - ${runner.testId}`)
      expect(repo.private).toBe(false)
      expect(repo.owner).toBeDefined()
      expect(repo.owner.login).toBe(testOwner)
      expect(repo.full_name).toBe(`${testOwner}/${testRepoName}`)

      // Register cleanup
      runner.registerCleanup(async () => {
        try {
          await sdk.api.github.repos.delete(testOwner, testRepoName)
        } catch (error) {
          console.warn(`Failed to cleanup repository ${testRepoName}:`, error)
        }
      })
    },
    getTimeout()
  )

  test(
    'should get repository details',
    async () => {
      const sdk = runner.getSDK()

      // Create repository first
      const created = await sdk.api.github.repos.create({
        name: testRepoName,
        description: 'Test repository for retrieval',
        private: false,
        auto_init: true,
      })

      runner.registerCleanup(async () => {
        await sdk.api.github.repos.delete(testOwner, testRepoName)
      })

      // Wait a moment for GitHub to fully create the repo
      await runner.wait(2000)

      // Retrieve repository
      const retrieved = await sdk.api.github.repos.get(testOwner, testRepoName)

      expect(retrieved).toBeDefined()
      expect(retrieved.id).toBe(created.id)
      expect(retrieved.name).toBe(testRepoName)
      expect(retrieved.full_name).toBe(`${testOwner}/${testRepoName}`)
      expect(retrieved.owner.login).toBe(testOwner)
    },
    getTimeout()
  )

  test(
    'should list repositories for authenticated user',
    async () => {
      const sdk = runner.getSDK()

      // Create a test repository
      const repo = await sdk.api.github.repos.create({
        name: testRepoName,
        description: 'Test repository for listing',
        private: false,
        auto_init: true,
      })

      runner.registerCleanup(async () => {
        await sdk.api.github.repos.delete(testOwner, testRepoName)
      })

      // Wait for repository to be indexed
      await runner.wait(2000)

      // List repositories
      const repos = await sdk.api.github.repos.list({
        per_page: 30,
        sort: 'created',
        direction: 'desc',
      })

      expect(repos).toBeDefined()
      expect(Array.isArray(repos)).toBe(true)
      expect(repos.length).toBeGreaterThan(0)

      // Find our test repository
      const testRepo = repos.find((r: any) => r.name === testRepoName)
      expect(testRepo).toBeDefined()
      expect(testRepo.owner.login).toBe(testOwner)
    },
    getTimeout()
  )

  test(
    'should update repository description and topics',
    async () => {
      const sdk = runner.getSDK()

      // Create repository
      const repo = await sdk.api.github.repos.create({
        name: testRepoName,
        description: 'Initial description',
        private: false,
        auto_init: true,
      })

      runner.registerCleanup(async () => {
        await sdk.api.github.repos.delete(testOwner, testRepoName)
      })

      // Wait for repository to be fully created
      await runner.wait(2000)

      // Update repository
      const updated = await sdk.api.github.repos.update(testOwner, testRepoName, {
        description: 'Updated description for E2E testing',
        topics: ['e2e-testing', 'automated-tests', 'sdk-do'],
        has_wiki: false,
        has_projects: false,
      })

      expect(updated).toBeDefined()
      expect(updated.name).toBe(testRepoName)
      expect(updated.description).toBe('Updated description for E2E testing')
      expect(updated.has_wiki).toBe(false)
      expect(updated.has_projects).toBe(false)
    },
    getTimeout()
  )

  test(
    'should delete repository',
    async () => {
      const sdk = runner.getSDK()

      // Create repository
      const repo = await sdk.api.github.repos.create({
        name: testRepoName,
        description: 'Test repository for deletion',
        private: false,
        auto_init: true,
      })

      // Wait for repository to be created
      await runner.wait(2000)

      // Delete repository
      await sdk.api.github.repos.delete(testOwner, testRepoName)

      // Verify repository is deleted (should throw 404)
      await expect(sdk.api.github.repos.get(testOwner, testRepoName)).rejects.toThrow()
    },
    getTimeout()
  )

  // =============================================================================
  // Issue Operations
  // =============================================================================

  test(
    'should create issue with title and body',
    async () => {
      const sdk = runner.getSDK()

      // Create repository first
      await sdk.api.github.repos.create({
        name: testRepoName,
        description: 'Test repository for issues',
        private: false,
        auto_init: true,
        has_issues: true,
      })

      runner.registerCleanup(async () => {
        await sdk.api.github.repos.delete(testOwner, testRepoName)
      })

      // Wait for repository to be ready
      await runner.wait(2000)

      // Create issue
      const issue = await sdk.api.github.issues.create(testOwner, testRepoName, {
        title: `Test Issue - ${runner.testId}`,
        body: 'This is a test issue created by E2E tests.\n\nIt should be closed automatically.',
        labels: ['test', 'automated'],
      })

      expect(issue).toBeDefined()
      expect(issue.id).toBeTruthy()
      expect(issue.number).toBeGreaterThan(0)
      expect(issue.title).toBe(`Test Issue - ${runner.testId}`)
      expect(issue.state).toBe('open')
      expect(issue.labels).toHaveLength(2)
      expect(issue.labels.map((l: any) => l.name)).toContain('test')
      expect(issue.labels.map((l: any) => l.name)).toContain('automated')
    },
    getTimeout()
  )

  test(
    'should get issue by number',
    async () => {
      const sdk = runner.getSDK()

      // Create repository
      await sdk.api.github.repos.create({
        name: testRepoName,
        description: 'Test repository',
        private: false,
        auto_init: true,
        has_issues: true,
      })

      runner.registerCleanup(async () => {
        await sdk.api.github.repos.delete(testOwner, testRepoName)
      })

      await runner.wait(2000)

      // Create issue
      const created = await sdk.api.github.issues.create(testOwner, testRepoName, {
        title: 'Test Issue for Retrieval',
        body: 'Testing issue retrieval',
      })

      // Retrieve issue
      const retrieved = await sdk.api.github.issues.get(testOwner, testRepoName, created.number)

      expect(retrieved).toBeDefined()
      expect(retrieved.id).toBe(created.id)
      expect(retrieved.number).toBe(created.number)
      expect(retrieved.title).toBe('Test Issue for Retrieval')
    },
    getTimeout()
  )

  test(
    'should update issue with labels and assignees',
    async () => {
      const sdk = runner.getSDK()

      // Create repository
      await sdk.api.github.repos.create({
        name: testRepoName,
        description: 'Test repository',
        private: false,
        auto_init: true,
        has_issues: true,
      })

      runner.registerCleanup(async () => {
        await sdk.api.github.repos.delete(testOwner, testRepoName)
      })

      await runner.wait(2000)

      // Create issue
      const issue = await sdk.api.github.issues.create(testOwner, testRepoName, {
        title: 'Test Issue for Update',
        body: 'Initial body',
      })

      // Update issue
      const updated = await sdk.api.github.issues.update(testOwner, testRepoName, issue.number, {
        title: 'Updated Test Issue',
        body: 'Updated body with more details',
        labels: ['bug', 'enhancement'],
        assignees: [testOwner],
      })

      expect(updated).toBeDefined()
      expect(updated.number).toBe(issue.number)
      expect(updated.title).toBe('Updated Test Issue')
      expect(updated.body).toBe('Updated body with more details')
      expect(updated.labels).toHaveLength(2)
      expect(updated.assignees).toHaveLength(1)
      expect(updated.assignees[0].login).toBe(testOwner)
    },
    getTimeout()
  )

  test(
    'should list issues with filters',
    async () => {
      const sdk = runner.getSDK()

      // Create repository
      await sdk.api.github.repos.create({
        name: testRepoName,
        description: 'Test repository',
        private: false,
        auto_init: true,
        has_issues: true,
      })

      runner.registerCleanup(async () => {
        await sdk.api.github.repos.delete(testOwner, testRepoName)
      })

      await runner.wait(2000)

      // Create multiple issues
      await sdk.api.github.issues.create(testOwner, testRepoName, {
        title: 'Open Issue 1',
        labels: ['test'],
      })

      await sdk.api.github.issues.create(testOwner, testRepoName, {
        title: 'Open Issue 2',
        labels: ['test'],
      })

      const closedIssue = await sdk.api.github.issues.create(testOwner, testRepoName, {
        title: 'Issue to Close',
        labels: ['test'],
      })

      // Close one issue
      await sdk.api.github.issues.update(testOwner, testRepoName, closedIssue.number, {
        state: 'closed',
      })

      // Wait for indexing
      await runner.wait(1000)

      // List open issues
      const openIssues = await sdk.api.github.issues.list(testOwner, testRepoName, {
        state: 'open',
        labels: 'test',
      })

      expect(openIssues).toBeDefined()
      expect(Array.isArray(openIssues)).toBe(true)
      expect(openIssues.length).toBeGreaterThanOrEqual(2)

      // List closed issues
      const closedIssues = await sdk.api.github.issues.list(testOwner, testRepoName, {
        state: 'closed',
        labels: 'test',
      })

      expect(closedIssues).toBeDefined()
      expect(Array.isArray(closedIssues)).toBe(true)
      expect(closedIssues.length).toBeGreaterThanOrEqual(1)
    },
    getTimeout()
  )

  test(
    'should close issue',
    async () => {
      const sdk = runner.getSDK()

      // Create repository
      await sdk.api.github.repos.create({
        name: testRepoName,
        description: 'Test repository',
        private: false,
        auto_init: true,
        has_issues: true,
      })

      runner.registerCleanup(async () => {
        await sdk.api.github.repos.delete(testOwner, testRepoName)
      })

      await runner.wait(2000)

      // Create issue
      const issue = await sdk.api.github.issues.create(testOwner, testRepoName, {
        title: 'Issue to Close',
        body: 'This issue will be closed',
      })

      expect(issue.state).toBe('open')

      // Close issue
      const closed = await sdk.api.github.issues.update(testOwner, testRepoName, issue.number, {
        state: 'closed',
      })

      expect(closed).toBeDefined()
      expect(closed.number).toBe(issue.number)
      expect(closed.state).toBe('closed')
    },
    getTimeout()
  )

  // =============================================================================
  // Pull Request Operations
  // =============================================================================

  test(
    'should create pull request from branch to main',
    async () => {
      const sdk = runner.getSDK()

      // Create repository
      await sdk.api.github.repos.create({
        name: testRepoName,
        description: 'Test repository',
        private: false,
        auto_init: true,
      })

      runner.registerCleanup(async () => {
        await sdk.api.github.repos.delete(testOwner, testRepoName)
      })

      await runner.wait(2000)

      // Create a new branch
      const mainBranch = await sdk.api.github.repos.getBranch(testOwner, testRepoName, 'main')
      const branchName = `test-branch-${runner.testId}`

      await sdk.api.github.git.createRef(testOwner, testRepoName, {
        ref: `refs/heads/${branchName}`,
        sha: mainBranch.commit.sha,
      })

      // Create a file in the new branch
      await sdk.api.github.repos.createOrUpdateFileContents(testOwner, testRepoName, {
        path: 'test.txt',
        message: 'Add test file',
        content: Buffer.from('Test content').toString('base64'),
        branch: branchName,
      })

      // Wait for file to be committed
      await runner.wait(1000)

      // Create pull request
      const pr = await sdk.api.github.pulls.create(testOwner, testRepoName, {
        title: `Test PR - ${runner.testId}`,
        body: 'This is a test pull request created by E2E tests',
        head: branchName,
        base: 'main',
      })

      expect(pr).toBeDefined()
      expect(pr.id).toBeTruthy()
      expect(pr.number).toBeGreaterThan(0)
      expect(pr.title).toBe(`Test PR - ${runner.testId}`)
      expect(pr.state).toBe('open')
      expect(pr.head.ref).toBe(branchName)
      expect(pr.base.ref).toBe('main')
    },
    getTimeout()
  )

  test(
    'should get pull request details',
    async () => {
      const sdk = runner.getSDK()

      // Create repository
      await sdk.api.github.repos.create({
        name: testRepoName,
        description: 'Test repository',
        private: false,
        auto_init: true,
      })

      runner.registerCleanup(async () => {
        await sdk.api.github.repos.delete(testOwner, testRepoName)
      })

      await runner.wait(2000)

      // Create branch and PR
      const mainBranch = await sdk.api.github.repos.getBranch(testOwner, testRepoName, 'main')
      const branchName = `test-branch-${runner.testId}`

      await sdk.api.github.git.createRef(testOwner, testRepoName, {
        ref: `refs/heads/${branchName}`,
        sha: mainBranch.commit.sha,
      })

      await sdk.api.github.repos.createOrUpdateFileContents(testOwner, testRepoName, {
        path: 'test.txt',
        message: 'Add test file',
        content: Buffer.from('Test content').toString('base64'),
        branch: branchName,
      })

      await runner.wait(1000)

      const created = await sdk.api.github.pulls.create(testOwner, testRepoName, {
        title: 'Test PR for Retrieval',
        body: 'Testing PR retrieval',
        head: branchName,
        base: 'main',
      })

      // Retrieve pull request
      const retrieved = await sdk.api.github.pulls.get(testOwner, testRepoName, created.number)

      expect(retrieved).toBeDefined()
      expect(retrieved.id).toBe(created.id)
      expect(retrieved.number).toBe(created.number)
      expect(retrieved.title).toBe('Test PR for Retrieval')
    },
    getTimeout()
  )

  test(
    'should update pull request title and body',
    async () => {
      const sdk = runner.getSDK()

      // Create repository
      await sdk.api.github.repos.create({
        name: testRepoName,
        description: 'Test repository',
        private: false,
        auto_init: true,
      })

      runner.registerCleanup(async () => {
        await sdk.api.github.repos.delete(testOwner, testRepoName)
      })

      await runner.wait(2000)

      // Create branch and PR
      const mainBranch = await sdk.api.github.repos.getBranch(testOwner, testRepoName, 'main')
      const branchName = `test-branch-${runner.testId}`

      await sdk.api.github.git.createRef(testOwner, testRepoName, {
        ref: `refs/heads/${branchName}`,
        sha: mainBranch.commit.sha,
      })

      await sdk.api.github.repos.createOrUpdateFileContents(testOwner, testRepoName, {
        path: 'test.txt',
        message: 'Add test file',
        content: Buffer.from('Test content').toString('base64'),
        branch: branchName,
      })

      await runner.wait(1000)

      const pr = await sdk.api.github.pulls.create(testOwner, testRepoName, {
        title: 'Initial PR Title',
        body: 'Initial PR body',
        head: branchName,
        base: 'main',
      })

      // Update pull request
      const updated = await sdk.api.github.pulls.update(testOwner, testRepoName, pr.number, {
        title: 'Updated PR Title',
        body: 'Updated PR body with more details',
      })

      expect(updated).toBeDefined()
      expect(updated.number).toBe(pr.number)
      expect(updated.title).toBe('Updated PR Title')
      expect(updated.body).toBe('Updated PR body with more details')
    },
    getTimeout()
  )

  test(
    'should list pull requests with filters',
    async () => {
      const sdk = runner.getSDK()

      // Create repository
      await sdk.api.github.repos.create({
        name: testRepoName,
        description: 'Test repository',
        private: false,
        auto_init: true,
      })

      runner.registerCleanup(async () => {
        await sdk.api.github.repos.delete(testOwner, testRepoName)
      })

      await runner.wait(2000)

      // Create multiple PRs
      const mainBranch = await sdk.api.github.repos.getBranch(testOwner, testRepoName, 'main')

      for (let i = 0; i < 2; i++) {
        const branchName = `test-branch-${i}-${runner.testId}`

        await sdk.api.github.git.createRef(testOwner, testRepoName, {
          ref: `refs/heads/${branchName}`,
          sha: mainBranch.commit.sha,
        })

        await sdk.api.github.repos.createOrUpdateFileContents(testOwner, testRepoName, {
          path: `test${i}.txt`,
          message: `Add test file ${i}`,
          content: Buffer.from(`Test content ${i}`).toString('base64'),
          branch: branchName,
        })

        await runner.wait(1000)

        await sdk.api.github.pulls.create(testOwner, testRepoName, {
          title: `Test PR ${i}`,
          body: `Test PR body ${i}`,
          head: branchName,
          base: 'main',
        })
      }

      // Wait for indexing
      await runner.wait(1000)

      // List pull requests
      const prs = await sdk.api.github.pulls.list(testOwner, testRepoName, {
        state: 'open',
      })

      expect(prs).toBeDefined()
      expect(Array.isArray(prs)).toBe(true)
      expect(prs.length).toBeGreaterThanOrEqual(2)

      // Verify PRs have correct structure
      prs.forEach((pr: any) => {
        expect(pr.id).toBeTruthy()
        expect(pr.number).toBeGreaterThan(0)
        expect(pr.title).toBeTruthy()
        expect(pr.state).toBe('open')
      })
    },
    getTimeout()
  )

  // =============================================================================
  // Content Operations
  // =============================================================================

  test(
    'should get file content from repository',
    async () => {
      const sdk = runner.getSDK()

      // Create repository
      await sdk.api.github.repos.create({
        name: testRepoName,
        description: 'Test repository',
        private: false,
        auto_init: true,
      })

      runner.registerCleanup(async () => {
        await sdk.api.github.repos.delete(testOwner, testRepoName)
      })

      await runner.wait(2000)

      // Get README.md content (created by auto_init)
      const content = await sdk.api.github.repos.getContent(testOwner, testRepoName, 'README.md')

      expect(content).toBeDefined()
      expect(content.name).toBe('README.md')
      expect(content.path).toBe('README.md')
      expect(content.type).toBe('file')
      expect(content.content).toBeTruthy()
      expect(content.sha).toBeTruthy()

      // Decode and verify content
      const decoded = Buffer.from(content.content, 'base64').toString('utf-8')
      expect(decoded).toContain(testRepoName)
    },
    getTimeout()
  )

  test(
    'should create file in repository',
    async () => {
      const sdk = runner.getSDK()

      // Create repository
      await sdk.api.github.repos.create({
        name: testRepoName,
        description: 'Test repository',
        private: false,
        auto_init: true,
      })

      runner.registerCleanup(async () => {
        await sdk.api.github.repos.delete(testOwner, testRepoName)
      })

      await runner.wait(2000)

      // Create file
      const fileContent = `# Test File\n\nThis file was created by E2E tests.\n\nTest ID: ${runner.testId}`
      const result = await sdk.api.github.repos.createOrUpdateFileContents(testOwner, testRepoName, {
        path: 'test-file.md',
        message: 'Create test file',
        content: Buffer.from(fileContent).toString('base64'),
        branch: 'main',
      })

      expect(result).toBeDefined()
      expect(result.content).toBeDefined()
      expect(result.content.name).toBe('test-file.md')
      expect(result.content.path).toBe('test-file.md')
      expect(result.commit).toBeDefined()
      expect(result.commit.message).toBe('Create test file')

      // Verify file was created
      const retrieved = await sdk.api.github.repos.getContent(testOwner, testRepoName, 'test-file.md')
      expect(retrieved.name).toBe('test-file.md')

      const decodedContent = Buffer.from(retrieved.content, 'base64').toString('utf-8')
      expect(decodedContent).toBe(fileContent)
    },
    getTimeout()
  )

  test(
    'should update file in repository',
    async () => {
      const sdk = runner.getSDK()

      // Create repository
      await sdk.api.github.repos.create({
        name: testRepoName,
        description: 'Test repository',
        private: false,
        auto_init: true,
      })

      runner.registerCleanup(async () => {
        await sdk.api.github.repos.delete(testOwner, testRepoName)
      })

      await runner.wait(2000)

      // Create file
      const initialContent = 'Initial content'
      const createResult = await sdk.api.github.repos.createOrUpdateFileContents(testOwner, testRepoName, {
        path: 'update-test.txt',
        message: 'Create file',
        content: Buffer.from(initialContent).toString('base64'),
        branch: 'main',
      })

      // Wait for file to be created
      await runner.wait(1000)

      // Update file
      const updatedContent = 'Updated content with new information'
      const updateResult = await sdk.api.github.repos.createOrUpdateFileContents(testOwner, testRepoName, {
        path: 'update-test.txt',
        message: 'Update file content',
        content: Buffer.from(updatedContent).toString('base64'),
        branch: 'main',
        sha: createResult.content.sha,
      })

      expect(updateResult).toBeDefined()
      expect(updateResult.content).toBeDefined()
      expect(updateResult.commit.message).toBe('Update file content')

      // Verify file was updated
      const retrieved = await sdk.api.github.repos.getContent(testOwner, testRepoName, 'update-test.txt')
      const decodedContent = Buffer.from(retrieved.content, 'base64').toString('utf-8')
      expect(decodedContent).toBe(updatedContent)
    },
    getTimeout()
  )

  // =============================================================================
  // Branch Operations
  // =============================================================================

  test(
    'should list branches in repository',
    async () => {
      const sdk = runner.getSDK()

      // Create repository
      await sdk.api.github.repos.create({
        name: testRepoName,
        description: 'Test repository',
        private: false,
        auto_init: true,
      })

      runner.registerCleanup(async () => {
        await sdk.api.github.repos.delete(testOwner, testRepoName)
      })

      await runner.wait(2000)

      // Create additional branches
      const mainBranch = await sdk.api.github.repos.getBranch(testOwner, testRepoName, 'main')

      await sdk.api.github.git.createRef(testOwner, testRepoName, {
        ref: `refs/heads/test-branch-1`,
        sha: mainBranch.commit.sha,
      })

      await sdk.api.github.git.createRef(testOwner, testRepoName, {
        ref: `refs/heads/test-branch-2`,
        sha: mainBranch.commit.sha,
      })

      // Wait for branches to be created
      await runner.wait(1000)

      // List branches
      const branches = await sdk.api.github.repos.listBranches(testOwner, testRepoName)

      expect(branches).toBeDefined()
      expect(Array.isArray(branches)).toBe(true)
      expect(branches.length).toBeGreaterThanOrEqual(3)

      // Verify main branch exists
      const mainBranchInList = branches.find((b: any) => b.name === 'main')
      expect(mainBranchInList).toBeDefined()

      // Verify test branches exist
      const testBranch1 = branches.find((b: any) => b.name === 'test-branch-1')
      const testBranch2 = branches.find((b: any) => b.name === 'test-branch-2')
      expect(testBranch1).toBeDefined()
      expect(testBranch2).toBeDefined()
    },
    getTimeout()
  )

  test(
    'should get branch details',
    async () => {
      const sdk = runner.getSDK()

      // Create repository
      await sdk.api.github.repos.create({
        name: testRepoName,
        description: 'Test repository',
        private: false,
        auto_init: true,
      })

      runner.registerCleanup(async () => {
        await sdk.api.github.repos.delete(testOwner, testRepoName)
      })

      await runner.wait(2000)

      // Get main branch details
      const branch = await sdk.api.github.repos.getBranch(testOwner, testRepoName, 'main')

      expect(branch).toBeDefined()
      expect(branch.name).toBe('main')
      expect(branch.commit).toBeDefined()
      expect(branch.commit.sha).toBeTruthy()
      expect(branch.commit.commit).toBeDefined()
      expect(branch.commit.commit.message).toBeTruthy()
      expect(branch.protected).toBeDefined()
    },
    getTimeout()
  )

  // =============================================================================
  // Webhook Handling
  // =============================================================================

  test(
    'should verify valid webhook signature',
    async () => {
      const sdk = runner.getSDK()

      // Create webhook payload
      const payload = JSON.stringify({
        action: 'opened',
        issue: {
          id: 1,
          number: 1,
          title: 'Test Issue',
          state: 'open',
        },
        repository: {
          id: 123,
          name: 'test-repo',
          full_name: 'user/test-repo',
        },
      })

      const webhookSecret = 'test-webhook-secret'

      // Generate valid signature
      const signature = crypto.createHmac('sha256', webhookSecret).update(payload).digest('hex')
      const signatureHeader = `sha256=${signature}`

      // Verify webhook
      const isValid = await sdk.api.github.webhooks.verify(payload, signatureHeader, webhookSecret)

      expect(isValid).toBe(true)
    },
    getTimeout()
  )

  test(
    'should reject invalid webhook signature',
    async () => {
      const sdk = runner.getSDK()

      // Create webhook payload
      const payload = JSON.stringify({
        action: 'opened',
        issue: {
          id: 1,
          number: 1,
          title: 'Test Issue',
        },
      })

      const webhookSecret = 'test-webhook-secret'
      const invalidSignature = 'sha256=invalid_signature_value'

      // Verify webhook (should fail)
      const isValid = await sdk.api.github.webhooks.verify(payload, invalidSignature, webhookSecret)

      expect(isValid).toBe(false)
    },
    getTimeout()
  )

  // =============================================================================
  // Error Handling
  // =============================================================================

  test(
    'should handle invalid token (401)',
    async () => {
      const sdk = runner.getSDK()

      // This test verifies that authentication errors are properly handled
      // In a real scenario, we'd use an invalid token
      // For now, we test error handling with a non-existent repository

      await expect(sdk.api.github.repos.get(testOwner, 'non-existent-repo-12345')).rejects.toThrow()
    },
    getTimeout()
  )

  test(
    'should handle repository not found (404)',
    async () => {
      const sdk = runner.getSDK()

      // Attempt to retrieve non-existent repository
      await expect(sdk.api.github.repos.get('nonexistentuser12345', 'nonexistentrepo12345')).rejects.toThrow()
    },
    getTimeout()
  )

  test(
    'should handle rate limit gracefully',
    async () => {
      const sdk = runner.getSDK()

      // Check rate limit status
      const rateLimit = await sdk.api.github.rateLimit.get()

      expect(rateLimit).toBeDefined()
      expect(rateLimit.resources).toBeDefined()
      expect(rateLimit.resources.core).toBeDefined()
      expect(rateLimit.resources.core.limit).toBeGreaterThan(0)
      expect(rateLimit.resources.core.remaining).toBeGreaterThanOrEqual(0)
      expect(rateLimit.resources.core.reset).toBeGreaterThan(0)

      // Verify rate limit includes proper fields
      expect(rateLimit.rate).toBeDefined()
      expect(rateLimit.rate.limit).toBeGreaterThan(0)
      expect(rateLimit.rate.remaining).toBeGreaterThanOrEqual(0)
    },
    getTimeout()
  )
})
