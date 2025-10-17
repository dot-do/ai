import type { Knowledge } from '../types/reference.js'

/**
 * O*NET Knowledge reference data
 */
export const knowledge: Record<string, Knowledge> = {}

export function getKnowledge(elementId: string): Knowledge | undefined {
  return knowledge[elementId]
}

export function getAllKnowledge(): Knowledge[] {
  return Object.values(knowledge)
}
