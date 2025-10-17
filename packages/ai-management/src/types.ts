import { Agent, AgentConfig } from '../../../packages/autonomous-agents/src'
import { Objective, Plan } from '../../../packages/ai-business/src'

/**
 * Configuration for the Manager
 */
export interface ManagerConfig {
  /**
   * Name of the manager
   */
  name: string

  /**
   * Optional description of the manager
   */
  description?: string

  /**
   * Objectives to be managed
   */
  objectives: Record<string, Objective>

  /**
   * Optional initial plans
   */
  initialPlans?: Plan[]

  /**
   * Optional agent configurations
   */
  agents?: Record<string, AgentConfig>
}

/**
 * Agent instance with autonomous capabilities
 */
export type AutonomousAgent = ReturnType<typeof Agent>

/**
 * Manager instance returned by the Manager function
 */
export interface ManagerInstance {
  /**
   * Unique identifier for the manager
   */
  id: string

  /**
   * Objectives being managed
   */
  objectives: Record<string, Objective>

  /**
   * Plans created by the manager
   */
  plans: Plan[]

  /**
   * Agents managed by the manager
   */
  agents: Record<string, AutonomousAgent>

  /**
   * Update an objective
   * @param key The key of the objective to update
   * @param objective The updated objective
   */
  updateObjective(key: string, objective: Objective): Promise<void>

  /**
   * Create a new plan
   * @param plan The plan data without an ID
   * @returns The created plan with an ID
   */
  createPlan(plan: Omit<Plan, 'id' | 'createdAt' | 'updatedAt'>): Promise<Plan>

  /**
   * Assign a task to an agent
   * @param agentId The ID of the agent to assign the task to
   * @param task The task to assign
   * @returns The result of the task execution
   */
  assignTask(agentId: string, task: any): Promise<any>

  /**
   * Get the progress of an objective
   * @param key The key of the objective
   * @returns The progress as a number between 0 and 1
   */
  getObjectiveProgress(key: string): Promise<number>

  /**
   * Get the overall progress of all objectives
   * @returns The overall progress as a number between 0 and 1
   */
  getOverallProgress(): Promise<number>

  /**
   * Update the progress of a key result for an objective
   * @param objectiveKey The key of the objective
   * @param keyResultIndex The index of the key result
   * @param progress The progress value
   */
  updateKeyResultProgress(objectiveKey: string, keyResultIndex: number, progress: number): Promise<void>

  /**
   * Get all agents assigned to a specific objective
   * @param objectiveKey The key of the objective
   * @returns A record of agent IDs to agent instances
   */
  getAgentsForObjective(objectiveKey: string): Record<string, AutonomousAgent>
}
