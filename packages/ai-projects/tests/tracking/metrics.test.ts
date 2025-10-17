import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  updateProgress,
  getProjectStatus,
  initializeProjectMetrics,
  addTaskToMetrics,
  updateTaskInMetrics,
  getObjectiveMetrics,
  exportProjectMetrics,
} from '../../src/tracking/metrics'
import { Objective, ProgressUpdate } from '../../src/types'

describe('Project Metrics Tracking', () => {
  const projectId = 'test-project-id'
  const objectiveKey = 'test-objective'

  const testObjective: Objective = {
    name: 'Test Objective',
    description: 'This is a test objective',
    keyResults: [
      {
        name: 'Test Key Result',
        description: 'This is a test key result',
        target: 100,
        current: 0,
        unit: 'percent',
      },
    ],
  }

  const objectives: Record<string, Objective> = {
    [objectiveKey]: testObjective,
  }

  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(console, 'warn').mockImplementation(() => {})

    return initializeProjectMetrics(projectId, 'Test Project', 'This is a test project', objectives)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('initializeProjectMetrics', () => {
    it('should initialize project metrics', async () => {
      const newProjectId = 'new-project-id'

      await initializeProjectMetrics(newProjectId, 'New Project', 'This is a new project', objectives)

      const status = await getProjectStatus(newProjectId)

      expect(status).toBeDefined()
      expect(status.objectives).toBeDefined()
      expect(status.objectives[objectiveKey]).toBeDefined()
      expect(status.objectives[objectiveKey].name).toBe(testObjective.name)
    })
  })

  describe('updateProgress', () => {
    it('should update the progress of a key result', async () => {
      const update: ProgressUpdate = {
        projectId,
        objectiveKey,
        keyResultIndex: 0,
        progress: 0.5,
      }

      await updateProgress(update)

      const status = await getProjectStatus(projectId)

      expect(status.objectives[objectiveKey].keyResults[0].current).toBe(50) // 50% of target 100
      expect(status.objectives[objectiveKey].keyResults[0].progress).toBe(0.5)
    })

    it('should throw an error when project is not found', async () => {
      const update: ProgressUpdate = {
        projectId: 'non-existent-project',
        objectiveKey,
        keyResultIndex: 0,
        progress: 0.5,
      }

      await expect(updateProgress(update)).rejects.toThrow('Project with ID non-existent-project not found')
    })

    it('should throw an error when objective is not found', async () => {
      const update: ProgressUpdate = {
        projectId,
        objectiveKey: 'non-existent-objective',
        keyResultIndex: 0,
        progress: 0.5,
      }

      await expect(updateProgress(update)).rejects.toThrow('Objective with key non-existent-objective not found')
    })

    it('should throw an error when key result index is out of bounds', async () => {
      const update: ProgressUpdate = {
        projectId,
        objectiveKey,
        keyResultIndex: 10, // Out of bounds
        progress: 0.5,
      }

      await expect(updateProgress(update)).rejects.toThrow('Key result at index 10 not found')
    })
  })

  describe('getProjectStatus', () => {
    it('should get the status of a project', async () => {
      const status = await getProjectStatus(projectId)

      expect(status).toBeDefined()
      expect(status.objectives).toBeDefined()
      expect(status.objectives[objectiveKey]).toBeDefined()
      expect(status.objectives[objectiveKey].keyResults).toBeInstanceOf(Array)
      expect(status.objectives[objectiveKey].keyResults.length).toBe(1)
      expect(status.progress).toBeDefined()
      expect(status.tasks).toBeInstanceOf(Array)
    })

    it('should throw an error when project is not found', async () => {
      await expect(getProjectStatus('non-existent-project')).rejects.toThrow('Project with ID non-existent-project not found')
    })

    it('should calculate progress correctly', async () => {
      await updateProgress({
        projectId,
        objectiveKey,
        keyResultIndex: 0,
        progress: 0.5,
      })

      const status = await getProjectStatus(projectId)

      expect(status.objectives[objectiveKey].progress).toBe(0.5)
      expect(status.progress).toBe(0.5)
    })
  })

  describe('addTaskToMetrics', () => {
    it('should add a task to project metrics', async () => {
      const task = {
        id: 'task-123',
        title: 'Test Task',
        status: 'pending',
      }

      await addTaskToMetrics(projectId, task)

      const status = await getProjectStatus(projectId)

      expect(status.tasks).toContainEqual(task)
    })

    it('should throw an error when project is not found', async () => {
      const task = {
        id: 'task-123',
        title: 'Test Task',
        status: 'pending',
      }

      await expect(addTaskToMetrics('non-existent-project', task)).rejects.toThrow('Project with ID non-existent-project not found')
    })
  })

  describe('updateTaskInMetrics', () => {
    it('should update a task in project metrics', async () => {
      const task = {
        id: 'task-123',
        title: 'Test Task',
        status: 'pending',
      }

      await addTaskToMetrics(projectId, task)

      const updates = {
        status: 'completed',
        completedAt: new Date(),
      }

      await updateTaskInMetrics(projectId, task.id, updates)

      const status = await getProjectStatus(projectId)
      const updatedTask = status.tasks.find((t) => t.id === task.id)

      expect(updatedTask).toBeDefined()
      expect(updatedTask?.status).toBe('completed')
      expect(updatedTask?.completedAt).toBeInstanceOf(Date)
    })

    it('should throw an error when project is not found', async () => {
      await expect(updateTaskInMetrics('non-existent-project', 'task-123', {})).rejects.toThrow('Project with ID non-existent-project not found')
    })

    it('should throw an error when task is not found', async () => {
      await expect(updateTaskInMetrics(projectId, 'non-existent-task', {})).rejects.toThrow('Task with ID non-existent-task not found')
    })
  })

  describe('getObjectiveMetrics', () => {
    it('should get metrics for a specific objective', async () => {
      const objectiveStatus = await getObjectiveMetrics(projectId, objectiveKey)

      expect(objectiveStatus).toBeDefined()
      expect(objectiveStatus.name).toBe(testObjective.name)
      expect(objectiveStatus.description).toBe(testObjective.description)
      expect(objectiveStatus.keyResults).toBeInstanceOf(Array)
      expect(objectiveStatus.keyResults.length).toBe(1)
      expect(objectiveStatus.progress).toBeDefined()
    })

    it('should throw an error when project is not found', async () => {
      await expect(getObjectiveMetrics('non-existent-project', objectiveKey)).rejects.toThrow('Project with ID non-existent-project not found')
    })

    it('should throw an error when objective is not found', async () => {
      await expect(getObjectiveMetrics(projectId, 'non-existent-objective')).rejects.toThrow('Objective with key non-existent-objective not found')
    })
  })

  describe('exportProjectMetrics', () => {
    it('should export metrics data for a project', async () => {
      const exportData = await exportProjectMetrics(projectId)

      expect(exportData).toBeDefined()
      expect(exportData.projectId).toBe(projectId)
      expect(exportData.objectives).toBeDefined()
      expect(exportData.tasks).toBeInstanceOf(Array)
      expect(exportData.progress).toBeDefined()
      expect(exportData.exportedAt).toBeInstanceOf(Date)
    })

    it('should throw an error when project is not found', async () => {
      await expect(exportProjectMetrics('non-existent-project')).rejects.toThrow('Project with ID non-existent-project not found')
    })
  })
})
