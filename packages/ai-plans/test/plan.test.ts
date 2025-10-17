import { describe, it, expect, beforeEach, vi } from 'vitest'
import { Plan } from '../src'
import { setupTestEnvironment } from './utils/setupTests'
import { mockPlanInput, mockKeyResult } from './utils/test-helpers'

describe('Plan factory function', () => {
  beforeEach(() => {
    setupTestEnvironment()
  })

  describe('plan creation', () => {
    it('should create a plan with required fields', () => {
      const plan = Plan(mockPlanInput)

      expect(plan).toBeDefined()
      expect(plan.name).toBe(mockPlanInput.name)
      expect(plan.description).toBe(mockPlanInput.description)
      expect(plan.goals).toHaveLength(1)
      expect(plan.goals[0].objective).toBe(mockPlanInput.goal.objective)
      expect(plan.id).toMatch(/^temp-\d+$/)
      expect(plan.createdAt).toBeDefined()
      expect(plan.updatedAt).toBeDefined()
    })

    it('should handle string key results', () => {
      const input = {
        ...mockPlanInput,
        goal: {
          objective: 'Test objective',
          keyResults: ['String key result 1', 'String key result 2'],
        },
      }

      const plan = Plan(input)
      expect(plan.goals[0].keyResults).toHaveLength(2)
      expect(plan.goals[0].keyResults[0].description).toBe('String key result 1')
      expect(plan.goals[0].keyResults[0].value).toBe(0)
    })

    it('should handle object key results', () => {
      const plan = Plan(mockPlanInput)
      const keyResults = plan.goals[0].keyResults

      expect(keyResults[1].description).toBe('Achieve 95% code coverage')
      expect(keyResults[1].target).toBe(95)
      expect(keyResults[1].currentValue).toBe(80)
      expect(keyResults[1].unit).toBe('%')
    })

    it('should throw error for missing goal', () => {
      expect(() => {
        Plan({ name: 'Test', goal: null as any })
      }).toThrow('Plan requires a goal with an objective')
    })

    it('should throw error for missing key results', () => {
      expect(() => {
        Plan({
          name: 'Test',
          goal: { objective: 'Test', keyResults: [] },
        })
      }).toThrow('Plan requires a goal with key results')
    })
  })

  describe('plan methods', () => {
    it('should have save method', () => {
      const plan = Plan(mockPlanInput)
      expect(typeof plan.save).toBe('function')
    })

    it('should have updateProgress method', () => {
      const plan = Plan(mockPlanInput)
      expect(typeof plan.updateProgress).toBe('function')
    })

    it('should have getProgress method', () => {
      const plan = Plan(mockPlanInput)
      expect(typeof plan.getProgress).toBe('function')
    })

    it('should calculate progress correctly', async () => {
      const plan = Plan(mockPlanInput)

      const mockApiResponse = {
        id: plan.id,
        goals: [
          {
            keyResults: [
              { target: 100, value: 100 },
              { target: 95, value: 85 },
            ],
          },
        ],
      }

      const mockGet = vi.fn().mockResolvedValue(mockApiResponse)
      const { API } = await import('../src/api')
      vi.spyOn(API.prototype, 'get').mockImplementation(mockGet)

      const progress = await plan.getProgress()
      expect(progress.progress).toBe(50)
      expect(progress.keyResults).toHaveLength(2)
    })
  })
})
