import { TaskConfig, Task, TaskStatus } from './types'
import crypto from 'crypto'

/**
 * Creates a new task with the provided configuration
 * @param config The task configuration
 * @returns A new task object
 */
export async function createTask(config: TaskConfig): Promise<Task> {
  const id = crypto.randomUUID()

  const now = new Date()

  const task: Task = {
    id,
    config,
    status: 'pending',
    createdAt: now,
    updatedAt: now,
  }

  if (config.assignTo === 'agent') {
    task.assignee = `agent-${crypto.randomUUID().slice(0, 8)}`
  } else if (config.assignTo === 'human') {
    if (config.workstream && config.workstream.includes('Design')) {
      task.assignee = 'designer-user'
    } else if (config.workstream && config.workstream.includes('Development')) {
      task.assignee = 'developer-user'
    } else {
      task.assignee = 'default-user'
    }
  }

  return task
}

/**
 * Updates the status of a task
 * @param task The task to update
 * @param status The new status
 * @returns The updated task
 */
export function updateTaskStatus(task: Task, status: TaskStatus): Task {
  return {
    ...task,
    status,
    updatedAt: new Date(),
    ...(status === 'completed' ? { completedAt: new Date() } : {}),
  }
}

/**
 * Sets the result of a task
 * @param task The task to update
 * @param result The result of the task
 * @returns The updated task
 */
export function setTaskResult(task: Task, result: any): Task {
  return {
    ...task,
    result,
    updatedAt: new Date(),
  }
}

/**
 * Assigns a task to a specific assignee
 * @param task The task to assign
 * @param assignee The assignee (user ID or agent ID)
 * @returns The updated task
 */
export function assignTask(task: Task, assignee: string): Task {
  return {
    ...task,
    assignee,
    updatedAt: new Date(),
  }
}
