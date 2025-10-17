#!/usr/bin/env tsx
/**
 * Import APQC Process Classification Framework data
 *
 * Processes APQC PCF data and generates TypeScript data files for apqc.org.ai package
 *
 * Data Source: APQC Process Classification Framework (PCF) v7.3.0
 * Website: https://www.apqc.org
 * License: Royalty-free with attribution
 *
 * Attribution: This APQC Process Classification Framework® ("PCF") is an open
 * standard developed by APQC, a nonprofit that promotes benchmarking and best
 * practices worldwide.
 *
 * Note: APQC data must be downloaded manually from:
 * https://www.apqc.org/resource-library/resource-collection/apqcs-process-classification-framework-pcf-cross-industry-and
 *
 * Expected format: CSV/TSV with columns: Process ID, Process Name, Level, Category, Definition
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import type { Process, ProcessLevel } from '../src/types/process.js'

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Parse CSV/TSV data into array of objects
 */
function parseDelimited(text: string, delimiter: string = ','): any[] {
  const lines = text.trim().split('\n')
  const headers = lines[0].split(delimiter)
  return lines.slice(1).map((line) => {
    const values = line.split(delimiter)
    return headers.reduce((obj, header, i) => {
      obj[header.trim()] = values[i]?.trim() || ''
      return obj
    }, {} as any)
  })
}

/**
 * Determine process level from ID (e.g., "1.1.1" = level 3)
 */
function getProcessLevel(processId: string): ProcessLevel {
  const parts = processId.split('.')
  return Math.min(parts.length, 5) as ProcessLevel
}

/**
 * Get parent process ID
 */
function getParentId(processId: string): string | undefined {
  const parts = processId.split('.')
  if (parts.length <= 1) return undefined
  return parts.slice(0, -1).join('.')
}

/**
 * Main import function
 */
async function importAPQC() {
  console.log('🚀 Importing APQC Process Classification Framework data...\n')

  // Check for input file
  const inputPath = path.resolve(__dirname, '../data/apqc-pcf.csv')
  if (!fs.existsSync(inputPath)) {
    console.error('❌ Error: APQC data file not found')
    console.log('\n📥 Please download the APQC PCF from:')
    console.log('   https://www.apqc.org/resource-library/resource-collection/apqcs-process-classification-framework-pcf-cross-industry-and')
    console.log('\n   Save as: ai/packages/apqc.org.ai/data/apqc-pcf.csv')
    console.log('   Format: CSV with columns: Process ID, Process Name, Level, Category, Definition\n')
    process.exit(1)
  }

  // Read and parse APQC data
  console.log('📖 Reading APQC data file...')
  const apqcText = fs.readFileSync(inputPath, 'utf-8')
  const apqcData = parseDelimited(apqcText)
  console.log(`  ✓ Parsed ${apqcData.length} process records\n`)

  // Create processes map
  const processesMap = new Map<string, Process>()

  for (const row of apqcData) {
    const processId = row['Process ID'] || row['ID']
    const processName = row['Process Name'] || row['Name']
    const category = row['Category']
    const definition = row['Definition'] || row['Description']

    const level = getProcessLevel(processId)
    const parentId = getParentId(processId)

    processesMap.set(processId, {
      $type: 'Process',
      $id: `apqc.org.ai:${processId}`,
      processId,
      processName,
      level,
      category: category || undefined,
      parentId,
      definition: definition || undefined,
      industrySpecific: false,
      version: '7.3.0',
    })
  }

  // Convert to record
  const processes: Record<string, Process> = {}
  for (const [id, process] of processesMap.entries()) {
    processes[id] = process
  }

  console.log(`📊 Processed ${Object.keys(processes).length} unique processes`)

  // Count by level
  const levelCounts = Object.values(processes).reduce((acc, proc) => {
    acc[proc.level] = (acc[proc.level] || 0) + 1
    return acc
  }, {} as Record<number, number>)

  console.log('\n📈 Processes by level:')
  for (let level = 1; level <= 5; level++) {
    console.log(`  Level ${level}: ${levelCounts[level] || 0}`)
  }

  // Count by category
  const categoryCounts = Object.values(processes)
    .filter((p) => p.level === 1)
    .reduce((acc, proc) => {
      const cat = proc.category || 'Uncategorized'
      acc[cat] = (acc[cat] || 0) + 1
      return acc
    }, {} as Record<string, number>)

  console.log('\n📂 Top-level categories:')
  Object.entries(categoryCounts).forEach(([category, count]) => {
    console.log(`  ${category}: ${count}`)
  })

  // Generate processes.ts file
  const processesContent = `/**
 * Process data for apqc.org.ai
 * Generated from APQC Process Classification Framework (PCF) v7.3.0
 *
 * Attribution: This APQC Process Classification Framework® ("PCF") is an open
 * standard developed by APQC, a nonprofit that promotes benchmarking and best
 * practices worldwide.
 */

import type { Process } from '../types/process.js'

export const processes: Record<string, Process> = ${JSON.stringify(processes, null, 2)}

/**
 * Get process by ID
 */
export function getProcess(processId: string): Process | undefined {
  return processes[processId]
}

/**
 * Get all processes
 */
export function getAllProcesses(): Process[] {
  return Object.values(processes)
}

/**
 * Get processes by level
 */
export function getProcessesByLevel(level: number): Process[] {
  return Object.values(processes).filter((proc) => proc.level === level)
}

/**
 * Get top-level processes (Level 1)
 */
export function getTopLevelProcesses(): Process[] {
  return getProcessesByLevel(1)
}

/**
 * Get subprocess of a parent process
 */
export function getSubprocesses(parentId: string): Process[] {
  return Object.values(processes).filter((proc) => proc.parentId === parentId)
}

/**
 * Search processes by name
 */
export function searchProcesses(query: string): Process[] {
  const searchTerm = query.toLowerCase()
  return Object.values(processes).filter((proc) =>
    proc.processName.toLowerCase().includes(searchTerm)
  )
}
`

  // Write to file
  const dataDir = path.resolve(__dirname, '../src/data')
  fs.mkdirSync(dataDir, { recursive: true })
  fs.writeFileSync(path.join(dataDir, 'processes.ts'), processesContent)

  console.log(`\n✅ Generated processes.ts with ${Object.keys(processes).length} processes`)
  console.log('\n📝 Attribution:')
  console.log(
    '   This APQC Process Classification Framework® ("PCF") is an open standard'
  )
  console.log('   developed by APQC, a nonprofit that promotes benchmarking and best')
  console.log('   practices worldwide.\n')
}

// Run import
importAPQC().catch((error) => {
  console.error('❌ Import failed:', error)
  process.exit(1)
})
