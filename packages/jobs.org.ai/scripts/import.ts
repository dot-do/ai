#!/usr/bin/env tsx
/**
 * Import O*NET Alternate Titles data
 *
 * Fetches Alternate Titles dataset from O*NET Center and generates
 * TypeScript data files for jobs.org.ai package
 *
 * Data Source: O*NET Database 30.0
 * File: Alternate Titles.txt
 * Columns: O*NET-SOC Code, Alternate Title, Short Title, Sources
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import type { Job } from '../src/types/job.js'

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// O*NET Database URL
const ONET_BASE = 'https://www.onetcenter.org/dl_files/database/db_30_0_text'
const TITLES_URL = `${ONET_BASE}/Alternate%20Titles.txt`

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
 * Normalize job title for use as ID
 */
function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Main import function
 */
async function importJobs() {
  console.log('🚀 Importing O*NET Alternate Titles data...\n')

  // Fetch Alternate Titles data
  console.log('📥 Fetching Alternate Titles from O*NET Center...')
  const titlesText = await fetchWithRetry(TITLES_URL)
  const titlesData = parseTSV(titlesText)
  console.log(`  ✓ Fetched ${titlesData.length} alternate title records\n`)

  // Create jobs map
  const jobsMap = new Map<string, Job>()

  for (const row of titlesData) {
    const onetSocCode = row['O*NET-SOC Code']
    const alternateTitle = row['Alternate Title']
    const shortTitle = row['Short Title']
    const sources = row['Sources']

    const titleId = normalizeTitle(alternateTitle)
    const jobKey = `${onetSocCode}:${titleId}`

    jobsMap.set(jobKey, {
      $type: 'Job',
      $id: `jobs.org.ai:${jobKey}`,
      onetSocCode,
      alternateTitle,
      shortTitle: shortTitle || undefined,
      sources: sources ? sources.split(',').map((s: string) => s.trim()) : undefined,
    })
  }

  // Convert to record
  const jobs: Record<string, Job> = {}
  for (const [key, job] of jobsMap.entries()) {
    jobs[key] = job
  }

  console.log(`📊 Processed ${Object.keys(jobs).length} unique job titles`)

  // Count by occupation
  const occupationCounts = Object.values(jobs).reduce((acc, job) => {
    acc[job.onetSocCode] = (acc[job.onetSocCode] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  console.log(`\n📈 ${Object.keys(occupationCounts).length} occupations with alternate titles`)
  console.log(
    `   Average ${(Object.keys(jobs).length / Object.keys(occupationCounts).length).toFixed(1)} alternate titles per occupation`
  )

  // Show top 10 occupations by title count
  const topOccupations = Object.entries(occupationCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)

  console.log('\n🔝 Top 10 occupations by alternate title count:')
  topOccupations.forEach(([code, count]) => {
    console.log(`  ${code}: ${count} titles`)
  })

  // Generate jobs.ts file
  const jobsContent = `/**
 * Job data for jobs.org.ai
 * Generated from O*NET Database 30.0 - Alternate Titles
 */

import type { Job } from '../types/job.js'

export const jobs: Record<string, Job> = ${JSON.stringify(jobs, null, 2)}

/**
 * Get job by key (onetSocCode:titleId)
 */
export function getJob(onetSocCode: string, titleId: string): Job | undefined {
  return jobs[\`\${onetSocCode}:\${titleId}\`]
}

/**
 * Get all jobs
 */
export function getAllJobs(): Job[] {
  return Object.values(jobs)
}

/**
 * Get jobs by O*NET-SOC Code (occupation)
 */
export function getJobsByOccupation(onetSocCode: string): Job[] {
  return Object.values(jobs).filter((job) => job.onetSocCode === onetSocCode)
}

/**
 * Search jobs by title
 */
export function searchJobs(query: string): Job[] {
  const searchTerm = query.toLowerCase()
  return Object.values(jobs).filter(
    (job) =>
      job.alternateTitle.toLowerCase().includes(searchTerm) ||
      job.shortTitle?.toLowerCase().includes(searchTerm)
  )
}
`

  // Write to file
  const dataDir = path.resolve(__dirname, '../src/data')
  fs.mkdirSync(dataDir, { recursive: true })
  fs.writeFileSync(path.join(dataDir, 'jobs.ts'), jobsContent)

  console.log(`\n✅ Generated jobs.ts with ${Object.keys(jobs).length} job titles`)
}

// Run import
importJobs().catch((error) => {
  console.error('❌ Import failed:', error)
  process.exit(1)
})
