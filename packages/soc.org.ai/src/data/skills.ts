import type { Skill } from '../types/reference.js'

/**
 * O*NET Skills reference data
 */
export const skills: Record<string, Skill> = {}

export function getSkill(elementId: string): Skill | undefined {
  return skills[elementId]
}

export function getAllSkills(): Skill[] {
  return Object.values(skills)
}
