import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setupEventLoop } from '../src/scheduling'
import { WorkerInstance, WorkerEventLoopConfig } from '../src/types'
import cron from 'node-cron'

vi.mock('node-cron', () => ({
  default: {
    schedule: vi.fn(() => ({ stop: vi.fn(), start: vi.fn() })),
    validate: vi.fn((expr) => expr === '*/15 * * * *'),
  },
}))

describe('Event Loop', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  it('should set up event loop with valid configuration', () => {
    const worker = {
      id: 'worker-123',
      agent: {
        execute: vi.fn().mockResolvedValue({ kpiValues: { kpi1: 90 } }),
        onKpiUpdate: vi.fn(),
      },
      context: {},
      plans: [],
      execute: vi.fn(),
      updateContext: vi.fn().mockResolvedValue({}),
      sendMessage: vi.fn(),
      evaluateKpis: vi.fn(),
    } as unknown as WorkerInstance

    const config: WorkerEventLoopConfig = {
      frequency: '*/15 * * * *',
      kpis: ['kpi1', 'kpi2'],
      okrs: {
        kpi1: { target: '> 90%', weight: 1 },
      },
    }

    setupEventLoop(worker, config)

    expect(cron.schedule).toHaveBeenCalledWith('*/15 * * * *', expect.any(Function))
    expect(worker.eventLoopJob).toBeDefined()
    expect(worker.evaluateKpis).toBeDefined()
    expect(worker.stopEventLoop).toBeDefined()
    expect(worker.restartEventLoop).toBeDefined()
  })

  it('should not set up event loop with invalid configuration', () => {
    const worker = {
      id: 'worker-123',
      agent: {},
      context: {},
      plans: [],
      execute: vi.fn(),
      updateContext: vi.fn(),
      sendMessage: vi.fn(),
      evaluateKpis: vi.fn(),
    } as unknown as WorkerInstance

    const config = {
      frequency: '*/15 * * * *',
    } as unknown as WorkerEventLoopConfig

    setupEventLoop(worker, config)

    expect(cron.schedule).not.toHaveBeenCalled()
    expect(console.warn).toHaveBeenCalledWith('Event loop not configured properly, skipping setup')
  })

  it('should not set up event loop with invalid cron expression', () => {
    const worker = {
      id: 'worker-123',
      agent: {},
      context: {},
      plans: [],
      execute: vi.fn(),
      updateContext: vi.fn(),
      sendMessage: vi.fn(),
      evaluateKpis: vi.fn(),
    } as unknown as WorkerInstance

    const config: WorkerEventLoopConfig = {
      frequency: 'invalid-cron',
      kpis: ['kpi1'],
      okrs: { kpi1: { target: '> 90%', weight: 1 } },
    }

    setupEventLoop(worker, config)

    expect(cron.validate).toHaveBeenCalledWith('invalid-cron')
    expect(cron.schedule).not.toHaveBeenCalled()
    expect(console.error).toHaveBeenCalledWith('Invalid cron expression: invalid-cron')
  })

  it('should provide methods to control the event loop', () => {
    const worker = {
      id: 'worker-123',
      agent: {
        execute: vi.fn().mockResolvedValue({ kpiValues: {} }),
      },
      context: {},
      plans: [],
      execute: vi.fn(),
      updateContext: vi.fn().mockResolvedValue({}),
      sendMessage: vi.fn(),
      evaluateKpis: vi.fn(),
    } as unknown as WorkerInstance

    const config = {
      frequency: '*/15 * * * *',
      kpis: ['kpi1'],
      okrs: { kpi1: { target: '> 90%', weight: 1 } },
    } as WorkerEventLoopConfig

    setupEventLoop(worker, config)

    const stopResult = worker.stopEventLoop()
    expect(worker.eventLoopJob.stop).toHaveBeenCalled()
    expect(stopResult).toEqual({ status: 'stopped' })

    const restartResult = worker.restartEventLoop()
    expect(worker.eventLoopJob.start).toHaveBeenCalled()
    expect(restartResult).toEqual({ status: 'restarted' })
  })
})
