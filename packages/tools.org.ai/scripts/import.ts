#!/usr/bin/env tsx
/**
 * Import O*NET Tools and Technology data
 *
 * Fetches Tools and Technology dataset from O*NET Center and generates
 * TypeScript data files for tools.org.ai package
 *
 * Data Source: O*NET Database 30.0
 * File: Tools and Technology.txt
 * Columns: O*NET-SOC Code, Commodity Code, T2 Type, Commodity Title, Hot Technology, Example
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import type { Tool, ToolCategory } from '../src/types/tool.js'

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// O*NET Database URL
const ONET_BASE = 'https://www.onetcenter.org/dl_files/database/db_30_0_text'
const TOOLS_URL = `${ONET_BASE}/Tools%20and%20Technology.txt`

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
 * Categorize tool based on commodity title and T2 Type
 */
function categorizeTool(commodityTitle: string, t2Type: string): ToolCategory {
  const title = commodityTitle.toLowerCase()
  const type = t2Type.toLowerCase()

  // Computer hardware (treat as tool category)
  if (
    /\b(computer|laptop|server|workstation|pc|desktop|tablet)\b/.test(title) ||
    type.includes('computer')
  ) {
    return 'Computer Hardware'
  }

  // Hand tools
  if (
    /\b(hammer|screwdriver|wrench|pliers|saw|drill|chisel|file|clamp)\b/.test(title) ||
    title.includes('hand tool')
  ) {
    return 'Hand Tool'
  }

  // Power tools
  if (/\b(power|electric|pneumatic|hydraulic)\b/.test(title) && !title.includes('vehicle')) {
    return 'Power Tool'
  }

  // Measuring tools
  if (
    /\b(meter|gauge|scale|ruler|caliper|thermometer|micrometer|sensor)\b/.test(title) ||
    title.includes('measuring')
  ) {
    return 'Measuring Tool'
  }

  // Safety equipment
  if (
    /\b(safety|protective|helmet|goggles|gloves|vest|harness|respirator)\b/.test(title) ||
    title.includes('ppe') ||
    title.includes('personal protective')
  ) {
    return 'Safety Equipment'
  }

  // Medical equipment
  if (
    /\b(medical|surgical|diagnostic|patient|hospital|clinical|stethoscope|syringe)\b/.test(
      title
    ) ||
    type.includes('medical')
  ) {
    return 'Medical Equipment'
  }

  // Scientific equipment
  if (
    /\b(microscope|spectro|centrifuge|analyzer|chromatograph|laboratory|lab equipment)\b/.test(
      title
    ) ||
    type.includes('scientific')
  ) {
    return 'Scientific Equipment'
  }

  // Construction equipment
  if (
    /\b(excavator|bulldozer|crane|loader|forklift|concrete|scaffolding)\b/.test(title) ||
    type.includes('construction')
  ) {
    return 'Construction Equipment'
  }

  // Agricultural equipment
  if (
    /\b(tractor|plow|harvester|seeder|irrigation|sprayer|combine)\b/.test(title) ||
    type.includes('agricultural') ||
    type.includes('farming')
  ) {
    return 'Agricultural Equipment'
  }

  // Manufacturing equipment
  if (
    /\b(lathe|mill|press|grinder|cutter|welder|cnc|assembly line)\b/.test(title) ||
    type.includes('manufacturing')
  ) {
    return 'Manufacturing Equipment'
  }

  // Vehicles
  if (
    /\b(vehicle|truck|car|van|bus|motorcycle|aircraft|boat|ship)\b/.test(title) ||
    type.includes('vehicle')
  ) {
    return 'Vehicle'
  }

  // Machinery (general)
  if (
    /\b(machine|machinery|equipment|apparatus)\b/.test(title) ||
    type.includes('machinery')
  ) {
    return 'Machinery'
  }

  // Instruments
  if (/\b(instrument|device)\b/.test(title) || type.includes('instrument')) {
    return 'Instrument'
  }

  // Office equipment
  if (
    /\b(printer|copier|scanner|fax|shredder|telephone|projector)\b/.test(title) ||
    type.includes('office')
  ) {
    return 'Office Equipment'
  }

  // Default
  return 'Other'
}

/**
 * Main import function
 */
async function importTools() {
  console.log('🚀 Importing O*NET Tools and Technology data...\n')

  // Fetch Tools and Technology data
  console.log('📥 Fetching Tools and Technology from O*NET Center...')
  const toolsText = await fetchWithRetry(TOOLS_URL)
  const toolsData = parseTSV(toolsText)
  console.log(`  ✓ Fetched ${toolsData.length} tool records\n`)

  // Group by commodity code (deduplicate)
  const toolsMap = new Map<string, Tool>()

  for (const row of toolsData) {
    const commodityCode = row['Commodity Code']
    const commodityTitle = row['Commodity Title']
    const t2Type = row['T2 Type']
    const example = row['Example']

    if (!toolsMap.has(commodityCode)) {
      toolsMap.set(commodityCode, {
        $type: 'Tool',
        $id: `tools.org.ai:${commodityCode}`,
        commodityCode,
        commodityTitle,
        category: categorizeTool(commodityTitle, t2Type),
        examples: example ? [example] : [],
      })
    } else {
      // Add example to existing tool
      const tool = toolsMap.get(commodityCode)!
      if (example && !tool.examples?.includes(example)) {
        tool.examples = tool.examples || []
        tool.examples.push(example)
      }
    }
  }

  // Convert to record
  const tools: Record<string, Tool> = {}
  for (const [code, tool] of toolsMap.entries()) {
    tools[code] = tool
  }

  console.log(`📊 Deduplicated to ${Object.keys(tools).length} unique tools`)

  // Count by category
  const categoryCounts = Object.values(tools).reduce((acc, tool) => {
    acc[tool.category] = (acc[tool.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  console.log('\n📈 Tools by category:')
  Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([category, count]) => {
      console.log(`  ${category}: ${count}`)
    })

  // Generate tools.ts file
  const toolsContent = `/**
 * Tool data for tools.org.ai
 * Generated from O*NET Database 30.0 - Tools and Technology
 */

import type { Tool } from '../types/tool.js'

export const tools: Record<string, Tool> = ${JSON.stringify(tools, null, 2)}

/**
 * Get tool by commodity code
 */
export function getTool(commodityCode: string): Tool | undefined {
  return tools[commodityCode]
}

/**
 * Get all tools
 */
export function getAllTools(): Tool[] {
  return Object.values(tools)
}

/**
 * Get tools by category
 */
export function getToolsByCategory(category: string): Tool[] {
  return Object.values(tools).filter((tool) => tool.category === category)
}

/**
 * Search tools by name
 */
export function searchTools(query: string): Tool[] {
  const searchTerm = query.toLowerCase()
  return Object.values(tools).filter((tool) =>
    tool.commodityTitle.toLowerCase().includes(searchTerm)
  )
}
`

  // Write to file
  const dataDir = path.resolve(__dirname, '../src/data')
  fs.mkdirSync(dataDir, { recursive: true })
  fs.writeFileSync(path.join(dataDir, 'tools.ts'), toolsContent)

  console.log(`\n✅ Generated tools.ts with ${Object.keys(tools).length} tools`)
}

// Run import
importTools().catch((error) => {
  console.error('❌ Import failed:', error)
  process.exit(1)
})
