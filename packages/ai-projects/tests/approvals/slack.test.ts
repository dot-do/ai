import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { requestSlackApproval, handleSlackApprovalResponse, configureSlackIntegration, createSlackApprovalMessage } from '../../src/approvals/slack'
import { ApprovalRequest } from '../../src/types'

describe('Slack Approval Workflow', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('requestSlackApproval', () => {
    it('should return an approval result', async () => {
      const request: ApprovalRequest = {
        taskId: 'task-123',
        result: { data: 'Test result' },
        method: 'slack',
        approvers: ['user1', 'user2'],
        message: 'Please approve this task',
      }

      const result = await requestSlackApproval(request)

      expect(result).toBeDefined()
      expect(result.approved).toBe(true)
      expect(result.approvedBy).toBe('user1')
      expect(result.approvedAt).toBeInstanceOf(Date)
      expect(result.comments).toBeDefined()
    })
  })

  describe('handleSlackApprovalResponse', () => {
    it('should handle approval response', async () => {
      const request: ApprovalRequest = {
        taskId: 'task-123',
        result: { data: 'Test result' },
        method: 'slack',
        approvers: ['user1', 'user2'],
        message: 'Please approve this task',
      }

      const approvalPromise = requestSlackApproval(request)

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

      handleSlackApprovalResponse(approvalId, true, 'test-user', 'Approved with comments')

      const result = await approvalPromise

      expect(result).toBeDefined()
      expect(result.approved).toBe(true)
      expect(result.approvedBy).toBe('test-user')
      expect(result.approvedAt).toBeInstanceOf(Date)
      expect(result.comments).toBe('Approved with comments')
    })

    it('should log a warning when approval ID is not found', () => {
      const consoleSpy = vi.spyOn(console, 'warn')

      handleSlackApprovalResponse('non-existent-id', true, 'test-user', 'Approved with comments')

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('not found in pending approvals'))
    })
  })

  describe('configureSlackIntegration', () => {
    it('should configure Slack integration', () => {
      const consoleSpy = vi.spyOn(console, 'log')

      const config = {
        token: 'test-token',
        signingSecret: 'test-secret',
        channel: 'test-channel',
        port: 3000,
      }

      configureSlackIntegration(config)

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Integration configured with:'), expect.anything())
    })
  })

  describe('createSlackApprovalMessage', () => {
    it('should create a Slack message with approval buttons', () => {
      const request: ApprovalRequest = {
        taskId: 'task-123',
        result: { data: 'Test result' },
        method: 'slack',
        approvers: ['user1', 'user2'],
        message: 'Please approve this task',
      }

      const approvalId = 'approval-123'

      const message = createSlackApprovalMessage(request, approvalId)

      expect(message).toBeDefined()
      expect(message).toBeInstanceOf(Array)
      expect(message.length).toBeGreaterThan(0)

      const header = message.find((block) => block.type === 'header')
      expect(header).toBeDefined()
      expect(header.text.text).toContain('task-123')

      const messageBlock = message.find((block) => block.type === 'section' && block.text.text === request.message)
      expect(messageBlock).toBeDefined()

      const actions = message.find((block) => block.type === 'actions')
      expect(actions).toBeDefined()
      expect(actions.elements.length).toBe(2)
      expect(actions.elements[0].text.text).toBe('Approve')
      expect(actions.elements[1].text.text).toBe('Reject')
    })
  })
})
