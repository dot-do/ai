import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Manager } from '../src'
import { ManagerConfig } from '../src/types'

vi.mock('../../../packages/autonomous-agents/src', () => ({
  Agent: vi.fn((config) => ({
    config,
    execute: vi.fn(async (input) => ({ result: 'executed', input })),
    do: vi.fn(async (action, params) => ({ action, params })),
  })),
}))

describe('Manager', () => {
  let managerConfig: ManagerConfig

  beforeEach(() => {
    managerConfig = {
      name: 'Test Manager',
      description: 'A test manager for unit tests',
      objectives: {
        'test-objective': {
          description: 'Test objective for unit tests',
          keyResults: [
            'Complete unit tests',
            {
              description: 'Achieve 100% test coverage',
              target: 100,
              currentValue: 0,
              unit: '%',
              progress: 0,
            },
          ],
        },
      },
      agents: {
        'test-agent': {
          name: 'Test Agent',
          url: 'https://test-agent.agents.do',
          role: 'Test Agent',
          objective: 'Execute test tasks',
          keyResults: ['test-completion-rate'],
          integrations: ['test-integration'],
          triggers: ['onTaskAssigned'],
          searches: ['TestData'],
          actions: ['executeTest'],
        },
      },
    }
  })

  it('should create a manager instance with the provided configuration', () => {
    const manager = Manager(managerConfig)

    expect(manager).toBeDefined()
    expect(manager.id).toBeDefined()
    expect(manager.objectives).toEqual(managerConfig.objectives)
    expect(Object.keys(manager.agents)).toEqual(['test-agent'])
    expect(manager.plans).toEqual([])
  })

  it('should update an objective', async () => {
    const manager = Manager(managerConfig)

    const updatedObjective = {
      description: 'Updated test objective',
      keyResults: [
        'Complete unit tests',
        {
          description: 'Achieve 100% test coverage',
          target: 100,
          currentValue: 50,
          unit: '%',
          progress: 0.5,
        },
      ],
    }

    await manager.updateObjective('test-objective', updatedObjective)

    expect(manager.objectives['test-objective']).toEqual(updatedObjective)
  })

  it('should throw an error when updating a non-existent objective', async () => {
    const manager = Manager(managerConfig)

    await expect(
      manager.updateObjective('non-existent', {
        description: 'Non-existent objective',
        keyResults: [],
      })
    ).rejects.toThrow('Objective with key "non-existent" not found')
  })

  it('should create a plan', async () => {
    const manager = Manager(managerConfig)

    const planData = {
      name: 'Test Plan',
      description: 'A test plan',
      status: 'draft' as const,
      steps: [
        {
          id: '1',
          name: 'Step 1',
          description: 'First step',
          order: 1,
          status: 'not_started' as const,
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
      ],
    }

    const plan = await manager.createPlan(planData)

    expect(plan).toBeDefined()
    expect(plan.id).toBeDefined()
    expect(plan.name).toBe(planData.name)
    expect(plan.description).toBe(planData.description)
    expect(plan.status).toBe(planData.status)
    expect(plan.steps).toEqual(planData.steps)
    expect(manager.plans).toContain(plan)
  })

  it('should assign a task to an agent', async () => {
    const manager = Manager(managerConfig)

    const task = {
      action: 'executeTest',
      testName: 'sample-test',
      params: { value: 42 },
    }

    const result = await manager.assignTask('test-agent', task)

    expect(result).toEqual({ result: 'executed', input: task })
  })

  it('should throw an error when assigning a task to a non-existent agent', async () => {
    const manager = Manager(managerConfig)

    await expect(manager.assignTask('non-existent', { action: 'test' })).rejects.toThrow('Agent with ID "non-existent" not found')
  })

  it('should calculate objective progress correctly', async () => {
    const manager = Manager(managerConfig)

    let progress = await manager.getObjectiveProgress('test-objective')
    expect(progress).toBe(0)

    await manager.updateKeyResultProgress('test-objective', 1, 0.5)

    progress = await manager.getObjectiveProgress('test-objective')
    expect(progress).toBe(0.25)

    await manager.updateKeyResultProgress('test-objective', 0, 1)

    progress = await manager.getObjectiveProgress('test-objective')
    expect(progress).toBe(0.75)
  })

  it('should calculate overall progress correctly', async () => {
    const manager = Manager({
      ...managerConfig,
      objectives: {
        ...managerConfig.objectives,
        'second-objective': {
          description: 'Second test objective',
          keyResults: [
            {
              description: 'Key result 1',
              progress: 0.5,
            },
            {
              description: 'Key result 2',
              progress: 0.5,
            },
          ],
        },
      },
    })

    await manager.updateKeyResultProgress('test-objective', 0, 1)
    await manager.updateKeyResultProgress('test-objective', 1, 1)

    const firstProgress = await manager.getObjectiveProgress('test-objective')
    expect(firstProgress).toBe(1)

    const secondProgress = await manager.getObjectiveProgress('second-objective')
    expect(secondProgress).toBe(0.5)

    const overallProgress = await manager.getOverallProgress()
    expect(overallProgress).toBe(0.75)
  })

  it('should get agents for an objective', () => {
    const manager = Manager(managerConfig)

    const agents = manager.getAgentsForObjective('test-objective')

    expect(agents).toEqual(manager.agents)
  })
})
