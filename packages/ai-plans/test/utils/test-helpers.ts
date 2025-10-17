import { z } from 'zod'

export const mockPlanInput = {
  name: 'Test Plan',
  description: 'A test plan for validation',
  goal: {
    objective: 'Achieve test objectives',
    keyResults: ['Complete 100% of test cases', { description: 'Achieve 95% code coverage', target: 95, currentValue: 80, unit: '%' }],
  },
  steps: [
    { name: 'Setup tests', description: 'Create test infrastructure', status: 'not_started' as const },
    { name: 'Write tests', description: 'Implement test cases', status: 'not_started' as const },
  ],
}

export const mockKeyResult = {
  id: 'kr-1',
  description: 'Test key result',
  target: 100,
  currentValue: 50,
  unit: '%',
}

export const AI_TEST_TIMEOUT = 30000

export const getTestObjective = (type: string) => {
  switch (type) {
    case 'simple':
      return 'Improve customer satisfaction'
    case 'complex':
      return 'Launch a new mobile app that increases user engagement by 40% and generates $100k monthly revenue within 6 months'
    default:
      return 'Create a basic business plan'
  }
}
