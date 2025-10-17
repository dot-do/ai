import cron from 'node-cron'
import { WorkerInstance, WorkerEventLoopConfig, OkrTarget } from './types'

/**
 * Sets up the event loop for a worker to regularly evaluate KPIs against OKRs
 * @param worker The worker instance
 * @param config The event loop configuration
 */
export function setupEventLoop(worker: WorkerInstance, config: WorkerEventLoopConfig): void {
  if (!config || !config.frequency || !config.kpis || !config.okrs) {
    console.warn('Event loop not configured properly, skipping setup')
    return
  }

  if (!cron.validate(config.frequency)) {
    console.error(`Invalid cron expression: ${config.frequency}`)
    return
  }

  const job = cron.schedule(config.frequency, async () => {
    try {
      await evaluateKpisAgainstOkrs(worker, config)
    } catch (error) {
      console.error('Error in worker event loop:', error)

      await worker.updateContext({
        lastEventLoopError: {
          timestamp: new Date().toISOString(),
          message: error instanceof Error ? error.message : String(error),
        },
      })
    }
  })

  worker.eventLoopJob = job

  worker.evaluateKpis = async () => {
    return evaluateKpisAgainstOkrs(worker, config)
  }

  worker.stopEventLoop = () => {
    if (worker.eventLoopJob) {
      worker.eventLoopJob.stop()
      return { status: 'stopped' }
    }
    return { status: 'not_running' }
  }

  worker.restartEventLoop = () => {
    if (worker.eventLoopJob) {
      worker.eventLoopJob.start()
      return { status: 'restarted' }
    }
    return { status: 'not_configured' }
  }

  console.log(`Event loop set up for worker ${worker.id} with frequency ${config.frequency}`)
}

/**
 * Evaluates the current KPIs against the OKR targets
 * @param worker The worker instance
 * @param config The event loop configuration
 * @returns Evaluation results
 */
async function evaluateKpisAgainstOkrs(worker: WorkerInstance, config: WorkerEventLoopConfig): Promise<any> {
  const kpiValues = await fetchCurrentKpiValues(worker, config.kpis)

  if (config.evaluationStrategy === 'custom' && config.customEvaluator) {
    return config.customEvaluator(kpiValues, config.okrs)
  }

  const evaluationResults = evaluateKpis(kpiValues, config.okrs, config.evaluationStrategy)

  await worker.updateContext({
    lastKpiEvaluation: {
      timestamp: new Date().toISOString(),
      kpiValues,
      evaluationResults,
    },
  })

  if (typeof worker.agent.onKpiUpdate === 'function') {
    await worker.agent.onKpiUpdate({
      kpiValues,
      evaluationResults,
    })
  }

  return {
    status: 'completed',
    timestamp: new Date().toISOString(),
    kpiValues,
    evaluationResults,
  }
}

/**
 * Fetches the current values for the specified KPIs
 * @param worker The worker instance
 * @param kpis The KPIs to fetch
 * @returns Current KPI values
 */
async function fetchCurrentKpiValues(worker: WorkerInstance, kpis: string[]): Promise<Record<string, any>> {
  try {
    const result = await worker.agent.execute({
      action: 'getKpiValues',
      kpis,
    })

    return result.kpiValues || {}
  } catch (error) {
    console.error('Error fetching KPI values:', error)
    return {}
  }
}

/**
 * Evaluates KPI values against OKR targets
 * @param kpiValues Current KPI values
 * @param okrs OKR targets
 * @param strategy Evaluation strategy
 * @returns Evaluation results
 */
function evaluateKpis(kpiValues: Record<string, any>, okrs: Record<string, OkrTarget>, strategy: string = 'simple'): any {
  const results: Record<string, any> = {
    kpis: {},
    overallScore: 0,
    totalWeight: 0,
    recommendations: [],
  }

  for (const [kpiName, target] of Object.entries(okrs)) {
    const currentValue = kpiValues[kpiName]

    if (currentValue === undefined) {
      results.kpis[kpiName] = {
        status: 'unknown',
        message: 'No current value available',
      }
      continue
    }

    target.currentValue = currentValue
    target.lastUpdated = new Date().toISOString()

    const evaluation = evaluateTarget(currentValue, target.target)

    results.kpis[kpiName] = {
      target: target.target,
      current: currentValue,
      status: evaluation.status,
      score: evaluation.score,
      message: evaluation.message,
      weight: target.weight,
    }

    if (strategy === 'weighted') {
      results.overallScore += evaluation.score * target.weight
      results.totalWeight += target.weight
    }

    if (evaluation.status === 'below_target') {
      results.recommendations.push({
        kpi: kpiName,
        message: `Improve ${kpiName} from ${currentValue} to meet target ${target.target}`,
        priority: target.weight,
      })
    }
  }

  if (strategy === 'simple') {
    const kpiCount = Object.keys(results.kpis).length
    if (kpiCount > 0) {
      results.overallScore = Object.values(results.kpis).reduce((sum: number, kpi: any) => sum + (kpi.score || 0), 0) / kpiCount
    }
  } else if (strategy === 'weighted' && results.totalWeight > 0) {
    results.overallScore = results.overallScore / results.totalWeight
  }

  results.recommendations.sort((a: any, b: any) => b.priority - a.priority)

  return results
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
