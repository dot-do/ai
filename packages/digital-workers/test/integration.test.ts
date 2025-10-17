import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Worker } from '../src/index'
import { WorkerConfig } from '../src/types'

describe('Digital Workers Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('should create a fully functional worker with event loop and communication', async () => {
    const config: WorkerConfig = {
      name: 'IntegrationTestWorker',
      description: 'A worker for integration testing',
      eventLoop: {
        frequency: '*/15 * * * *',
        kpis: ['conversion-rate', 'response-time'],
        okrs: {
          'conversion-rate': { target: '> 0.1', weight: 2 },
          'response-time': { target: '< 300', weight: 1 },
        },
        evaluationStrategy: 'weighted',
      },
      communication: {
        slack: {
          token: 'test-slack-token',
          channels: ['general'],
          botName: 'TestBot',
        },
        email: {
          smtp: 'smtp.test.com',
          address: 'test@example.com',
          name: 'Test Worker',
        },
      },
      initialContext: {
        environment: 'test',
        version: '1.0.0',
      },
      initialPlans: [
        {
          name: 'Initial Setup',
          steps: ['configure', 'validate', 'start'],
          status: 'pending',
        },
      ],
    }

    const worker = Worker(config)

    expect(worker.id).toBeDefined()
    expect(worker.agent).toBeDefined()
    expect(worker.context).toEqual({
      environment: 'test',
      version: '1.0.0',
    })
    expect(worker.plans).toHaveLength(1)
    expect(worker.plans[0].name).toBe('Initial Setup')

    expect(worker.eventLoopJob).toBeDefined()
    expect(typeof worker.evaluateKpis).toBe('function')
    expect(typeof worker.stopEventLoop).toBe('function')
    expect(typeof worker.restartEventLoop).toBe('function')

    expect(worker.communicationChannels).toContain('slack')
    expect(worker.communicationChannels).toContain('email')
    expect(typeof worker.sendSlackMessage).toBe('function')
    expect(typeof worker.sendEmail).toBe('function')
    expect(typeof worker.send).toBe('function')
  })

  it('should handle worker execution with context updates', async () => {
    const config: WorkerConfig = {
      name: 'ExecutionTestWorker',
      description: 'A worker for execution testing',
    }

    const worker = Worker(config)

    const input = { action: 'processTask', taskId: '123' }
    const result = await worker.execute(input)

    expect(result).toEqual(
      expect.objectContaining({
        data: 'executed',
        input,
        agent: 'ExecutionTestWorker',
        timestamp: expect.any(String),
      })
    )

    await worker.updateContext({ lastTaskId: '123', status: 'completed' })

    expect(worker.context).toEqual(
      expect.objectContaining({
        lastTaskId: '123',
        status: 'completed',
        lastUpdated: expect.any(String),
      })
    )
  })

  it('should handle communication channel messaging', async () => {
    const config: WorkerConfig = {
      name: 'CommunicationTestWorker',
      description: 'A worker for communication testing',
      communication: {
        slack: {
          token: 'test-slack-token',
          channels: ['general'],
        },
      },
    }

    const worker = Worker(config)

    const agentExecuteSpy = vi.spyOn(worker.agent, 'execute').mockResolvedValue({ status: 'sent' })

    await worker.sendSlackMessage('general', 'Hello from worker!')

    expect(agentExecuteSpy).toHaveBeenCalledWith({
      action: 'sendMessage',
      channel: 'slack',
      target: 'general',
      message: 'Hello from worker!',
    })

    await worker.send({ text: 'Generic message' }, { channel: 'slack', recipient: 'user123' })

    expect(agentExecuteSpy).toHaveBeenCalledWith({
      action: 'sendMessage',
      channel: 'slack',
      message: expect.objectContaining({
        text: 'Generic message',
        recipient: 'user123',
        priority: 'normal',
        timestamp: expect.any(String),
        sender: worker.id,
      }),
    })
  })

  it('should handle KPI evaluation workflow', async () => {
    const config: WorkerConfig = {
      name: 'KpiTestWorker',
      description: 'A worker for KPI testing',
      eventLoop: {
        frequency: '*/15 * * * *',
        kpis: ['test-kpi'],
        okrs: {
          'test-kpi': { target: '> 90', weight: 1 },
        },
      },
    }

    const worker = Worker(config)

    const agentExecuteSpy = vi.spyOn(worker.agent, 'execute').mockResolvedValue({
      kpiValues: { 'test-kpi': 95 },
    })

    const result = await worker.evaluateKpis()

    expect(result).toHaveProperty('status', 'completed')
    expect(result).toHaveProperty('kpiValues')
    expect(result).toHaveProperty('evaluationResults')
    expect(result.evaluationResults).toHaveProperty('kpis')
    expect(result.evaluationResults).toHaveProperty('overallScore')

    expect(agentExecuteSpy).toHaveBeenCalled()
  })

  it('should handle worker without optional configurations', () => {
    const config: WorkerConfig = {
      name: 'MinimalWorker',
      description: 'A minimal worker configuration',
    }

    const worker = Worker(config)

    expect(worker.id).toBeDefined()
    expect(worker.agent).toBeDefined()
    expect(worker.context).toEqual({})
    expect(worker.plans).toEqual([])
    expect(worker.communicationChannels).toBeUndefined()
    expect(worker.eventLoopJob).toBeUndefined()

    expect(typeof worker.execute).toBe('function')
    expect(typeof worker.updateContext).toBe('function')
    expect(typeof worker.sendMessage).toBe('function')
    expect(typeof worker.evaluateKpis).toBe('function')
  })

  it('should handle sendMessage with unconfigured channel', async () => {
    const config: WorkerConfig = {
      name: 'ErrorTestWorker',
      description: 'A worker for error testing',
    }

    const worker = Worker(config)

    await expect(worker.sendMessage('slack', 'test message')).rejects.toThrow('Communication channel "slack" not configured')
  })

  it('should handle agent configuration correctly', () => {
    const config: WorkerConfig = {
      name: 'ConfigTestWorker',
      description: 'A worker for configuration testing',
      role: 'Test Assistant',
      url: 'https://test-worker.example.com',
      searches: ['web', 'docs'],
      actions: ['analyze', 'report'],
      eventLoop: {
        frequency: '0 */6 * * *',
        kpis: ['accuracy', 'speed'],
        okrs: {
          accuracy: { target: '>= 95%', weight: 3 },
          speed: { target: '< 2s', weight: 1 },
        },
      },
    }

    const worker = Worker(config)

    expect(worker.agent.config.name).toBe('ConfigTestWorker')
    expect(worker.agent.config.role).toBe('Test Assistant')
    expect(worker.agent.config.url).toBe('https://test-worker.example.com')
    expect(worker.agent.config.objective).toBe('A worker for configuration testing')
    expect(worker.agent.config.keyResults).toEqual(['accuracy', 'speed'])
    expect(worker.agent.config.integrations).toEqual([])
    expect(worker.agent.config.triggers).toEqual(['onTaskAssigned', 'onKpiUpdate', 'onContextChange'])
    expect(worker.agent.config.searches).toEqual(['web', 'docs'])
    expect(worker.agent.config.actions).toEqual(['analyze', 'report'])
  })
})
