import { API } from '../api'
import { PlanInput, KeyResult, Goal, Plan as PlanType } from '../types'

/**
 * Create a plan with goals and key results
 */
export function Plan({ name, description, goal, steps, ...otherProps }: PlanInput) {
  if (!goal || !goal.objective) {
    throw new Error('Plan requires a goal with an objective')
  }
  if (!goal.keyResults || !goal.keyResults.length) {
    throw new Error('Plan requires a goal with key results')
  }

  const planData = {
    id: `temp-${Date.now()}`,
    name,
    description,
    steps,
    ...otherProps,
    goals: [
      {
        title: name,
        objective: goal.objective,
        keyResults: goal.keyResults.map((kr) => (typeof kr === 'string' ? { description: kr, value: 0 } : kr)),
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  return {
    ...planData,

    /**
     * Save the plan to the backend
     */
    async save() {
      const api = new API()
      const savedPlan = await api.create('plans', planData)

      Object.assign(planData, savedPlan)

      return savedPlan
    },

    /**
     * Update the progress of a key result
     */
    async updateProgress(keyResult: string | KeyResult, value: number) {
      const api = new API()
      const keyResultId = typeof keyResult === 'string' ? keyResult : keyResult.id

      if (!keyResultId) {
        throw new Error('Key result ID is required to update progress')
      }

      return api.update('keyResults', keyResultId, { value })
    },

    /**
     * Get the progress of the plan
     */
    async getProgress() {
      const api = new API()
      const plan = (await api.get('plans', planData.id)) as PlanType

      if (!plan || !plan.goals || !plan.goals.length) {
        return { progress: 0, keyResults: [] }
      }

      const keyResults = plan.goals.flatMap((goal: Goal | string) => {
        if (typeof goal === 'string') return []
        return goal.keyResults || []
      })

      const completedKeyResults = keyResults.filter((kr: KeyResult) => kr.value !== undefined && kr.target !== undefined && kr.value >= kr.target)

      const progress = keyResults.length ? (completedKeyResults.length / keyResults.length) * 100 : 0

      return {
        progress,
        keyResults: keyResults.map((kr: KeyResult) => ({
          ...kr,
          progress: kr.target && kr.value !== undefined ? (kr.value / kr.target) * 100 : kr.value || 0,
        })),
      }
    },
  }
}
