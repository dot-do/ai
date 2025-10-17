import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Project } from '../../src/project'
import { ProjectConfig, TaskConfig } from '../../src/types'

describe('Project Management', () => {
  let projectConfig: ProjectConfig

  beforeEach(() => {
    projectConfig = {
      name: 'Test Project',
      description: 'This is a test project',
      workstreams: [
        {
          name: 'Development',
          assigneeType: 'human',
          roles: ['developer'],
        },
        {
          name: 'Testing',
          assigneeType: 'ai',
          agentTypes: ['tester'],
        },
        {
          name: 'Design',
          assigneeType: 'human',
          roles: ['designer'],
        },
        {
          name: 'Mixed',
          assigneeType: 'mixed',
          roles: ['developer'],
          agentTypes: ['assistant'],
        },
      ],
      objectives: {
        'test-objective': {
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
        },
      },
    }
  })

  describe('Project initialization', () => {
    it('should create a project management instance', () => {
      const projectManagement = Project(projectConfig)

      expect(projectManagement).toBeDefined()
      expect(typeof projectManagement.createTask).toBe('function')
      expect(typeof projectManagement.configureApprovals).toBe('function')
      expect(typeof projectManagement.requestApproval).toBe('function')
      expect(typeof projectManagement.updateProgress).toBe('function')
      expect(typeof projectManagement.getStatus).toBe('function')
    })
  })

  describe('Task creation', () => {
    it('should create a task with the provided configuration', async () => {
      const projectManagement = Project(projectConfig)

      const taskConfig: TaskConfig = {
        title: 'Test Task',
        description: 'This is a test task',
        workstream: 'Development',
      }

      const task = await projectManagement.createTask(taskConfig)

      expect(task).toBeDefined()
      expect(task.id).toBeDefined()
      expect(task.config).toEqual({
        ...taskConfig,
        assignTo: 'human',
      })
      expect(task.status).toBe('pending')
    })

    it('should throw an error when workstream is not found', async () => {
      const projectManagement = Project(projectConfig)

      const taskConfig: TaskConfig = {
        title: 'Invalid Task',
        description: 'This is a task with an invalid workstream',
        workstream: 'InvalidWorkstream',
      }

      await expect(projectManagement.createTask(taskConfig)).rejects.toThrow('Workstream "InvalidWorkstream" not found')
    })

    it('should assign to an agent for AI workstreams', async () => {
      const projectManagement = Project(projectConfig)

      const taskConfig: TaskConfig = {
        title: 'AI Task',
        description: 'This is a task for an AI agent',
        workstream: 'Testing',
      }

      const task = await projectManagement.createTask(taskConfig)

      expect(task).toBeDefined()
      expect(task.assignee).toBeDefined()
      expect(task.assignee).toContain('agent-')
    })

    it('should assign to a human for human workstreams', async () => {
      const projectManagement = Project(projectConfig)

      const taskConfig: TaskConfig = {
        title: 'Human Task',
        description: 'This is a task for a human',
        workstream: 'Design',
      }

      const task = await projectManagement.createTask(taskConfig)

      expect(task).toBeDefined()
      expect(task.assignee).toBe('designer-user')
    })

    it('should respect explicit assignTo over workstream default', async () => {
      const projectManagement = Project(projectConfig)

      const taskConfig: TaskConfig = {
        title: 'Explicit Assignment Task',
        description: 'This is a task with explicit assignment',
        workstream: 'Testing',
        assignTo: 'human',
      }

      const task = await projectManagement.createTask(taskConfig)

      expect(task).toBeDefined()
      expect(task.assignee).toBeDefined()
      expect(task.assignee).not.toContain('agent-')
    })
  })

  describe('Approval configuration', () => {
    it('should configure approval methods', async () => {
      const projectManagement = Project(projectConfig)

      projectManagement.configureApprovals({
        methods: ['slack', 'github'],
        slackChannel: 'test-channel',
        githubRepo: 'test/repo',
        defaultApprovers: ['user1', 'user2'],
      })

      expect(projectManagement).toBeDefined()
    })
  })
})
