/**
 * Type definitions for Plans
 */

/**
 * Plan interface
 */
export interface Plan {
  id: string
  name: string
  description?: string | null
  status?: ('draft' | 'active' | 'completed' | 'archived') | null
  startDate?: string | null
  endDate?: string | null
  owner?: (string | null) | User
  goals?: (string | Goal)[] | null
  tags?: (string | Tag)[] | null
  priority?: ('low' | 'medium' | 'high' | 'critical') | null
  steps?: PlanStep[] | null
  updatedAt: string
  createdAt: string
}

/**
 * Plan Step interface
 */
export interface PlanStep {
  name: string
  description?: string | null
  order?: number | null
  duration?: number | null
  assignee?: (string | null) | User
  status?: ('not_started' | 'in_progress' | 'completed' | 'blocked') | null
  id?: string | null
}

/**
 * Goal interface
 */
export interface Goal {
  id?: string
  title: string
  objective: string
  keyResults: KeyResult[]
}

/**
 * Key Result interface
 */
export interface KeyResult {
  id?: string
  description: string
  target?: number
  currentValue?: number
  unit?: string
  value?: number
}

/**
 * User interface
 */
export interface User {
  id: string
  name?: string
  email?: string
}

/**
 * Tag interface
 */
export interface Tag {
  id: string
  name: string
}

/**
 * Plan Input interface
 */
export interface PlanInput {
  name: string
  description?: string
  goal: {
    objective: string
    keyResults: (string | Partial<KeyResult>)[]
  }
  steps?: Partial<PlanStep>[]
  [key: string]: any
}
