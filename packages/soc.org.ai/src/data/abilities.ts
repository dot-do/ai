import type { Ability } from '../types/reference.js'

/**
 * O*NET Abilities reference data
 */
export const abilities: Record<string, Ability> = {}

export function getAbility(elementId: string): Ability | undefined {
  return abilities[elementId]
}

export function getAllAbilities(): Ability[] {
  return Object.values(abilities)
}
