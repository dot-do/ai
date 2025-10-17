import { AgentConfig, AutonomousAgent } from './types'

/**
 * Creates an autonomous agent with the provided configuration
 * @param config The agent configuration
 * @returns An autonomous agent instance
 */
export function Agent(config: AgentConfig): AutonomousAgent {
  const state: Record<string, any> = {}

  const eventHandlers = config.triggers.reduce(
    (handlers, trigger) => {
      handlers[trigger] = createEventHandler(trigger, config)
      return handlers
    },
    {} as Record<string, (data: any) => Promise<any>>
  )

  const agent: AutonomousAgent = {
    config,

    async execute(input: Record<string, any>, options?: any): Promise<any> {
      try {
        const startTime = Date.now()

        const result = {
          data: 'executed',
          input,
          options,
          agent: config.name,
          timestamp: new Date().toISOString(),
        }

        const executionTime = Date.now() - startTime

        state.lastExecution = {
          timestamp: new Date().toISOString(),
          executionTime,
          input,
          result,
        }

        return result
      } catch (error) {
        console.error(`Error executing agent ${config.name}:`, error)
        throw error
      }
    },

    do: createAgentProxy(config, state),
  }

  for (const trigger of config.triggers) {
    if (eventHandlers[trigger]) {
      agent[trigger] = eventHandlers[trigger]
    }
  }

  return agent
}

/**
 * Creates a proxy for dynamic method invocation
 */
function createAgentProxy(config: AgentConfig, _state: Record<string, any>): any {
  return new Proxy(
    {},
    {
      get: (_target, prop) => {
        if (typeof prop !== 'string') return undefined

        return async (input: any) => {
          return {
            action: prop,
            input,
            agent: config.name,
            timestamp: new Date().toISOString(),
          }
        }
      },
    }
  )
}

/**
 * Creates an event handler function
 */
function createEventHandler(trigger: string, config: AgentConfig): (data: any) => Promise<any> {
  return async (data: any) => {
    console.log(`Event ${trigger} triggered for agent ${config.name}`)
    return {
      event: trigger,
      data,
      handled: true,
      agent: config.name,
      timestamp: new Date().toISOString(),
    }
  }
}
