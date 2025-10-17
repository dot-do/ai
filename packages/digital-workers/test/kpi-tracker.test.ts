import { describe, it, expect, vi } from 'vitest'
import { WorkerInstance, WorkerEventLoopConfig, OkrTarget } from '../src/types'
import { KpiTracker, createKpiTracker, defaultKpiSources, defaultKpiEvaluators } from '../src/kpi-tracker'

describe('KPI Tracker', () => {
  it('should evaluate KPIs against OKRs', async () => {
    const worker = {
      id: 'worker-123',
      agent: {
        execute: vi.fn().mockResolvedValue({
          kpiValues: {
            'conversion-rate': 0.12,
            'response-time': 250,
            'customer-satisfaction': 4.8,
          },
        }),
        onKpiUpdate: vi.fn(),
      },
      context: {},
      plans: [],
      execute: vi.fn(),
      updateContext: vi.fn().mockResolvedValue({}),
      sendMessage: vi.fn(),
      evaluateKpis: async () => {
        return {
          status: 'completed',
          timestamp: new Date().toISOString(),
          kpiValues: {
            'conversion-rate': 0.12,
            'response-time': 250,
            'customer-satisfaction': 4.8,
          },
          evaluationResults: {
            kpis: {
              'conversion-rate': {
                target: '> 0.1',
                current: 0.12,
                status: 'above_target',
                score: 1,
                message: 'Current value 0.12 exceeds target 0.1',
                weight: 2,
              },
              'response-time': {
                target: '< 300',
                current: 250,
                status: 'above_target',
                score: 1,
                message: 'Current value 250 is better than target 300',
                weight: 1,
              },
              'customer-satisfaction': {
                target: '> 4.5',
                current: 4.8,
                status: 'above_target',
                score: 1,
                message: 'Current value 4.8 exceeds target 4.5',
                weight: 3,
              },
            },
            overallScore: 1,
            totalWeight: 6,
            recommendations: [],
          },
        }
      },
    } as unknown as WorkerInstance

    const result = await worker.evaluateKpis()

    expect(result).toEqual(
      expect.objectContaining({
        status: 'completed',
        timestamp: expect.any(String),
        kpiValues: expect.objectContaining({
          'conversion-rate': 0.12,
          'response-time': 250,
          'customer-satisfaction': 4.8,
        }),
        evaluationResults: expect.objectContaining({
          kpis: expect.objectContaining({
            'conversion-rate': expect.objectContaining({
              target: '> 0.1',
              current: 0.12,
              status: 'above_target',
            }),
            'response-time': expect.objectContaining({
              target: '< 300',
              current: 250,
              status: 'above_target',
            }),
            'customer-satisfaction': expect.objectContaining({
              target: '> 4.5',
              current: 4.8,
              status: 'above_target',
            }),
          }),
          overallScore: 1,
          recommendations: expect.any(Array),
        }),
      })
    )
  })

  it('should handle KPIs below target', async () => {
    const worker = {
      id: 'worker-123',
      agent: {
        execute: vi.fn().mockResolvedValue({
          kpiValues: {
            'conversion-rate': 0.05,
            'response-time': 350,
          },
        }),
        onKpiUpdate: vi.fn(),
      },
      context: {},
      plans: [],
      execute: vi.fn(),
      updateContext: vi.fn().mockResolvedValue({}),
      sendMessage: vi.fn(),
      evaluateKpis: async () => {
        return {
          status: 'completed',
          timestamp: new Date().toISOString(),
          kpiValues: {
            'conversion-rate': 0.05,
            'response-time': 350,
          },
          evaluationResults: {
            kpis: {
              'conversion-rate': {
                target: '> 0.1',
                current: 0.05,
                status: 'below_target',
                score: 0.5,
                message: 'Current value 0.05 is below target 0.1',
                weight: 2,
              },
              'response-time': {
                target: '< 300',
                current: 350,
                status: 'below_target',
                score: 0.857,
                message: 'Current value 350 exceeds target 300',
                weight: 1,
              },
            },
            overallScore: 0.619,
            totalWeight: 3,
            recommendations: [
              {
                kpi: 'conversion-rate',
                message: 'Improve conversion-rate from 0.05 to meet target 0.1',
                priority: 2,
              },
              {
                kpi: 'response-time',
                message: 'Improve response-time from 350 to meet target 300',
                priority: 1,
              },
            ],
          },
        }
      },
    } as unknown as WorkerInstance

    const result = await worker.evaluateKpis()

    expect(result).toEqual(
      expect.objectContaining({
        status: 'completed',
        kpiValues: expect.objectContaining({
          'conversion-rate': 0.05,
          'response-time': 350,
        }),
        evaluationResults: expect.objectContaining({
          kpis: expect.objectContaining({
            'conversion-rate': expect.objectContaining({
              status: 'below_target',
            }),
            'response-time': expect.objectContaining({
              status: 'below_target',
            }),
          }),
          recommendations: expect.arrayContaining([
            expect.objectContaining({
              kpi: 'conversion-rate',
              message: expect.stringContaining('Improve conversion-rate'),
            }),
          ]),
        }),
      })
    )

    const recommendations = result.evaluationResults.recommendations
    expect(recommendations[0].priority).toBeGreaterThanOrEqual(recommendations[1].priority)
  })

  it('should create KPI tracker with default sources and evaluators', () => {
    const worker = {
      id: 'worker-123',
      agent: { execute: vi.fn() },
      context: {},
      plans: [],
      execute: vi.fn(),
      updateContext: vi.fn(),
      sendMessage: vi.fn(),
      evaluateKpis: vi.fn(),
    } as unknown as WorkerInstance

    const tracker = createKpiTracker(worker)

    expect(tracker).toBeInstanceOf(KpiTracker)
  })

  it('should register custom KPI source', () => {
    const worker = {
      id: 'worker-123',
      agent: { execute: vi.fn() },
      context: {},
      plans: [],
      execute: vi.fn(),
      updateContext: vi.fn(),
      sendMessage: vi.fn(),
      evaluateKpis: vi.fn(),
    } as unknown as WorkerInstance

    const tracker = new KpiTracker(worker)
    const customSource = {
      name: 'Custom Source',
      getKpiValues: vi.fn().mockResolvedValue({ customKpi: 100 }),
    }

    tracker.registerSource('custom', customSource)

    expect(tracker['sources']['custom']).toBe(customSource)
  })

  it('should register custom KPI evaluator', () => {
    const worker = {
      id: 'worker-123',
      agent: { execute: vi.fn() },
      context: {},
      plans: [],
      execute: vi.fn(),
      updateContext: vi.fn(),
      sendMessage: vi.fn(),
      evaluateKpis: vi.fn(),
    } as unknown as WorkerInstance

    const tracker = new KpiTracker(worker)
    const customEvaluator = {
      name: 'Custom Evaluator',
      evaluateKpis: vi.fn().mockResolvedValue({
        kpis: {},
        overallScore: 0.8,
        recommendations: [],
        timestamp: new Date().toISOString(),
      }),
    }

    tracker.registerEvaluator('custom', customEvaluator)

    expect(tracker['evaluators']['custom']).toBe(customEvaluator)
  })

  it('should get KPI values from multiple sources', async () => {
    const worker = {
      id: 'worker-123',
      agent: { execute: vi.fn().mockResolvedValue({ kpiValues: { agentKpi: 50 } }) },
      context: { kpiValues: { contextKpi: 75 } },
      plans: [],
      execute: vi.fn(),
      updateContext: vi.fn(),
      sendMessage: vi.fn(),
      evaluateKpis: vi.fn(),
    } as unknown as WorkerInstance

    const tracker = new KpiTracker(worker)
    const kpis = ['agentKpi', 'contextKpi', 'missingKpi']

    const result = await tracker.getKpiValues(kpis)

    expect(result).toEqual({
      agentKpi: 50,
      contextKpi: 75,
    })
  })

  it('should handle errors in KPI source gracefully', async () => {
    const worker = {
      id: 'worker-123',
      agent: { execute: vi.fn().mockRejectedValue(new Error('Agent error')) },
      context: {},
      plans: [],
      execute: vi.fn(),
      updateContext: vi.fn(),
      sendMessage: vi.fn(),
      evaluateKpis: vi.fn(),
    } as unknown as WorkerInstance

    const tracker = new KpiTracker(worker)
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const result = await tracker.getKpiValues(['kpi1'])

    expect(result).toEqual({})
    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  it('should evaluate KPIs with custom strategy', async () => {
    const worker = {
      id: 'worker-123',
      agent: { execute: vi.fn() },
      context: {},
      plans: [],
      execute: vi.fn(),
      updateContext: vi.fn(),
      sendMessage: vi.fn(),
      evaluateKpis: vi.fn(),
    } as unknown as WorkerInstance

    const tracker = new KpiTracker(worker)
    const customEvaluator = {
      name: 'Custom Evaluator',
      evaluateKpis: vi.fn().mockResolvedValue({
        kpis: { kpi1: { status: 'custom', score: 0.9 } },
        overallScore: 0.9,
        recommendations: [],
        timestamp: new Date().toISOString(),
      }),
    }

    tracker.registerEvaluator('custom', customEvaluator)

    const kpiValues = { kpi1: 95 }
    const okrs = { kpi1: { target: '> 90', weight: 1 } }

    const result = await tracker.evaluateKpis(kpiValues, okrs, 'custom')

    expect(customEvaluator.evaluateKpis).toHaveBeenCalledWith(kpiValues, okrs)
    expect(result.overallScore).toBe(0.9)
  })

  it('should fallback to simple evaluator for nonexistent strategy', async () => {
    const worker = {
      id: 'worker-123',
      agent: { execute: vi.fn() },
      context: {},
      plans: [],
      execute: vi.fn(),
      updateContext: vi.fn(),
      sendMessage: vi.fn(),
      evaluateKpis: vi.fn(),
    } as unknown as WorkerInstance

    const tracker = new KpiTracker(worker)

    const kpiValues = { kpi1: 95 }
    const okrs = { kpi1: { target: '> 90', weight: 1 } }

    const result = await tracker.evaluateKpis(kpiValues, okrs, 'nonexistent')

    expect(result).toHaveProperty('kpis')
    expect(result).toHaveProperty('overallScore')
    expect(result).toHaveProperty('recommendations')
    expect(result.kpis.kpi1.status).toBe('above_target')
    expect(result.overallScore).toBe(1)
  })

  it('should track KPIs and update worker context', async () => {
    const worker = {
      id: 'worker-123',
      agent: { execute: vi.fn().mockResolvedValue({ kpiValues: { kpi1: 95 } }) },
      context: {},
      plans: [],
      execute: vi.fn(),
      updateContext: vi.fn().mockResolvedValue({}),
      sendMessage: vi.fn(),
      evaluateKpis: vi.fn(),
    } as unknown as WorkerInstance

    const tracker = new KpiTracker(worker)
    const kpis = ['kpi1']
    const okrs = { kpi1: { target: '> 90', weight: 1 } }

    const result = await tracker.trackKpis(kpis, okrs)

    expect(worker.updateContext).toHaveBeenCalledWith({
      lastKpiTracking: {
        timestamp: expect.any(String),
        kpiValues: { kpi1: 95 },
        result: expect.any(Object),
      },
    })
    expect(result).toHaveProperty('kpis')
    expect(result).toHaveProperty('overallScore')
  })

  it('should handle API KPI source with valid configuration', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ kpiValues: { apiKpi: 85 } }),
    })

    const worker = {
      id: 'worker-123',
      agent: { execute: vi.fn() },
      context: {
        kpiApi: {
          url: 'https://api.example.com/kpis',
          headers: { Authorization: 'Bearer token' },
          method: 'POST',
        },
      },
      plans: [],
      execute: vi.fn(),
      updateContext: vi.fn(),
      sendMessage: vi.fn(),
      evaluateKpis: vi.fn(),
    } as unknown as WorkerInstance

    const result = await defaultKpiSources.api.getKpiValues(worker, ['apiKpi'])

    expect(fetch).toHaveBeenCalledWith('https://api.example.com/kpis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token',
      },
      body: JSON.stringify({ kpis: ['apiKpi'] }),
    })
    expect(result).toEqual({ apiKpi: 85 })
  })

  it('should handle API KPI source errors gracefully', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    })

    const worker = {
      id: 'worker-123',
      agent: { execute: vi.fn() },
      context: {
        kpiApi: {
          url: 'https://api.example.com/kpis',
        },
      },
      plans: [],
      execute: vi.fn(),
      updateContext: vi.fn(),
      sendMessage: vi.fn(),
      evaluateKpis: vi.fn(),
    } as unknown as WorkerInstance

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const result = await defaultKpiSources.api.getKpiValues(worker, ['apiKpi'])

    expect(result).toEqual({})
    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })
})
