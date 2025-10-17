import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setupCommunication } from '../src/communication'
import { WorkerInstance, WorkerCommunicationConfig } from '../src/types'

describe('Communication Setup', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  it('should set up communication channels with valid configuration', () => {
    const worker = {
      id: 'worker-123',
      agent: {
        execute: vi.fn().mockResolvedValue({ status: 'success' }),
      },
      context: {},
      plans: [],
      execute: vi.fn(),
      updateContext: vi.fn(),
      sendMessage: vi.fn(),
      evaluateKpis: vi.fn(),
    } as unknown as WorkerInstance

    const config: WorkerCommunicationConfig = {
      slack: {
        token: 'slack-token-123',
        channels: ['general'],
        botName: 'TestBot',
      },
      email: {
        smtp: 'smtp.example.com',
        address: 'test@example.com',
        name: 'Test Worker',
      },
    }

    setupCommunication(worker, config)

    expect(worker.communicationChannels).toBeDefined()
    expect(worker.communicationChannels).toContain('slack')
    expect(worker.communicationChannels).toContain('email')
  })

  it('should handle empty communication config', () => {
    const worker = {
      id: 'worker-123',
      agent: {
        execute: vi.fn(),
      },
      context: {},
      plans: [],
      execute: vi.fn(),
      updateContext: vi.fn(),
      sendMessage: vi.fn(),
      evaluateKpis: vi.fn(),
    } as unknown as WorkerInstance

    const config = {} as WorkerCommunicationConfig

    setupCommunication(worker, config)

    expect(worker.communicationChannels).toEqual([])
    expect(console.warn).toHaveBeenCalledWith('No communication channels configured for worker worker-123')
  })

  it('should set up message sending methods', () => {
    const worker = {
      id: 'worker-123',
      agent: {
        execute: vi.fn().mockResolvedValue({ status: 'success' }),
      },
      context: {},
      plans: [],
      execute: vi.fn(),
      updateContext: vi.fn(),
      sendMessage: vi.fn(),
      evaluateKpis: vi.fn(),
    } as unknown as WorkerInstance

    const config: WorkerCommunicationConfig = {
      slack: {
        token: 'slack-token-123',
        channels: ['general'],
      },
    }

    setupCommunication(worker, config)

    expect(typeof worker.sendSlackMessage).toBe('function')

    worker.sendSlackMessage('general', 'Hello world')
    expect(worker.agent.execute).toHaveBeenCalledWith({
      action: 'sendMessage',
      channel: 'slack',
      target: 'general',
      message: 'Hello world',
    })
  })
})
