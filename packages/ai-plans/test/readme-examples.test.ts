import 'dotenv/config'
import { describe, it, expect, vi } from 'vitest'
import { Plan, generateAIPlan } from '../src'
import { AI_TEST_TIMEOUT } from './utils/test-helpers'

vi.mock('ai-providers', () => ({
  languageModel: vi.fn(() => ({
    doGenerate: vi.fn(async ({ prompt }) => {
      const mockPlanData = {
        name: 'Customer Satisfaction Improvement Plan',
        description: 'A strategic plan to improve customer satisfaction and retention',
        goal: {
          objective: 'Improve customer satisfaction and retention',
          keyResults: ['Achieve 95% customer satisfaction score', { description: 'Increase retention rate to 90%', target: 90, currentValue: 75, unit: '%' }],
        },
        steps: [{ name: 'Analyze current metrics', description: 'Review existing satisfaction data', status: 'not_started' }],
      }

      return { text: JSON.stringify(mockPlanData) }
    }),
  })),
}))

describe('README Examples', () => {
  it('should work with basic Plan example from README', () => {
    const myPlan = Plan({
      name: 'Increase Customer Engagement',
      description: 'A strategic plan to improve customer engagement metrics',
      goal: {
        objective: 'Create delighted customers who achieve their goals',
        keyResults: [
          'Achieve 95% customer satisfaction score by Q4',
          'Reduce average support resolution time by 30%',
          {
            description: 'Increase customer retention rate to 85%',
            target: 85,
            currentValue: 72,
            unit: '%',
          },
        ],
      },
      steps: [
        {
          name: 'Research user needs',
          description: 'Conduct user interviews and surveys',
          status: 'not_started',
        },
        {
          name: 'Develop engagement strategy',
          description: 'Create strategy based on research findings',
          status: 'not_started',
        },
      ],
    })

    expect(myPlan.name).toBe('Increase Customer Engagement')
    expect(myPlan.goals[0].keyResults).toHaveLength(3)
    expect(myPlan.steps).toHaveLength(2)
  })

  it(
    'should work with AI plan generation',
    async () => {
      const plan = await generateAIPlan('Improve customer satisfaction and retention')

      expect(plan.name).toBeDefined()
      expect(plan.goals[0].keyResults.length).toBeGreaterThan(0)
      expect(typeof plan.save).toBe('function')
    },
    AI_TEST_TIMEOUT
  )
})
