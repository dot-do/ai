import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createTeamsMessage, getTeamsResponse, storeTeamsResponse, TeamsHumanFunction } from './index'
import { TeamsApiClient } from './client'

vi.mock('./client', () => {
  return {
    TeamsApiClient: vi.fn().mockImplementation(() => {
      return {
        sendCard: vi.fn().mockResolvedValue({ id: 'mock-teams-message-id' }),
        registerWebhook: vi.fn().mockResolvedValue(undefined),
      }
    }),
    createAdaptiveCard: vi.fn().mockReturnValue({
      type: 'AdaptiveCard',
      version: '1.2',
      body: [],
      actions: [],
    }),
  }
})

describe('Teams Platform', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createTeamsMessage', () => {
    it('should throw an error if webhookUrl is not provided', async () => {
      await expect(
        createTeamsMessage(
          'task-123',
          {},
          {
            title: 'Test Title',
            description: 'Test Description',
          }
        )
      ).rejects.toThrow('Teams webhook URL is required')
    })

    it('should create a Teams message with the provided options', async () => {
      const result = await createTeamsMessage(
        'task-123',
        {},
        {
          title: 'Test Title',
          description: 'Test Description',
          webhookUrl: 'https://example.com/webhook',
        }
      )

      expect(result).toHaveProperty('messageId')
      expect(TeamsApiClient).toHaveBeenCalledWith('https://example.com/webhook')
    })
  })

  describe('getTeamsResponse & storeTeamsResponse', () => {
    it('should return null if no response is stored for the task', async () => {
      const response = await getTeamsResponse('task-123')
      expect(response).toBeNull()
    })

    it('should store and retrieve a response', async () => {
      const mockResponse = { approved: true, comments: 'Looks good!' }
      storeTeamsResponse('task-123', mockResponse)

      const response = await getTeamsResponse('task-123')
      expect(response).toEqual(mockResponse)
    })
  })

  describe('TeamsHumanFunction', () => {
    it('should create a request with the correct format', async () => {
      const teamsFunction = new TeamsHumanFunction({
        title: 'Test Title',
        description: 'Test Description',
        webhookUrl: 'https://example.com/webhook',
      })

      const request = await teamsFunction.request({})
      expect(request).toHaveProperty('taskId')
      expect(request).toHaveProperty('status', 'pending')
      expect(request).toHaveProperty('messageId')
      expect(request.messageId).toHaveProperty('teams')
    })

    it('should get a response for a task', async () => {
      const teamsFunction = new TeamsHumanFunction({
        title: 'Test Title',
        description: 'Test Description',
        webhookUrl: 'https://example.com/webhook',
      })

      const mockResponse = { approved: true, comments: 'Approved!' }
      storeTeamsResponse('task-123', mockResponse)

      const response = await teamsFunction.getResponse('task-123')
      expect(response).toEqual(mockResponse)
    })
  })
})
