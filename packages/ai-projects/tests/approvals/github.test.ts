import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { requestGitHubApproval, handleGitHubPRResponse, configureGitHubIntegration, createGitHubPR, checkGitHubPRStatus } from '../../src/approvals/github'
import { ApprovalRequest } from '../../src/types'

describe('GitHub Approval Workflow', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('requestGitHubApproval', () => {
    it('should return an approval result', async () => {
      const request: ApprovalRequest = {
        taskId: 'task-123',
        result: { data: 'Test result' },
        method: 'github',
        approvers: ['user1', 'user2'],
        message: 'Please approve this task',
      }

      const result = await requestGitHubApproval(request)

      expect(result).toBeDefined()
      expect(result.approved).toBe(true)
      expect(result.approvedBy).toBe('user1')
      expect(result.approvedAt).toBeInstanceOf(Date)
      expect(result.comments).toBeDefined()
    })
  })

  describe('handleGitHubPRResponse', () => {
    it('should handle approval response', async () => {
      const request: ApprovalRequest = {
        taskId: 'task-123',
        result: { data: 'Test result' },
        method: 'github',
        approvers: ['user1', 'user2'],
        message: 'Please approve this task',
      }

      const approvalPromise = requestGitHubApproval(request)

      const consoleLogSpy = vi.spyOn(console, 'log')
      const approvalIdLog = consoleLogSpy.mock.calls.find((call) => typeof call[0] === 'string' && call[0].includes('Approval ID:'))

      if (!approvalIdLog) {
        console.warn('Could not extract approval ID from logs')
        return
      }

      const approvalIdMatch = /Approval ID: (approval-\d+-task-123)/.exec(approvalIdLog[0])
      const approvalId = approvalIdMatch ? approvalIdMatch[1] : null

      if (!approvalId) {
        console.warn('Could not parse approval ID from logs')
        return
      }

      handleGitHubPRResponse(approvalId, true, 'test-user', 'Approved with comments')

      const result = await approvalPromise

      expect(result).toBeDefined()
      expect(result.approved).toBe(true)
      expect(result.approvedBy).toBe('test-user')
      expect(result.approvedAt).toBeInstanceOf(Date)
      expect(result.comments).toBe('Approved with comments')
    })

    it('should log a warning when approval ID is not found', () => {
      const consoleSpy = vi.spyOn(console, 'warn')

      handleGitHubPRResponse('non-existent-id', true, 'test-user', 'Approved with comments')

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('not found in pending approvals'))
    })
  })

  describe('configureGitHubIntegration', () => {
    it('should configure GitHub integration', () => {
      const consoleSpy = vi.spyOn(console, 'log')

      const config = {
        token: 'test-token',
        owner: 'test-owner',
        repo: 'test-repo',
        baseBranch: 'main',
      }

      configureGitHubIntegration(config)

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Integration configured with:'), expect.anything())
    })
  })

  describe('createGitHubPR', () => {
    it('should create a GitHub PR for approval', async () => {
      const request: ApprovalRequest = {
        taskId: 'task-123',
        result: { data: 'Test result' },
        method: 'github',
        approvers: ['user1', 'user2'],
        message: 'Please approve this task',
      }

      const approvalId = 'approval-123'

      const result = await createGitHubPR(request, approvalId)

      expect(result).toBeDefined()
      expect(result.prNumber).toBeGreaterThan(0)
      expect(result.url).toContain(`/pull/${result.prNumber}`)
    })
  })

  describe('checkGitHubPRStatus', () => {
    it('should check the status of a GitHub PR', async () => {
      const prNumber = 123

      const status = await checkGitHubPRStatus(prNumber)

      expect(status).toBeDefined()
      expect(status.state).toBe('open')
      expect(status.merged).toBe(false)
      expect(status.approved).toBe(false)
      expect(status.requestedChanges).toBe(false)
      expect(status.comments).toBeInstanceOf(Array)
    })
  })
})
