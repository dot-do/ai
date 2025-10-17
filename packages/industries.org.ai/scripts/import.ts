#!/usr/bin/env tsx
/**
 * Import enhanced industry data for industries.org.ai
 *
 * Enhances NAICS data with:
 * - Digital transformation readiness
 * - AI adoption patterns
 * - Disruption risk assessment
 * - Technology requirements
 * - Regulatory environment
 *
 * Data Sources:
 * - NAICS (base industries)
 * - Platform enrichment (digital, AI, disruption, semantics)
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import type {
  Industry,
  IndustryMaturity,
  DigitalReadiness,
  DisruptionRisk,
} from '../src/types/industry.js'

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Analyze digital readiness based on industry characteristics
 */
function analyzeDigitalReadiness(industryName: string, naicsCode?: string): DigitalReadiness {
  const name = industryName.toLowerCase()

  // Digital Native
  if (
    /\b(software|internet|cloud|data|ai|digital|tech|ecommerce)\b/.test(name) ||
    naicsCode?.startsWith('51') // Information
  ) {
    return 'Digital Native'
  }

  // Very High
  if (
    /\b(fintech|financial services|telecommunications|media)\b/.test(name) ||
    naicsCode?.startsWith('52') || // Finance
    naicsCode?.startsWith('51')  // Information
  ) {
    return 'Very High'
  }

  // High
  if (
    /\b(retail|healthcare|logistics|professional services)\b/.test(name) ||
    naicsCode?.startsWith('54') || // Professional Services
    naicsCode?.startsWith('62')  // Healthcare
  ) {
    return 'High'
  }

  // Medium
  if (
    /\b(manufacturing|education|real estate)\b/.test(name) ||
    naicsCode?.startsWith('31') || // Manufacturing
    naicsCode?.startsWith('61')  // Education
  ) {
    return 'Medium'
  }

  // Low (traditional industries)
  if (
    /\b(agriculture|mining|construction|utilities)\b/.test(name) ||
    naicsCode?.startsWith('11') || // Agriculture
    naicsCode?.startsWith('21') || // Mining
    naicsCode?.startsWith('23')  // Construction
  ) {
    return 'Low'
  }

  return 'Medium' // Default
}

/**
 * Assess disruption risk
 */
function assessDisruptionRisk(
  industryName: string,
  digitalReadiness: DigitalReadiness
): DisruptionRisk {
  const name = industryName.toLowerCase()

  // Critical risk (actively being disrupted)
  if (
    /\b(retail|media|advertising|traditional banking|taxi|hotel)\b/.test(name) ||
    digitalReadiness === 'Low'
  ) {
    return 'Critical'
  }

  // High risk
  if (
    /\b(healthcare|education|transportation|real estate|insurance)\b/.test(name) ||
    digitalReadiness === 'Medium'
  ) {
    return 'High'
  }

  // Medium risk
  if (digitalReadiness === 'High') {
    return 'Medium'
  }

  // Low risk (digital native or already transformed)
  return 'Low'
}

/**
 * Determine industry maturity
 */
function determineMaturity(industryName: string, naicsCode?: string): IndustryMaturity {
  const name = industryName.toLowerCase()

  // Emerging
  if (
    /\b(ai|blockchain|quantum|metaverse|web3|crypto|nanotech)\b/.test(name)
  ) {
    return 'Emerging'
  }

  // Growth
  if (
    /\b(cloud|saas|fintech|healthtech|edtech|renewable|electric vehicle)\b/.test(name)
  ) {
    return 'Growth'
  }

  // Transforming (being disrupted/transformed)
  if (
    /\b(retail|media|automotive|banking|insurance)\b/.test(name)
  ) {
    return 'Transforming'
  }

  // Declining
  if (
    /\b(print|coal|traditional|legacy)\b/.test(name)
  ) {
    return 'Declining'
  }

  return 'Mature' // Default
}

/**
 * Main import function
 */
async function importIndustries() {
  console.log('🚀 Importing enhanced industry data...\n')

  // Starter set of key industries
  const starterIndustries = [
    { id: '51', name: 'Information Technology', naics: '51' },
    { id: '52', name: 'Finance and Insurance', naics: '52' },
    { id: '54', name: 'Professional Services', naics: '54' },
    { id: '62', name: 'Healthcare and Social Assistance', naics: '62' },
    { id: '44-45', name: 'Retail Trade', naics: '44-45' },
    { id: '31-33', name: 'Manufacturing', naics: '31-33' },
    { id: '61', name: 'Educational Services', naics: '61' },
    { id: '48-49', name: 'Transportation and Warehousing', naics: '48-49' },
    { id: '72', name: 'Accommodation and Food Services', naics: '72' },
    { id: '23', name: 'Construction', naics: '23' },
  ]

  // Create industries map
  const industriesMap = new Map<string, Industry>()

  for (const starter of starterIndustries) {
    const digitalReadiness = analyzeDigitalReadiness(starter.name, starter.naics)
    const disruptionRisk = assessDisruptionRisk(starter.name, digitalReadiness)
    const maturity = determineMaturity(starter.name, starter.naics)

    industriesMap.set(starter.id, {
      $type: 'Industry',
      $id: `industries.org.ai:${starter.id}`,
      industryId: starter.id,
      industryName: starter.name,
      naicsCode: starter.naics,
      digitalReadiness,
      disruptionRisk,
      maturity,
    })
  }

  // Convert to record
  const industries: Record<string, Industry> = {}
  for (const [id, industry] of industriesMap.entries()) {
    industries[id] = industry
  }

  console.log(`📊 Created ${Object.keys(industries).length} enhanced industries`)

  // Count by digital readiness
  const readinessCounts = Object.values(industries).reduce((acc, ind) => {
    if (ind.digitalReadiness) {
      acc[ind.digitalReadiness] = (acc[ind.digitalReadiness] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)

  console.log('\n💻 Industries by digital readiness:')
  Object.entries(readinessCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([readiness, count]) => {
      console.log(`  ${readiness}: ${count}`)
    })

  // Count by disruption risk
  const riskCounts = Object.values(industries).reduce((acc, ind) => {
    if (ind.disruptionRisk) {
      acc[ind.disruptionRisk] = (acc[ind.disruptionRisk] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)

  console.log('\n⚠️  Industries by disruption risk:')
  Object.entries(riskCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([risk, count]) => {
      console.log(`  ${risk}: ${count}`)
    })

  // Generate industries.ts file
  const industriesContent = `/**
 * Enhanced industry data for industries.org.ai
 * Built on NAICS with digital transformation analysis
 */

import type { Industry } from '../types/industry.js'

export const industries: Record<string, Industry> = ${JSON.stringify(industries, null, 2)}

/**
 * Get industry by ID
 */
export function getIndustry(industryId: string): Industry | undefined {
  return industries[industryId]
}

/**
 * Get all industries
 */
export function getAllIndustries(): Industry[] {
  return Object.values(industries)
}

/**
 * Get industries by digital readiness
 */
export function getIndustriesByDigitalReadiness(readiness: string): Industry[] {
  return Object.values(industries).filter((ind) => ind.digitalReadiness === readiness)
}

/**
 * Get industries by disruption risk
 */
export function getIndustriesByDisruptionRisk(risk: string): Industry[] {
  return Object.values(industries).filter((ind) => ind.disruptionRisk === risk)
}

/**
 * Get industries by maturity
 */
export function getIndustriesByMaturity(maturity: string): Industry[] {
  return Object.values(industries).filter((ind) => ind.maturity === maturity)
}

/**
 * Search industries by name
 */
export function searchIndustries(query: string): Industry[] {
  const searchTerm = query.toLowerCase()
  return Object.values(industries).filter((ind) =>
    ind.industryName.toLowerCase().includes(searchTerm)
  )
}
`

  // Write to file
  const dataDir = path.resolve(__dirname, '../src/data')
  fs.mkdirSync(dataDir, { recursive: true })
  fs.writeFileSync(path.join(dataDir, 'industries.ts'), industriesContent)

  console.log(
    `\n✅ Generated industries.ts with ${Object.keys(industries).length} enhanced industries`
  )
  console.log('\n📝 Note: Run NAICS import first to generate full dataset')
}

// Run import
importIndustries().catch((error) => {
  console.error('❌ Import failed:', error)
  process.exit(1)
})
