#!/usr/bin/env tsx
/**
 * Import O*NET Technology Skills data
 *
 * Fetches Technology Skills dataset from O*NET Center and generates
 * TypeScript data files for tech.org.ai package
 *
 * Data Source: O*NET Database 30.0
 * File: Technology_Skills.txt
 * Columns: O*NET-SOC Code, Commodity Code, Commodity Title, Hot Technology, Example
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import type { Technology, TechnologyCategory } from '../src/types/technology.js'

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// O*NET Database URL
const ONET_BASE = 'https://www.onetcenter.org/dl_files/database/db_30_0_text'
const TECH_SKILLS_URL = `${ONET_BASE}/Technology%20Skills.txt`

/**
 * Fetch with retry logic for network timeouts
 */
async function fetchWithRetry(url: string, maxRetries = 3, delayMs = 1000): Promise<string> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      return await response.text()
    } catch (error) {
      if (attempt === maxRetries) {
        throw error
      }
      console.log(`  ⚠️  Attempt ${attempt} failed, retrying in ${delayMs}ms...`)
      await new Promise((resolve) => setTimeout(resolve, delayMs))
      delayMs *= 2 // Exponential backoff
    }
  }
  throw new Error('Max retries exceeded')
}

/**
 * Parse TSV data into array of objects
 */
function parseTSV(text: string): any[] {
  const lines = text.trim().split('\n')
  const headers = lines[0].split('\t')
  return lines.slice(1).map((line) => {
    const values = line.split('\t')
    return headers.reduce((obj, header, i) => {
      obj[header] = values[i] || ''
      return obj
    }, {} as any)
  })
}

/**
 * Categorize technology based on commodity title
 */
function categorizeTechnology(commodityTitle: string): TechnologyCategory {
  const title = commodityTitle.toLowerCase()

  // Programming languages
  if (
    /\b(python|javascript|typescript|java|c\+\+|c#|ruby|go|rust|php|swift|kotlin)\b/.test(title) ||
    title.includes('programming language') ||
    title.includes('scripting language')
  ) {
    return 'Programming Language'
  }

  // Frameworks
  if (
    /\b(react|angular|vue|django|flask|spring|express|next|nuxt|svelte)\b/.test(title) ||
    title.includes('framework')
  ) {
    return 'Framework'
  }

  // Databases
  if (
    /\b(mysql|postgresql|mongodb|redis|oracle|sql server|sqlite|cassandra|dynamodb)\b/.test(
      title
    ) ||
    title.includes('database') ||
    title.includes('dbms')
  ) {
    return 'Database'
  }

  // Cloud platforms
  if (/\b(aws|azure|gcp|google cloud|amazon web services|heroku|vercel|netlify)\b/.test(title)) {
    return 'Cloud Platform'
  }

  // Operating systems
  if (
    /\b(linux|windows|macos|unix|ubuntu|debian|centos)\b/.test(title) ||
    title.includes('operating system')
  ) {
    return 'Operating System'
  }

  // Development tools
  if (
    /\b(git|docker|kubernetes|jenkins|gitlab|github|vscode|vim|emacs)\b/.test(title) ||
    title.includes('development tool') ||
    title.includes('ide') ||
    title.includes('editor')
  ) {
    return 'Development Tool'
  }

  // Web servers
  if (/\b(apache|nginx|iis|tomcat)\b/.test(title) || title.includes('web server')) {
    return 'Web Server'
  }

  // Business applications
  if (
    /\b(salesforce|sap|oracle|microsoft dynamics|workday|servicenow)\b/.test(title) ||
    title.includes('business application') ||
    title.includes('enterprise software')
  ) {
    return 'Business Application'
  }

  // Libraries
  if (title.includes('library') || title.includes('package')) {
    return 'Library'
  }

  // Default
  return 'Other'
}

/**
 * Main import function
 */
async function importTechnologySkills() {
  console.log('🚀 Importing O*NET Technology Skills data...\n')

  // Fetch Technology Skills data
  console.log('📥 Fetching Technology Skills from O*NET Center...')
  const techSkillsText = await fetchWithRetry(TECH_SKILLS_URL)
  const techSkillsData = parseTSV(techSkillsText)
  console.log(`  ✓ Fetched ${techSkillsData.length} technology skill records\n`)

  // Group by commodity code (deduplicate)
  const technologiesMap = new Map<string, Technology>()

  for (const row of techSkillsData) {
    const commodityCode = row['Commodity Code']
    const commodityTitle = row['Commodity Title']
    const hotTechnology = row['Hot Technology'] === 'Y'
    const example = row['Example']

    if (!technologiesMap.has(commodityCode)) {
      technologiesMap.set(commodityCode, {
        $type: 'Technology',
        $id: `tech.org.ai:${commodityCode}`,
        commodityCode,
        commodityTitle,
        category: categorizeTechnology(commodityTitle),
        hotTechnology,
        examples: example ? [example] : [],
      })
    } else {
      // Add example to existing technology
      const tech = technologiesMap.get(commodityCode)!
      if (example && !tech.examples?.includes(example)) {
        tech.examples = tech.examples || []
        tech.examples.push(example)
      }
    }
  }

  // Convert to record
  const technologies: Record<string, Technology> = {}
  for (const [code, tech] of technologiesMap.entries()) {
    technologies[code] = tech
  }

  console.log(`📊 Deduplicated to ${Object.keys(technologies).length} unique technologies`)

  // Count by category
  const categoryCounts = Object.values(technologies).reduce((acc, tech) => {
    acc[tech.category] = (acc[tech.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  console.log('\n📈 Technologies by category:')
  Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([category, count]) => {
      console.log(`  ${category}: ${count}`)
    })

  // Count hot technologies
  const hotTechCount = Object.values(technologies).filter((t) => t.hotTechnology).length
  console.log(`\n🔥 Hot technologies: ${hotTechCount}\n`)

  // Generate technologies.ts file
  const technologiesContent = `/**
 * Technology data for tech.org.ai
 * Generated from O*NET Database 30.0 - Technology Skills
 */

import type { Technology } from '../types/technology.js'

export const technologies: Record<string, Technology> = ${JSON.stringify(technologies, null, 2)}

/**
 * Get technology by commodity code
 */
export function getTechnology(commodityCode: string): Technology | undefined {
  return technologies[commodityCode]
}

/**
 * Get all technologies
 */
export function getAllTechnologies(): Technology[] {
  return Object.values(technologies)
}

/**
 * Get technologies by category
 */
export function getTechnologiesByCategory(category: string): Technology[] {
  return Object.values(technologies).filter((tech) => tech.category === category)
}

/**
 * Get hot technologies (emerging/in-demand)
 */
export function getHotTechnologies(): Technology[] {
  return Object.values(technologies).filter((tech) => tech.hotTechnology === true)
}

/**
 * Search technologies by name
 */
export function searchTechnologies(query: string): Technology[] {
  const searchTerm = query.toLowerCase()
  return Object.values(technologies).filter((tech) =>
    tech.commodityTitle.toLowerCase().includes(searchTerm)
  )
}
`

  // Write to file
  const dataDir = path.resolve(__dirname, '../src/data')
  fs.mkdirSync(dataDir, { recursive: true })
  fs.writeFileSync(path.join(dataDir, 'technologies.ts'), technologiesContent)

  console.log(`✅ Generated technologies.ts with ${Object.keys(technologies).length} technologies`)
}

// Run import
importTechnologySkills().catch((error) => {
  console.error('❌ Import failed:', error)
  process.exit(1)
})
