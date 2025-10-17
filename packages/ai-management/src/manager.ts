import { Agent } from '../../../packages/autonomous-agents/src'
import { Objective, Plan } from '../../../packages/ai-business/src'
import { ManagerConfig, ManagerInstance, AutonomousAgent } from './types'
import crypto from 'crypto'

/**
 * Creates a manager for handling objectives, plans, and agent delegation
 * @param config The manager configuration
 * @returns A manager instance
 */
export function Manager(config: ManagerConfig): ManagerInstance {
  const agents = Object.entries(config.agents || {}).reduce(
    (acc, [key, agentConfig]) => {
      acc[key] = Agent(agentConfig)
      return acc
    },
    {} as Record<string, AutonomousAgent>
  )

  const manager: ManagerInstance = {
    id: crypto.randomUUID(),
    objectives: config.objectives || {},
    plans: config.initialPlans || [],
    agents,

    async updateObjective(key, objective) {
      if (!manager.objectives[key]) {
        throw new Error(`Objective with key "${key}" not found`)
      }

      manager.objectives[key] = {
        ...manager.objectives[key],
        ...objective,
      }
    },

    async createPlan(planData) {
      const now = new Date().toISOString()
      const plan: Plan = {
        id: crypto.randomUUID(),
        ...planData,
        status: planData.status || 'draft',
        createdAt: now,
        updatedAt: now,
      }

      manager.plans.push(plan)
      return plan
    },

    async assignTask(agentId, task) {
      if (!manager.agents[agentId]) {
        throw new Error(`Agent with ID "${agentId}" not found`)
      }

      return manager.agents[agentId].execute(task)
    },

    async getObjectiveProgress(key) {
      if (!manager.objectives[key]) {
        throw new Error(`Objective with key "${key}" not found`)
      }

      const objective = manager.objectives[key]

      if (!objective.keyResults || objective.keyResults.length === 0) {
        return 0
      }

      let totalProgress = 0
      let keyResultCount = objective.keyResults.length

      for (const kr of objective.keyResults) {
        if (typeof kr === 'string') {
          totalProgress += 0
        } else {
          totalProgress += kr.progress || 0
        }
      }

      return totalProgress / keyResultCount
    },

    async getOverallProgress() {
      const objectiveKeys = Object.keys(manager.objectives)

      if (objectiveKeys.length === 0) {
        return 0
      }

      let totalProgress = 0

      for (const key of objectiveKeys) {
        totalProgress += await manager.getObjectiveProgress(key)
      }

      return totalProgress / objectiveKeys.length
    },

    async updateKeyResultProgress(objectiveKey, keyResultIndex, progress) {
      if (!manager.objectives[objectiveKey]) {
        throw new Error(`Objective with key "${objectiveKey}" not found`)
      }

      const objective = manager.objectives[objectiveKey]

      if (!objective.keyResults || keyResultIndex >= objective.keyResults.length) {
        throw new Error(`Key result at index ${keyResultIndex} not found for objective "${objectiveKey}"`)
      }

      const keyResult = objective.keyResults[keyResultIndex]

      if (typeof keyResult === 'string') {
        objective.keyResults[keyResultIndex] = {
          description: keyResult,
          progress: progress,
        }
      } else {
        keyResult.progress = progress
      }
    },

    getAgentsForObjective(objectiveKey) {
      return manager.agents
    },
  }

  return manager
}
