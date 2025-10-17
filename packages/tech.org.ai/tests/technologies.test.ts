/**
 * Tests for tech.org.ai
 *
 * NOTE: These tests will fail until the import script has been run
 * Run: pnpm import (from tech.org.ai directory)
 */

import { describe, it, expect } from 'vitest'
import type { Technology, TechnologyCategory } from '../src/types/technology.js'

describe('tech.org.ai types', () => {
  it('should define Technology interface', () => {
    const technology: Technology = {
      $type: 'Technology',
      $id: 'tech.org.ai:test',
      commodityCode: 'test-001',
      commodityTitle: 'Test Technology',
      category: 'Programming Language',
      hotTechnology: true,
      examples: ['Example 1', 'Example 2'],
    }

    expect(technology).toBeDefined()
    expect(technology.$type).toBe('Technology')
    expect(technology.commodityCode).toBe('test-001')
    expect(technology.hotTechnology).toBe(true)
  })

  it('should define TechnologyCategory enum values', () => {
    const categories: TechnologyCategory[] = [
      'Programming Language',
      'Framework',
      'Library',
      'Database',
      'Operating System',
      'Development Tool',
      'Business Application',
      'Cloud Platform',
      'Web Server',
      'Other',
    ]

    expect(categories).toHaveLength(10)
  })
})

// Data tests (will pass after import script runs)
describe('tech.org.ai data (requires import)', () => {
  it.skip('should export technologies data', async () => {
    const { technologies, getAllTechnologies } = await import('../src/data/technologies.js')

    expect(technologies).toBeDefined()
    expect(typeof technologies).toBe('object')

    const allTech = getAllTechnologies()
    expect(Array.isArray(allTech)).toBe(true)
    expect(allTech.length).toBeGreaterThan(0)
  })

  it.skip('should have technologies with required fields', async () => {
    const { getAllTechnologies } = await import('../src/data/technologies.js')
    const technologies = getAllTechnologies()

    expect(technologies.length).toBeGreaterThan(0)

    technologies.forEach((tech: Technology) => {
      expect(tech.$type).toBe('Technology')
      expect(tech.commodityCode).toBeDefined()
      expect(tech.commodityTitle).toBeDefined()
      expect(tech.category).toBeDefined()
    })
  })

  it.skip('should filter hot technologies', async () => {
    const { getHotTechnologies } = await import('../src/data/technologies.js')
    const hotTech = getHotTechnologies()

    expect(Array.isArray(hotTech)).toBe(true)
    hotTech.forEach((tech: Technology) => {
      expect(tech.hotTechnology).toBe(true)
    })
  })

  it.skip('should filter by category', async () => {
    const { getTechnologiesByCategory } = await import('../src/data/technologies.js')
    const languages = getTechnologiesByCategory('Programming Language')

    expect(Array.isArray(languages)).toBe(true)
    languages.forEach((tech: Technology) => {
      expect(tech.category).toBe('Programming Language')
    })
  })

  it.skip('should search technologies by name', async () => {
    const { searchTechnologies } = await import('../src/data/technologies.js')
    const results = searchTechnologies('python')

    expect(Array.isArray(results)).toBe(true)
    results.forEach((tech: Technology) => {
      expect(tech.commodityTitle.toLowerCase()).toContain('python')
    })
  })
})
