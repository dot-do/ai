#!/usr/bin/env tsx
/**
 * Import Wikipedia structured data using dumpster-dive
 *
 * This script provides two modes:
 * 1. Sample mode (default): Process a small sample for testing
 * 2. Full mode (--full): Process entire Wikipedia dump
 *
 * Data Source: Wikipedia dumps (https://dumps.wikimedia.org/)
 * Parser: wtf_wikipedia via dumpster-dive
 *
 * FULL PIPELINE TODO:
 * For production deployment, this needs to be run on Cloudflare infrastructure:
 * - Cloudflare Containers for processing (dumpster-dive workers)
 * - Cloudflare Pipelines for data streaming
 * - Cloudflare Streams for real-time updates
 * - R2 for data storage (Apache Iceberg format)
 * - R2 SQL for querying structured data
 *
 * See issues:
 * - #TBD: Setup Cloudflare Pipeline for Wikipedia ingestion
 * - #TBD: Apache Iceberg schema for Wikipedia structured data
 * - #TBD: R2 SQL catalog for Wikipedia entities
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import type { WikipediaArticle, WikipediaEntity } from '../src/types/article.js'

// ES module __dirname equivalent
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Sample articles for testing (without full Wikipedia dump)
 */
const SAMPLE_ARTICLES = [
  'Anthropic',
  'OpenAI',
  'Claude_(language_model)',
  'Artificial_intelligence',
  'Machine_learning',
  'Python_(programming_language)',
  'JavaScript',
  'React_(software)',
  'TypeScript',
  'Business',
]

/**
 * Fetch Wikipedia article data using MediaWiki API
 * (For sample mode - full mode uses dumpster-dive on dump files)
 */
async function fetchWikipediaArticle(title: string): Promise<any> {
  const url = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts|pageimages|categories|links&format=json&titles=${encodeURIComponent(title)}&explaintext=1&exintro=1&redirects=1`

  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  const data = await response.json()
  const pages = data.query.pages
  const pageId = Object.keys(pages)[0]

  if (pageId === '-1') {
    console.log(`  ⚠️  Article not found: ${title}`)
    return null
  }

  return pages[pageId]
}

/**
 * Convert MediaWiki API response to WikipediaArticle
 */
function convertToArticle(apiData: any, title: string): WikipediaArticle {
  const normalizedTitle = title.replace(/_/g, ' ')

  return {
    $type: 'WikipediaArticle',
    $id: `https://wikipedia.org.ai/${title}`,
    title: normalizedTitle,
    pageId: apiData.pageid,
    wikiUrl: `https://en.wikipedia.org/wiki/${title}`,
    summary: apiData.extract,
    categories: apiData.categories?.map((cat: any) => ({
      name: cat.title.replace('Category:', ''),
    })),
    lang: 'en',
  }
}

/**
 * Import sample Wikipedia articles
 */
async function importSample() {
  console.log('🚀 Importing sample Wikipedia articles...\n')
  console.log('📋 Sample articles:', SAMPLE_ARTICLES.length, '\n')

  const articles: Record<string, WikipediaArticle> = {}

  for (const title of SAMPLE_ARTICLES) {
    console.log(`📥 Fetching: ${title}`)
    try {
      const apiData = await fetchWikipediaArticle(title)
      if (apiData) {
        const article = convertToArticle(apiData, title)
        articles[title] = article
        console.log(`  ✓ Processed: ${article.title}`)
      }
    } catch (error) {
      console.error(`  ❌ Failed to fetch ${title}:`, error)
    }

    // Rate limiting
    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  console.log(`\n📊 Successfully processed ${Object.keys(articles).length} articles`)

  // Generate articles.ts file
  const articlesContent = `/**
 * Wikipedia articles for wikipedia.org.ai
 * Sample data from Wikipedia MediaWiki API
 *
 * For full Wikipedia data, run: pnpm import:full
 * See scripts/import.ts for Cloudflare Pipeline setup
 */

import type { WikipediaArticle } from '../types/article.js'

export const articles: Record<string, WikipediaArticle> = ${JSON.stringify(articles, null, 2)}

/**
 * Get article by title (with underscores)
 */
export function getArticle(title: string): WikipediaArticle | undefined {
  return articles[title]
}

/**
 * Get all articles
 */
export function getAllArticles(): WikipediaArticle[] {
  return Object.values(articles)
}

/**
 * Search articles by title or summary
 */
export function searchArticles(query: string): WikipediaArticle[] {
  const searchTerm = query.toLowerCase()
  return Object.values(articles).filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm) ||
      article.summary?.toLowerCase().includes(searchTerm)
  )
}

/**
 * Get canonical entity URL
 * Format: https://wikipedia.org.ai/EntityName
 */
export function getEntityUrl(title: string): string {
  return \`https://wikipedia.org.ai/\${title.replace(/ /g, '_')}\`
}
`

  // Write to file
  const dataDir = path.resolve(__dirname, '../src/data')
  fs.mkdirSync(dataDir, { recursive: true })
  fs.writeFileSync(path.join(dataDir, 'articles.ts'), articlesContent)

  console.log(`\n✅ Generated articles.ts with ${Object.keys(articles).length} sample articles`)
  console.log('\n💡 For full Wikipedia import, see pipeline setup requirements in script header')
}

/**
 * Import full Wikipedia dump (requires dumpster-dive setup)
 */
async function importFull() {
  console.log('🚀 Full Wikipedia import...\n')
  console.log('⚠️  This requires:')
  console.log('   1. Wikipedia dump download (13GB+ for English)')
  console.log('   2. dumpster-dive processing (~hours)')
  console.log('   3. MongoDB or similar for storage')
  console.log('   4. Cloudflare Pipeline setup for production\n')

  console.log('📋 TODO: Implement full pipeline')
  console.log('   - Setup Cloudflare Containers for dumpster-dive workers')
  console.log('   - Configure Cloudflare Pipelines for streaming')
  console.log('   - Setup R2 with Apache Iceberg schema')
  console.log('   - Configure R2 SQL catalog')
  console.log('\nFor now, using sample mode. Run without --full flag.')

  process.exit(1)
}

// Run import
const isFullMode = process.argv.includes('--full')

if (isFullMode) {
  importFull().catch((error) => {
    console.error('❌ Import failed:', error)
    process.exit(1)
  })
} else {
  importSample().catch((error) => {
    console.error('❌ Import failed:', error)
    process.exit(1)
  })
}
