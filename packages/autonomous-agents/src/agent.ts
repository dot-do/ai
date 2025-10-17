import { AgentConfig, AutonomousAgent, ExecuteResult, ExecuteOptions, EventHandler, ActionResult, AgentState } from './types'
import { createAgentProxy, createEventHandler } from './utils'

/**
 * Creates an autonomous agent with the provided configuration
 * @param config The agent configuration
 * @returns An autonomous agent instance
 */
export function Agent(config: AgentConfig): AutonomousAgent {
  const state: AgentState = {}

  const eventHandlers = config.triggers.reduce(
    (handlers, trigger) => {
      handlers[trigger] = createEventHandler(trigger, config)
      return handlers
    },
    {} as Record<string, EventHandler>
  )

  const agent: AutonomousAgent = {
    config,

    async execute(input: Record<string, string | number | boolean | null>, options?: ExecuteOptions): Promise<ExecuteResult> {
      const startTime = Date.now()

      try {
        // Agent execution logic here
        // This is where the agent would process input and perform its primary function
        const resultData: Record<string, string | number | boolean | null> = {
          status: 'executed',
          objective: config.objective,
        }

        const executionTime = Date.now() - startTime

        const result: ExecuteResult = {
          data: resultData,
          input,
          options,
          agent: config.name,
          timestamp: new Date().toISOString(),
          executionTime,
        }

        state.lastExecution = {
          timestamp: new Date().toISOString(),
          executionTime,
          input,
          result,
        }

        return result
      } catch (error) {
        const executionTime = Date.now() - startTime
        throw new Error(`Agent execution failed after ${executionTime}ms: ${error}`)
      }
    },

    do: createAgentProxy(config, state),
  }

  // Attach event handlers for each trigger
  for (const trigger of config.triggers) {
    if (eventHandlers[trigger]) {
      agent[trigger] = eventHandlers[trigger]
    }
  }

  return agent
}
