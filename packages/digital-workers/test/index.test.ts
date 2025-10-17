import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Worker } from '../src/index'
import * as scheduling from '../src/scheduling'
import * as communication from '../src/communication'
import { WorkerConfig, Plan } from '../src/types'

vi.mock('../src/scheduling', () => ({
  setupEventLoop: vi.fn(),
}))

vi.mock('../src/communication', () => ({
  setupCommunication: vi.fn(),
}))

describe('Worker function', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should create a worker instance with default values', () => {
    const config = {
      name: 'TestWorker',
      description: 'A test worker',
    }

    const worker = Worker(config)

    expect(worker).toBeDefined()
    expect(worker.id).toBeDefined()
    expect(worker.agent).toBeDefined()
    expect(worker.context).toEqual({})
    expect(worker.plans).toEqual([])
    expect(typeof worker.execute).toBe('function')
    expect(typeof worker.updateContext).toBe('function')
    expect(typeof worker.sendMessage).toBe('function')
    expect(typeof worker.evaluateKpis).toBe('function')
  })

  it('should use provided id if available', () => {
    const config = {
      name: 'TestWorker',
      description: 'A test worker',
      id: 'custom-id-123',
    }

    const worker = Worker(config)

    expect(worker.id).toBe('custom-id-123')
  })

  it('should initialize with provided context and plans', () => {
    const initialContext = { key: 'value' }
    const initialPlans: Plan[] = [
      {
        name: 'Plan1',
        steps: ['step1', 'step2'],
        status: 'pending',
      },
    ]

    const config: WorkerConfig = {
      name: 'TestWorker',
      description: 'A test worker',
      initialContext,
      initialPlans,
    }

    const worker = Worker(config)

    expect(worker.context).toEqual(initialContext)
    expect(worker.plans).toEqual(initialPlans)
  })

  it('should set up event loop if config is provided', () => {
    const eventLoopConfig = {
      frequency: '*/15 * * * *',
      kpis: ['kpi1', 'kpi2'],
      okrs: { kpi1: { target: '> 90%', weight: 1 } },
    }

    const config = {
      name: 'TestWorker',
      description: 'A test worker',
      eventLoop: eventLoopConfig,
    }

    Worker(config)

    expect(scheduling.setupEventLoop).toHaveBeenCalledWith(expect.anything(), eventLoopConfig)
  })

  it('should set up communication if config is provided', () => {
    const communicationConfig = {
      slack: { token: 'slack-token' },
    }

    const config = {
      name: 'TestWorker',
      description: 'A test worker',
      communication: communicationConfig,
    }

    Worker(config)

    expect(communication.setupCommunication).toHaveBeenCalledWith(expect.anything(), communicationConfig)
  })

  it('should create agent with correct configuration', () => {
    const config = {
      name: 'TestWorker',
      description: 'A test worker',
      role: 'Custom Role',
      url: 'https://custom-url.com',
      searches: ['search1', 'search2'],
      actions: ['action1', 'action2'],
    }

    const worker = Worker(config)

    expect(worker.agent.config.name).toBe('TestWorker')
    expect(worker.agent.config.role).toBe('Custom Role')
    expect(worker.agent.config.url).toBe('https://custom-url.com')
    expect(worker.agent.config.objective).toBe('A test worker')
    expect(worker.agent.config.searches).toEqual(['search1', 'search2'])
    expect(worker.agent.config.actions).toEqual(['action1', 'action2'])
  })
})
