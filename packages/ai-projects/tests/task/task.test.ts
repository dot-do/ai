import { describe, it, expect } from 'vitest'
import { createTask, updateTaskStatus, setTaskResult, assignTask } from '../../src/task'
import { TaskConfig } from '../../src/types'

describe('Task Management', () => {
  describe('createTask', () => {
    it('should create a task with the provided configuration', async () => {
      const config: TaskConfig = {
        title: 'Test Task',
        description: 'This is a test task',
        workstream: 'Development',
        assignTo: 'human',
      }

      const task = await createTask(config)

      expect(task).toBeDefined()
      expect(task.id).toBeDefined()
      expect(task.config).toEqual(config)
      expect(task.status).toBe('pending')
      expect(task.createdAt).toBeInstanceOf(Date)
      expect(task.updatedAt).toBeInstanceOf(Date)
      expect(task.assignee).toBe('developer-user')
    })

    it('should assign to an agent when assignTo is agent', async () => {
      const config: TaskConfig = {
        title: 'Agent Task',
        description: 'This is a task for an agent',
        workstream: 'Testing',
        assignTo: 'agent',
      }

      const task = await createTask(config)

      expect(task).toBeDefined()
      expect(task.assignee).toBeDefined()
      expect(task.assignee).toContain('agent-')
    })

    it('should assign to a designer when workstream is Design', async () => {
      const config: TaskConfig = {
        title: 'Design Task',
        description: 'This is a design task',
        workstream: 'Design',
        assignTo: 'human',
      }

      const task = await createTask(config)

      expect(task).toBeDefined()
      expect(task.assignee).toBe('designer-user')
    })

    it('should assign to default user for other workstreams', async () => {
      const config: TaskConfig = {
        title: 'Other Task',
        description: 'This is another task',
        workstream: 'Other',
        assignTo: 'human',
      }

      const task = await createTask(config)

      expect(task).toBeDefined()
      expect(task.assignee).toBe('default-user')
    })
  })

  describe('updateTaskStatus', () => {
    it('should update the task status', async () => {
      const config: TaskConfig = {
        title: 'Status Test Task',
        description: 'This is a test task for status updates',
        workstream: 'Development',
      }

      const task = await createTask(config)
      const updatedTask = updateTaskStatus(task, 'in-progress')

      expect(updatedTask).toBeDefined()
      expect(updatedTask.status).toBe('in-progress')
      expect(updatedTask.updatedAt).toBeInstanceOf(Date)
      expect(updatedTask.updatedAt.getTime()).toBeGreaterThanOrEqual(task.updatedAt.getTime())
    })

    it('should set completedAt when status is completed', async () => {
      const config: TaskConfig = {
        title: 'Completion Test Task',
        description: 'This is a test task for completion',
        workstream: 'Development',
      }

      const task = await createTask(config)
      const updatedTask = updateTaskStatus(task, 'completed')

      expect(updatedTask).toBeDefined()
      expect(updatedTask.status).toBe('completed')
      expect(updatedTask.completedAt).toBeDefined()
      expect(updatedTask.completedAt).toBeInstanceOf(Date)
    })
  })

  describe('setTaskResult', () => {
    it('should set the task result', async () => {
      const config: TaskConfig = {
        title: 'Result Test Task',
        description: 'This is a test task for setting results',
        workstream: 'Development',
      }

      const task = await createTask(config)
      const result = { data: 'Test result data', success: true }
      const updatedTask = setTaskResult(task, result)

      expect(updatedTask).toBeDefined()
      expect(updatedTask.result).toEqual(result)
      expect(updatedTask.updatedAt).toBeInstanceOf(Date)
      expect(updatedTask.updatedAt.getTime()).toBeGreaterThanOrEqual(task.updatedAt.getTime())
    })
  })

  describe('assignTask', () => {
    it('should assign the task to a specific assignee', async () => {
      const config: TaskConfig = {
        title: 'Assignment Test Task',
        description: 'This is a test task for assignment',
        workstream: 'Development',
      }

      const task = await createTask(config)
      const assignee = 'test-user-123'
      const updatedTask = assignTask(task, assignee)

      expect(updatedTask).toBeDefined()
      expect(updatedTask.assignee).toBe(assignee)
      expect(updatedTask.updatedAt).toBeInstanceOf(Date)
      expect(updatedTask.updatedAt.getTime()).toBeGreaterThanOrEqual(task.updatedAt.getTime())
    })
  })
})
