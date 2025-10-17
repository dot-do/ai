import { WorkerInstance, OkrTarget } from './types'

/**
 * KPI Source interface for retrieving KPI values
 */
export interface KpiSource {
  name: string
  description?: string
  getKpiValues: (worker: WorkerInstance, kpis: string[]) => Promise<Record<string, any>>
}

/**
 * KPI Evaluator interface for evaluating KPIs against OKRs
 */
export interface KpiEvaluator {
  name: string
  description?: string
  evaluateKpis: (kpiValues: Record<string, any>, okrs: Record<string, OkrTarget>) => Promise<KpiEvaluationResult>
}

/**
 * KPI Evaluation Result interface
 */
export interface KpiEvaluationResult {
  kpis: Record<string, KpiStatus>
  overallScore: number
  recommendations: KpiRecommendation[]
  timestamp: string
  [key: string]: any
}

/**
 * KPI Status interface
 */
export interface KpiStatus {
  target: string
  current: any
  status: 'above_target' | 'at_target' | 'below_target' | 'unknown'
  score: number
  message: string
  weight: number
}

/**
 * KPI Recommendation interface
 */
export interface KpiRecommendation {
  kpi: string
  message: string
  priority: number
  actions?: string[]
}

/**
 * Default KPI sources
 */
export const defaultKpiSources: Record<string, KpiSource> = {
  agent: {
    name: 'Agent KPI Source',
    description: 'Retrieves KPI values using the agent execute method',
    getKpiValues: async (worker: WorkerInstance, kpis: string[]): Promise<Record<string, any>> => {
      try {
        const result = await worker.agent.execute({
          action: 'getKpiValues',
          kpis,
        })

        return result.kpiValues || {}
      } catch (error) {
        console.error('Error fetching KPI values from agent:', error)
        return {}
      }
    },
  },

  context: {
    name: 'Context KPI Source',
    description: 'Retrieves KPI values from the worker context',
    getKpiValues: async (worker: WorkerInstance, kpis: string[]): Promise<Record<string, any>> => {
      const kpiValues: Record<string, any> = {}

      if (worker.context.kpiValues) {
        for (const kpi of kpis) {
          if (worker.context.kpiValues[kpi] !== undefined) {
            kpiValues[kpi] = worker.context.kpiValues[kpi]
          }
        }
      }

      return kpiValues
    },
  },

  api: {
    name: 'API KPI Source',
    description: 'Retrieves KPI values from an external API',
    getKpiValues: async (worker: WorkerInstance, kpis: string[]): Promise<Record<string, any>> => {
      if (!worker.context.kpiApi) {
        return {}
      }

      try {
        const { url, headers, method = 'GET' } = worker.context.kpiApi

        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
          body: method !== 'GET' ? JSON.stringify({ kpis }) : undefined,
        })

        if (!response.ok) {
          throw new Error(`API returned ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        return data.kpiValues || data
      } catch (error) {
        console.error('Error fetching KPI values from API:', error)
        return {}
      }
    },
  },
}

/**
 * Default KPI evaluators
 */
export const defaultKpiEvaluators: Record<string, KpiEvaluator> = {
  simple: {
    name: 'Simple KPI Evaluator',
    description: 'Evaluates KPIs using a simple average score',
    evaluateKpis: async (kpiValues: Record<string, any>, okrs: Record<string, OkrTarget>): Promise<KpiEvaluationResult> => {
      const result: KpiEvaluationResult = {
        kpis: {},
        overallScore: 0,
        recommendations: [],
        timestamp: new Date().toISOString(),
      }

      let totalScore = 0
      let kpiCount = 0

      for (const [kpiName, target] of Object.entries(okrs)) {
        const currentValue = kpiValues[kpiName]

        if (currentValue === undefined) {
          result.kpis[kpiName] = {
            target: target.target,
            current: null,
            status: 'unknown',
            score: 0,
            message: 'No current value available',
            weight: target.weight,
          }
          continue
        }

        const evaluation = evaluateTarget(currentValue, target.target)

        result.kpis[kpiName] = {
          target: target.target,
          current: currentValue,
          status: evaluation.status,
          score: evaluation.score,
          message: evaluation.message,
          weight: target.weight,
        }

        totalScore += evaluation.score
        kpiCount++

        if (evaluation.status === 'below_target') {
          result.recommendations.push({
            kpi: kpiName,
            message: `Improve ${kpiName} from ${currentValue} to meet target ${target.target}`,
            priority: target.weight,
            actions: generateRecommendedActions(kpiName, currentValue, target.target),
          })
        }
      }

      if (kpiCount > 0) {
        result.overallScore = totalScore / kpiCount
      }

      result.recommendations.sort((a, b) => b.priority - a.priority)

      return result
    },
  },

  weighted: {
    name: 'Weighted KPI Evaluator',
    description: 'Evaluates KPIs using weights for each KPI',
    evaluateKpis: async (kpiValues: Record<string, any>, okrs: Record<string, OkrTarget>): Promise<KpiEvaluationResult> => {
      const result: KpiEvaluationResult = {
        kpis: {},
        overallScore: 0,
        recommendations: [],
        timestamp: new Date().toISOString(),
      }

      let weightedScore = 0
      let totalWeight = 0

      for (const [kpiName, target] of Object.entries(okrs)) {
        const currentValue = kpiValues[kpiName]

        if (currentValue === undefined) {
          result.kpis[kpiName] = {
            target: target.target,
            current: null,
            status: 'unknown',
            score: 0,
            message: 'No current value available',
            weight: target.weight,
          }
          continue
        }

        const evaluation = evaluateTarget(currentValue, target.target)

        result.kpis[kpiName] = {
          target: target.target,
          current: currentValue,
          status: evaluation.status,
          score: evaluation.score,
          message: evaluation.message,
          weight: target.weight,
        }

        weightedScore += evaluation.score * target.weight
        totalWeight += target.weight

        if (evaluation.status === 'below_target') {
          result.recommendations.push({
            kpi: kpiName,
            message: `Improve ${kpiName} from ${currentValue} to meet target ${target.target}`,
            priority: target.weight,
            actions: generateRecommendedActions(kpiName, currentValue, target.target),
          })
        }
      }

      if (totalWeight > 0) {
        result.overallScore = weightedScore / totalWeight
      }

      result.recommendations.sort((a, b) => b.priority - a.priority)

      return result
    },
  },
}

/**
 * KPI Tracker class for managing KPI sources and evaluators
 */
export class KpiTracker {
  private sources: Record<string, KpiSource> = { ...defaultKpiSources }
  private evaluators: Record<string, KpiEvaluator> = { ...defaultKpiEvaluators }
  private worker: WorkerInstance

  constructor(worker: WorkerInstance) {
    this.worker = worker
  }

  /**
   * Registers a new KPI source
   * @param name Source name
   * @param source KPI source
   */
  registerSource(name: string, source: KpiSource): void {
    this.sources[name] = source
  }

  /**
   * Registers a new KPI evaluator
   * @param name Evaluator name
   * @param evaluator KPI evaluator
   */
  registerEvaluator(name: string, evaluator: KpiEvaluator): void {
    this.evaluators[name] = evaluator
  }

  /**
   * Gets KPI values from all registered sources
   * @param kpis KPIs to retrieve
   * @returns KPI values
   */
  async getKpiValues(kpis: string[]): Promise<Record<string, any>> {
    const kpiValues: Record<string, any> = {}

    for (const source of Object.values(this.sources)) {
      try {
        const values = await source.getKpiValues(this.worker, kpis)

        for (const [kpi, value] of Object.entries(values)) {
          if (kpiValues[kpi] === undefined && kpis.includes(kpi)) {
            kpiValues[kpi] = value
          }
        }
      } catch (error) {
        console.error(`Error getting KPI values from source ${source.name}:`, error)
      }
    }

    return kpiValues
  }

  /**
   * Evaluates KPIs against OKRs
   * @param kpiValues KPI values
   * @param okrs OKR targets
   * @param strategy Evaluation strategy
   * @returns Evaluation result
   */
  async evaluateKpis(kpiValues: Record<string, any>, okrs: Record<string, OkrTarget>, strategy: string = 'simple'): Promise<KpiEvaluationResult> {
    const evaluator = this.evaluators[strategy] || this.evaluators.simple

    try {
      return await evaluator.evaluateKpis(kpiValues, okrs)
    } catch (error) {
      console.error(`Error evaluating KPIs with strategy ${strategy}:`, error)

      if (strategy !== 'simple' && this.evaluators.simple) {
        return this.evaluators.simple.evaluateKpis(kpiValues, okrs)
      }

      return {
        kpis: {},
        overallScore: 0,
        recommendations: [],
        timestamp: new Date().toISOString(),
        error: String(error),
      }
    }
  }

  /**
   * Tracks KPIs for a worker
   * @param kpis KPIs to track
   * @param okrs OKR targets
   * @param strategy Evaluation strategy
   * @returns Tracking result
   */
  async trackKpis(kpis: string[], okrs: Record<string, OkrTarget>, strategy: string = 'simple'): Promise<KpiEvaluationResult> {
    const kpiValues = await this.getKpiValues(kpis)

    const result = await this.evaluateKpis(kpiValues, okrs, strategy)

    await this.worker.updateContext({
      lastKpiTracking: {
        timestamp: result.timestamp,
        kpiValues,
        result,
      },
    })

    return result
  }
}

/**
 * Creates a KPI tracker for a worker
 * @param worker Worker instance
 * @returns KPI tracker
 */
export function createKpiTracker(worker: WorkerInstance): KpiTracker {
  return new KpiTracker(worker)
}

/**
 * Evaluates a current value against a target string
 * @param currentValue The current value
 * @param targetStr The target string (e.g., "> 85%", "< 30 minutes")
 * @returns Evaluation result
 */
function evaluateTarget(
  currentValue: any,
  targetStr: string
): {
  status: 'above_target' | 'at_target' | 'below_target' | 'unknown'
  score: number
  message: string
} {
  const result = {
    status: 'unknown' as 'above_target' | 'at_target' | 'below_target' | 'unknown',
    score: 0,
    message: 'Unable to evaluate target',
  }

  try {
    const match = targetStr.trim().match(/^([<>=]+)\s*(.+)$/)

    if (!match) {
      return result
    }

    const [, operator, valueStr] = match

    let targetValue = parseFloat(valueStr)
    const isPercentage = valueStr.includes('%')

    if (isPercentage) {
      targetValue /= 100
      currentValue = parseFloat(currentValue) / 100
    }

    switch (operator) {
      case '>':
        result.status = currentValue > targetValue ? 'above_target' : 'below_target'
        result.score = currentValue > targetValue ? 1 : Math.max(0, currentValue / targetValue)
        result.message =
          currentValue > targetValue
            ? `Current value ${currentValue} exceeds target ${targetValue}`
            : `Current value ${currentValue} is below target ${targetValue}`
        break

      case '>=':
        result.status = currentValue >= targetValue ? 'at_target' : 'below_target'
        result.score = currentValue >= targetValue ? 1 : Math.max(0, currentValue / targetValue)
        result.message =
          currentValue >= targetValue
            ? `Current value ${currentValue} meets or exceeds target ${targetValue}`
            : `Current value ${currentValue} is below target ${targetValue}`
        break

      case '<':
        result.status = currentValue < targetValue ? 'above_target' : 'below_target'
        result.score = currentValue < targetValue ? 1 : Math.max(0, targetValue / currentValue)
        result.message =
          currentValue < targetValue
            ? `Current value ${currentValue} is better than target ${targetValue}`
            : `Current value ${currentValue} exceeds target ${targetValue}`
        break

      case '<=':
        result.status = currentValue <= targetValue ? 'at_target' : 'below_target'
        result.score = currentValue <= targetValue ? 1 : Math.max(0, targetValue / currentValue)
        result.message =
          currentValue <= targetValue
            ? `Current value ${currentValue} meets or is better than target ${targetValue}`
            : `Current value ${currentValue} exceeds target ${targetValue}`
        break

      case '=':
      case '==': {
        result.status = currentValue === targetValue ? 'at_target' : 'below_target'
        const diff = Math.abs(currentValue - targetValue)
        result.score = diff < 0.1 * targetValue ? 1 - diff / targetValue : 0
        result.message =
          currentValue === targetValue
            ? `Current value ${currentValue} exactly matches target ${targetValue}`
            : `Current value ${currentValue} does not match target ${targetValue}`
        break
      }

      default:
        return result
    }

    return result
  } catch (error) {
    console.error('Error evaluating target:', error)
    return result
  }
}

/**
 * Generates recommended actions for a KPI
 * @param kpiName KPI name
 * @param currentValue Current value
 * @param targetStr Target string
 * @returns Recommended actions
 */
function generateRecommendedActions(kpiName: string, currentValue: any, targetStr: string): string[] {
  const actions: string[] = []

  const match = targetStr.trim().match(/^([<>=]+)\s*(.+)$/)
  if (!match) return actions

  const [,] = match

  switch (kpiName.toLowerCase()) {
    case 'responsetime':
    case 'response_time':
    case 'response-time':
      actions.push('Optimize response handling processes')
      actions.push('Increase resources allocated to response handling')
      actions.push('Implement automated response templates for common inquiries')
      break

    case 'resolutionrate':
    case 'resolution_rate':
    case 'resolution-rate':
      actions.push('Improve training for support staff')
      actions.push('Enhance knowledge base with more detailed solutions')
      actions.push('Implement better issue categorization for faster routing')
      break

    case 'customersatisfaction':
    case 'customer_satisfaction':
    case 'customer-satisfaction':
      actions.push('Conduct customer feedback surveys to identify pain points')
      actions.push('Improve follow-up processes after issue resolution')
      actions.push('Enhance communication clarity and frequency')
      break

    case 'revenue':
    case 'sales':
      actions.push('Review pricing strategy')
      actions.push('Identify new market opportunities')
      actions.push('Optimize sales funnel conversion rates')
      break

    case 'costs':
    case 'expenses':
      actions.push('Identify cost-saving opportunities')
      actions.push('Optimize resource allocation')
      actions.push('Review vendor contracts for better terms')
      break

    default:
      actions.push(`Analyze factors affecting ${kpiName}`)
      actions.push(`Develop specific strategies to improve ${kpiName}`)
      actions.push(`Set up regular monitoring for ${kpiName}`)
  }

  return actions
}
