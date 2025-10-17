import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  integrateWithAIManagement,
  integrateWithAutonomousAgents,
  integrateWithBusinessAsCode,
  integrateWithAgentsDo,
  integrateWithWorkflowsDo,
  integrateWithFunctionsDo,
  integrateWithTasksDo,
  integrateWithSocialAgent,
} from '../../src/utils/integrations'
import { ProjectConfig, TaskConfig, Task, ApprovalConfig } from '../../src/types'

describe('Integration Utilities', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('integrateWithAIManagement', () => {
    it('should integrate with AI Management package', () => {
      const config: ProjectConfig = {
        name: 'Test Project',
        description: 'This is a test project',
        workstreams: [
          {
            name: 'Development',
            assigneeType: 'human',
            roles: ['developer'],
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

      const manager = integrateWithAIManagement(config)

      expect(manager).toBeDefined()
      expect(manager.objectives).toEqual(config.objectives)
      expect(typeof manager.updateKeyResultProgress).toBe('function')
      expect(typeof manager.getOverallProgress).toBe('function')
      expect(typeof manager.createPlan).toBe('function')
      expect(typeof manager.delegateTask).toBe('function')
    })

    it('should handle errors', () => {
      const consoleSpy = vi.spyOn(console, 'error')

      const invalidConfig = null as unknown as ProjectConfig

      expect(() => integrateWithAIManagement(invalidConfig)).toThrow()
      expect(consoleSpy).toHaveBeenCalled()
    })
  })

  describe('integrateWithAutonomousAgents', () => {
    it('should integrate with Autonomous Agents package', () => {
      const config: TaskConfig = {
        title: 'Test Task',
        description: 'This is a test task',
        workstream: 'Development',
      }

      const agent = integrateWithAutonomousAgents(config)

      expect(agent).toBeDefined()
      expect(agent.id).toContain('agent-')
      expect(agent.name).toContain('Agent for Development')
      expect(typeof agent.executeTask).toBe('function')
      expect(typeof agent.getStatus).toBe('function')
    })
  })

  describe('integrateWithBusinessAsCode', () => {
    it('should integrate with Business as Code package', () => {
      const config: ProjectConfig = {
        name: 'Test Project',
        description: 'This is a test project',
        workstreams: [
          {
            name: 'Development',
            assigneeType: 'human',
            roles: ['developer'],
          },
        ],
      }

      const business = integrateWithBusinessAsCode(config)

      expect(business).toBeDefined()
      expect(business.id).toContain('business-')
      expect(business.name).toBe(config.name)
      expect(business.description).toBe(config.description)
      expect(typeof business.createWorkflow).toBe('function')
      expect(typeof business.executeWorkflow).toBe('function')
    })
  })

  describe('integrateWithAgentsDo', () => {
    it('should integrate with Agents.do package', () => {
      const agentType = 'coder'
      const config = {
        capabilities: ['coding', 'testing'],
        model: 'gpt-4o',
      }

      const agent = integrateWithAgentsDo(agentType, config)

      expect(agent).toBeDefined()
      expect(agent.id).toContain('agent-')
      expect(agent.type).toBe(agentType)
      expect(agent.config).toEqual(config)
      expect(typeof agent.execute).toBe('function')
    })
  })

  describe('integrateWithWorkflowsDo', () => {
    it('should integrate with Workflows.do package', () => {
      const name = 'Test Workflow'
      const steps = [
        { name: 'Step 1', action: 'doSomething' },
        { name: 'Step 2', action: 'doSomethingElse' },
      ]

      const workflow = integrateWithWorkflowsDo(name, steps)

      expect(workflow).toBeDefined()
      expect(workflow.id).toContain('workflow-')
      expect(workflow.name).toBe(name)
      expect(workflow.steps).toEqual(steps)
      expect(typeof workflow.execute).toBe('function')
    })
  })

  describe('integrateWithFunctionsDo', () => {
    it('should integrate with Functions.do package', () => {
      const name = 'Test Function'
      const handler = (a: number, b: number) => a + b

      const func = integrateWithFunctionsDo(name, handler)

      expect(func).toBeDefined()
      expect(func.id).toContain('function-')
      expect(func.name).toBe(name)
      expect(typeof func.execute).toBe('function')
    })

    it('should execute the provided handler function', async () => {
      const name = 'Add Function'
      const handler = vi.fn((a: number, b: number) => a + b)

      const func = integrateWithFunctionsDo(name, handler)

      const result = await func.execute(2, 3)

      expect(handler).toHaveBeenCalledWith(2, 3)
      expect(result).toBe(5)
    })
  })

  describe('integrateWithTasksDo', () => {
    it('should integrate with Tasks.do package', () => {
      const task: Task = {
        id: 'task-123',
        config: {
          title: 'Test Task',
          description: 'This is a test task',
          workstream: 'Development',
        },
        status: 'pending',
        assignee: 'test-user',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const taskInstance = integrateWithTasksDo(task)

      expect(taskInstance).toBeDefined()
      expect(taskInstance.id).toBe(task.id)
      expect(taskInstance.title).toBe(task.config.title)
      expect(taskInstance.description).toBe(task.config.description)
      expect(taskInstance.assignee).toBe(task.assignee)
      expect(taskInstance.status).toBe(task.status)
      expect(typeof taskInstance.execute).toBe('function')
      expect(typeof taskInstance.complete).toBe('function')
    })
  })

  describe('integrateWithSocialAgent', () => {
    it('should integrate with Social Agent for approvals', () => {
      const config: ApprovalConfig = {
        methods: ['slack', 'github'],
        slackChannel: 'test-channel',
        githubRepo: 'test/repo',
        defaultApprovers: ['user1', 'user2'],
      }

      const socialAgent = integrateWithSocialAgent(config)

      expect(socialAgent).toBeDefined()
      expect(socialAgent.id).toContain('social-agent-')
      expect(socialAgent.config).toEqual(config)
      expect(typeof socialAgent.submitToSlack).toBe('function')
      expect(typeof socialAgent.submitToGitHub).toBe('function')
    })
  })
})
