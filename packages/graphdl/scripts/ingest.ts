#!/usr/bin/env node
/**
 * Main ingestion orchestrator for all data sources
 * Runs all ingestion scripts and provides summary statistics
 */

import { ingestNAICS } from './ingest/naics.js'
import { ingestAPQC } from './ingest/apqc.js'
import { ingestUNEDI } from './ingest/unedi.js'
import { ingestZapier } from './ingest/zapier.js'
import { ingestN8n } from './ingest/n8n.js'
import { ingestONet } from './ingest/onet.js'
import type { IngestionResult } from './ingest/types.js'

// Constants for output formatting
const SEPARATOR_WIDTH = 60

/**
 * Runs all ingestion scripts in parallel
 * Note: For 100+ sources, consider batching with Promise.allSettled() to avoid memory issues
 * @returns Exit code (0 for success, 1 for errors)
 */
async function ingestAll(): Promise<number> {
  console.log('='.repeat(SEPARATOR_WIDTH))
  console.log('Starting Data Ingestion Pipeline')
  console.log('='.repeat(SEPARATOR_WIDTH))
  console.log()

  const startTime = Date.now()

  try {
    // Run all ingestions in parallel for maximum efficiency
    const results = await Promise.all([ingestNAICS(), ingestAPQC(), ingestUNEDI(), ingestZapier(), ingestN8n(), ingestONet()])

    const totalDuration = Date.now() - startTime

    // Calculate aggregate statistics
    const totals = results.reduce(
      (acc, result) => ({
        totalRecords: acc.totalRecords + result.totalRecords,
        successCount: acc.successCount + result.successCount,
        errorCount: acc.errorCount + result.errorCount,
        errors: [...acc.errors, ...result.errors],
      }),
      {
        totalRecords: 0,
        successCount: 0,
        errorCount: 0,
        errors: [] as string[],
      }
    )

    // Print summary
    console.log()
    console.log('='.repeat(SEPARATOR_WIDTH))
    console.log('Ingestion Pipeline Summary')
    console.log('='.repeat(SEPARATOR_WIDTH))
    console.log()
    console.log('Data Sources Processed:')
    results.forEach((result) => {
      const status = result.errorCount === 0 ? '✓' : '⚠'
      console.log(`  ${status} ${result.source}: ${result.successCount}/${result.totalRecords} records (${result.duration}ms)`)
    })
    console.log()
    console.log('Aggregate Statistics:')
    console.log(`  Total Records:   ${totals.totalRecords}`)
    console.log(`  Successful:      ${totals.successCount}`)
    console.log(`  Errors:          ${totals.errorCount}`)
    console.log(`  Total Duration:  ${totalDuration}ms`)
    console.log(`  Success Rate:    ${((totals.successCount / totals.totalRecords) * 100).toFixed(2)}%`)
    console.log()

    if (totals.errors.length > 0) {
      console.log('Errors Encountered:')
      totals.errors.forEach((error) => {
        console.log(`  ✗ ${error}`)
      })
      console.log()
    }

    // Print file locations
    console.log('Output Locations:')
    console.log('  • .db/NAICS/     - NAICS industry classifications')
    console.log('  • .db/APQC/      - APQC process framework')
    console.log('  • .db/UNEDI/     - UN/EDIFACT message types')
    console.log('  • .db/Zapier/    - Zapier app integrations')
    console.log('  • .db/n8n/       - n8n node integrations')
    console.log('  • .db/ONet/Tools/ - O*NET tools and technology')
    console.log()

    console.log('='.repeat(SEPARATOR_WIDTH))
    console.log(totals.errorCount === 0 ? 'Ingestion completed successfully! ✓' : 'Ingestion completed with errors ⚠')
    console.log('='.repeat(SEPARATOR_WIDTH))
    console.log()

    // Return exit code instead of calling process.exit()
    return totals.errorCount > 0 ? 1 : 0
  } catch (error) {
    console.error()
    console.error('='.repeat(SEPARATOR_WIDTH))
    console.error('Fatal Error During Ingestion')
    console.error('='.repeat(SEPARATOR_WIDTH))
    console.error()
    console.error(error)
    console.error()
    return 1
  }
}

/**
 * Runs specific ingestion based on command line argument
 * @returns Exit code (0 for success, 1 for errors)
 */
async function ingestSpecific(source: string): Promise<number> {
  const sources: Record<string, () => Promise<IngestionResult>> = {
    naics: ingestNAICS,
    apqc: ingestAPQC,
    unedi: ingestUNEDI,
    zapier: ingestZapier,
    n8n: ingestN8n,
    onet: ingestONet,
  }

  const ingestFn = sources[source.toLowerCase()]

  if (!ingestFn) {
    console.error(`Unknown source: ${source}`)
    console.error('Available sources: naics, apqc, unedi, zapier, n8n, onet')
    return 1
  }

  console.log(`Starting ingestion for: ${source}`)
  console.log()

  const result = await ingestFn()

  return result.errorCount > 0 ? 1 : 0
}

// Parse command line arguments
const args = process.argv.slice(2)

if (args.length === 0) {
  // No arguments - run all ingestions
  ingestAll()
    .then((exitCode) => process.exit(exitCode))
    .catch((error) => {
      console.error('Unhandled error:', error)
      process.exit(1)
    })
} else if (args.length === 1) {
  // One argument - run specific ingestion
  ingestSpecific(args[0])
    .then((exitCode) => process.exit(exitCode))
    .catch((error) => {
      console.error('Unhandled error:', error)
      process.exit(1)
    })
} else {
  console.error('Usage:')
  console.error('  node ingest.js          # Run all ingestions')
  console.error('  node ingest.js <source> # Run specific ingestion (naics, apqc, unedi, zapier, n8n, onet)')
  process.exit(1)
}
