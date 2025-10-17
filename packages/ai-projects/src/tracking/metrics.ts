import { ProgressUpdate, ProjectStatus, ObjectiveStatus, KeyResultStatus, Objective, KeyResult } from '../types'

const projectMetrics: Record<
  string,
  {
    objectives: Record<string, Objective>
    tasks: any[]
    lastUpdated: Date
  }
> = {}

/**
 * Updates the progress of a key result within an objective
 * @param update The progress update information
 * @returns A promise that resolves when the update is complete
 */
export async function updateProgress(update: ProgressUpdate): Promise<void> {
  try {
    const { projectId, objectiveKey, keyResultIndex, progress } = update

    if (!projectMetrics[projectId]) {
      throw new Error(`Project with ID ${projectId} not found`)
    }

    if (!projectMetrics[projectId].objectives[objectiveKey]) {
      throw new Error(`Objective with key ${objectiveKey} not found in project ${projectId}`)
    }

    const objective = projectMetrics[projectId].objectives[objectiveKey]
    if (!objective.keyResults || keyResultIndex >= objective.keyResults.length) {
      throw new Error(`Key result at index ${keyResultIndex} not found in objective ${objectiveKey}`)
    }

    const keyResult = objective.keyResults[keyResultIndex]

    const newValue = keyResult.target * progress

    keyResult.current = newValue

    projectMetrics[projectId].lastUpdated = new Date()

    console.log(`[Metrics] Updated progress for ${objectiveKey}.keyResults[${keyResultIndex}] to ${progress * 100}%`)
  } catch (error) {
    console.error('Error updating progress:', error)
    throw error
  }
}

/**
 * Gets the current status of a project
 * @param projectId The ID of the project
 * @returns A promise that resolves with the project status
 */
export async function getProjectStatus(projectId: string): Promise<ProjectStatus> {
  try {
    if (!projectMetrics[projectId]) {
      throw new Error(`Project with ID ${projectId} not found`)
    }

    const projectData = projectMetrics[projectId]

    const objectives: Record<string, ObjectiveStatus> = {}
    let overallProgress = 0
    let objectiveCount = 0

    for (const [key, objective] of Object.entries(projectData.objectives)) {
      const keyResults: KeyResultStatus[] = objective.keyResults.map((kr) => {
        const progress = kr.target > 0 ? kr.current / kr.target : 0
        return {
          name: kr.name,
          description: kr.description,
          target: kr.target,
          current: kr.current,
          unit: kr.unit,
          progress,
        }
      })

      const objectiveProgress = keyResults.reduce((sum, kr) => sum + kr.progress, 0) / keyResults.length

      objectives[key] = {
        name: objective.name,
        description: objective.description,
        keyResults,
        progress: objectiveProgress,
      }

      overallProgress += objectiveProgress
      objectiveCount++
    }

    const progress = objectiveCount > 0 ? overallProgress / objectiveCount : 0

    return {
      name: projectId, // In a real implementation, we would store the project name
      description: '', // In a real implementation, we would store the project description
      objectives,
      tasks: projectData.tasks,
      progress,
    }
  } catch (error) {
    console.error('Error getting project status:', error)
    throw error
  }
}

/**
 * Initializes metrics tracking for a project
 * @param projectId The ID of the project
 * @param objectives The objectives for the project
 * @returns A promise that resolves when initialization is complete
 */
export async function initializeProjectMetrics(projectId: string, name: string, description: string, objectives: Record<string, Objective>): Promise<void> {
  try {
    projectMetrics[projectId] = {
      objectives,
      tasks: [],
      lastUpdated: new Date(),
    }

    console.log(`[Metrics] Initialized metrics for project ${projectId} with ${Object.keys(objectives).length} objectives`)
  } catch (error) {
    console.error('Error initializing project metrics:', error)
    throw error
  }
}

/**
 * Adds a task to the project metrics
 * @param projectId The ID of the project
 * @param task The task to add
 * @returns A promise that resolves when the task is added
 */
export async function addTaskToMetrics(projectId: string, task: any): Promise<void> {
  try {
    if (!projectMetrics[projectId]) {
      throw new Error(`Project with ID ${projectId} not found`)
    }

    projectMetrics[projectId].tasks.push(task)

    projectMetrics[projectId].lastUpdated = new Date()

    console.log(`[Metrics] Added task ${task.id} to project ${projectId}`)
  } catch (error) {
    console.error('Error adding task to metrics:', error)
    throw error
  }
}

/**
 * Updates a task in the project metrics
 * @param projectId The ID of the project
 * @param taskId The ID of the task to update
 * @param updates The updates to apply to the task
 * @returns A promise that resolves when the task is updated
 */
export async function updateTaskInMetrics(projectId: string, taskId: string, updates: any): Promise<void> {
  try {
    if (!projectMetrics[projectId]) {
      throw new Error(`Project with ID ${projectId} not found`)
    }

    const taskIndex = projectMetrics[projectId].tasks.findIndex((task) => task.id === taskId)

    if (taskIndex === -1) {
      throw new Error(`Task with ID ${taskId} not found in project ${projectId}`)
    }

    projectMetrics[projectId].tasks[taskIndex] = {
      ...projectMetrics[projectId].tasks[taskIndex],
      ...updates,
    }

    projectMetrics[projectId].lastUpdated = new Date()

    console.log(`[Metrics] Updated task ${taskId} in project ${projectId}`)
  } catch (error) {
    console.error('Error updating task in metrics:', error)
    throw error
  }
}

/**
 * Gets metrics for a specific objective
 * @param projectId The ID of the project
 * @param objectiveKey The key of the objective
 * @returns A promise that resolves with the objective status
 */
export async function getObjectiveMetrics(projectId: string, objectiveKey: string): Promise<ObjectiveStatus> {
  try {
    if (!projectMetrics[projectId]) {
      throw new Error(`Project with ID ${projectId} not found`)
    }

    if (!projectMetrics[projectId].objectives[objectiveKey]) {
      throw new Error(`Objective with key ${objectiveKey} not found in project ${projectId}`)
    }

    const objective = projectMetrics[projectId].objectives[objectiveKey]

    const keyResults: KeyResultStatus[] = objective.keyResults.map((kr) => {
      const progress = kr.target > 0 ? kr.current / kr.target : 0
      return {
        name: kr.name,
        description: kr.description,
        target: kr.target,
        current: kr.current,
        unit: kr.unit,
        progress,
      }
    })

    const progress = keyResults.reduce((sum, kr) => sum + kr.progress, 0) / keyResults.length

    return {
      name: objective.name,
      description: objective.description,
      keyResults,
      progress,
    }
  } catch (error) {
    console.error('Error getting objective metrics:', error)
    throw error
  }
}

/**
 * Exports metrics data for a project
 * @param projectId The ID of the project
 * @returns A promise that resolves with the metrics data
 */
export async function exportProjectMetrics(projectId: string): Promise<any> {
  try {
    if (!projectMetrics[projectId]) {
      throw new Error(`Project with ID ${projectId} not found`)
    }

    const status = await getProjectStatus(projectId)

    const exportData = {
      projectId,
      name: status.name,
      description: status.description,
      progress: status.progress,
      objectives: status.objectives,
      tasks: status.tasks,
      exportedAt: new Date(),
    }

    return exportData
  } catch (error) {
    console.error('Error exporting project metrics:', error)
    throw error
  }
}
