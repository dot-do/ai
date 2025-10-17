import { Agent } from './agent'
import { WorkerConfig, WorkerInstance } from './types'
import { setupEventLoop } from './scheduling'
import { setupCommunication } from './communication'
import crypto from 'crypto'

/**
 * Creates a digital worker with enhanced capabilities
 * @param config The worker configuration
 * @returns A digital worker instance
 */
export function Worker(config: WorkerConfig): WorkerInstance {
  const agent = Agent({
    name: config.name,
    url: config.url || `https://${config.name.toLowerCase().replace(/\s+/g, '-')}.worker.ai`,
    role: config.role || 'Digital Worker',
    objective: config.description,
    keyResults: config.eventLoop?.kpis || [],
    integrations: Object.keys(config.communication || {}),
    triggers: ['onTaskAssigned', 'onKpiUpdate', 'onContextChange'],
    searches: config.searches || [],
    actions: config.actions || [],
  })

  const worker: WorkerInstance = {
    id: config.id || crypto.randomUUID(),
    agent,
    context: config.initialContext || {},
    plans: config.initialPlans || [],

    async execute(input: any): Promise<any> {
      return agent.execute(input)
    },

    async updateContext(newContext: any): Promise<void> {
      worker.context = {
        ...worker.context,
        ...newContext,
        lastUpdated: new Date().toISOString(),
      }

      if (typeof agent.onContextChange === 'function') {
        await agent.onContextChange(worker.context)
      }
    },

    async sendMessage(channel: string, message: any): Promise<void> {
      if (!config.communication || !config.communication[channel]) {
        throw new Error(`Communication channel "${channel}" not configured`)
      }

      return agent.execute({
        action: 'sendMessage',
        channel,
        message,
      })
    },

    async evaluateKpis(): Promise<any> {
      if (!config.eventLoop || !config.eventLoop.kpis || !config.eventLoop.okrs) {
        return { status: 'no_kpis_configured' }
      }

      return { status: 'evaluation_scheduled' }
    },
  }

  if (config.communication) {
    setupCommunication(worker, config.communication)
  }

  if (config.eventLoop) {
    setupEventLoop(worker, config.eventLoop)
  }

  return worker
}

export * from './types'
