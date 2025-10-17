#!/usr/bin/env node
/**
 * Main enrichment orchestrator
 * Runs semantic enrichment using various AI models
 */

import { enrichWithGPT5 } from './enrich/gpt5.js'
import { join } from 'path'

async function main() {
  const args = process.argv.slice(2)
  const dataDir = args[0] || join(process.cwd(), '.db')

  console.log('Starting Semantic Enrichment Pipeline')
  console.log(`Data directory: ${dataDir}`)
  console.log()

  try {
    await enrichWithGPT5(dataDir)
    console.log('\nEnrichment completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('\nEnrichment failed:', error)
    process.exit(1)
  }
}

main()
