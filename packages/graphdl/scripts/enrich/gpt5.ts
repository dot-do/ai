/**
 * GPT-5 Semantic Enrichment Pipeline
 * Uses OpenAI Batch API for cost-effective semantic analysis
 */

import OpenAI from 'openai'
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, mkdirSync, createReadStream } from 'fs'
import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import yaml from 'js-yaml'
import type { FrontmatterValue } from '../ingest/types.js'

// Configuration
const BATCH_FILE_PATH = join(process.cwd(), '.db', '.enrichment-batch.jsonl')
const PROGRESS_FILE_PATH = join(process.cwd(), '.db', '.enrichment-progress.json')
const INITIAL_POLL_INTERVAL_MS = parseInt(process.env.BATCH_POLL_INTERVAL_MS || '60000', 10) // Start with 1 minute
const MAX_POLL_INTERVAL_MS = parseInt(process.env.BATCH_MAX_POLL_INTERVAL_MS || '300000', 10) // Max 5 minutes
const MAX_POLL_ATTEMPTS = parseInt(process.env.BATCH_MAX_POLL_ATTEMPTS || '2880', 10)
const MODEL_NAME = process.env.OPENAI_MODEL || 'gpt-5'

// GPT Configuration - Extract magic numbers (Code Quality #10)
const GPT_TEMPERATURE = 0.3 // Lower temperature for more consistent, focused extraction
const GPT_MAX_TOKENS = 2000 // Sufficient for structured enrichment output
const POLL_BACKOFF_MULTIPLIER = 1.5 // Exponential backoff multiplier for polling interval
const PROGRESS_LOG_INTERVAL = 100 // Log progress every N files during processing
const CONCURRENT_WRITES = 10 // Maximum concurrent file writes (Performance #6)

interface EnrichmentProgress {
  batchId?: string
  inputFileId?: string
  outputFileId?: string
  status: 'preparing' | 'uploading' | 'processing' | 'completed' | 'failed' | 'expired'
  startedAt: string
  completedAt?: string
  processedCount: number
  totalCount: number
  errors: string[]
}

interface BatchRequestItem {
  custom_id: string
  method: 'POST'
  url: string
  body: {
    model: string
    messages: Array<{ role: string; content: string }>
    temperature: number
    max_tokens: number
  }
}

interface BatchResponseItem {
  id: string
  custom_id: string
  response: {
    status_code: number
    body: {
      choices: Array<{
        message: {
          content: string
        }
      }>
    }
  }
  error?: {
    message: string
    type: string
    code: string
  }
}

interface SemanticEnrichment {
  nouns: string[]
  verbs: string[]
  triggers: string[]
  searches: string[]
  actions: string[]
  businessEvents: string[]
  relationships: Array<{ subject: string; predicate: string; object: string }>
  ontologyMappings: Record<string, string>
}

/**
 * Validates enrichment data structure
 */
function validateEnrichment(data: unknown): data is SemanticEnrichment {
  if (typeof data !== 'object' || data === null) return false

  const enrichment = data as Partial<SemanticEnrichment>

  // Validate array fields contain strings
  const hasValidArrays =
    Array.isArray(enrichment.nouns) &&
    enrichment.nouns.every((item) => typeof item === 'string') &&
    Array.isArray(enrichment.verbs) &&
    enrichment.verbs.every((item) => typeof item === 'string') &&
    Array.isArray(enrichment.triggers) &&
    enrichment.triggers.every((item) => typeof item === 'string') &&
    Array.isArray(enrichment.searches) &&
    enrichment.searches.every((item) => typeof item === 'string') &&
    Array.isArray(enrichment.actions) &&
    enrichment.actions.every((item) => typeof item === 'string') &&
    Array.isArray(enrichment.businessEvents) &&
    enrichment.businessEvents.every((item) => typeof item === 'string')

  // Validate relationships structure
  const hasValidRelationships =
    Array.isArray(enrichment.relationships) &&
    enrichment.relationships.every(
      (rel) => typeof rel === 'object' && rel !== null && typeof rel.subject === 'string' && typeof rel.predicate === 'string' && typeof rel.object === 'string'
    )

  // Validate ontologyMappings
  const hasValidOntologyMappings =
    typeof enrichment.ontologyMappings === 'object' &&
    enrichment.ontologyMappings !== null &&
    Object.values(enrichment.ontologyMappings).every((val) => typeof val === 'string')

  return hasValidArrays && hasValidRelationships && hasValidOntologyMappings
}

/**
 * Validates progress data structure
 */
function isValidProgress(data: unknown): data is EnrichmentProgress {
  if (typeof data !== 'object' || data === null) return false

  const progress = data as Partial<EnrichmentProgress>

  const validStatuses = ['preparing', 'uploading', 'processing', 'completed', 'failed', 'expired']

  return (
    typeof progress.status === 'string' &&
    validStatuses.includes(progress.status) &&
    typeof progress.startedAt === 'string' &&
    typeof progress.processedCount === 'number' &&
    typeof progress.totalCount === 'number' &&
    Array.isArray(progress.errors) &&
    progress.errors.every((err) => typeof err === 'string')
  )
}

/**
 * Loads or creates progress tracking file
 */
function loadProgress(): EnrichmentProgress {
  if (existsSync(PROGRESS_FILE_PATH)) {
    try {
      const data = JSON.parse(readFileSync(PROGRESS_FILE_PATH, 'utf-8'))

      if (isValidProgress(data)) {
        return data
      }

      console.warn('Invalid progress file format, starting fresh')
    } catch (error) {
      console.warn('Failed to load progress file, starting fresh:', error)
    }
  }

  return {
    status: 'preparing',
    startedAt: new Date().toISOString(),
    processedCount: 0,
    totalCount: 0,
    errors: [],
  }
}

/**
 * Saves progress to disk for resumability
 */
function saveProgress(progress: EnrichmentProgress): void {
  const dbDir = join(process.cwd(), '.db')
  if (!existsSync(dbDir)) {
    mkdirSync(dbDir, { recursive: true })
  }
  writeFileSync(PROGRESS_FILE_PATH, JSON.stringify(progress, null, 2), 'utf-8')
}

/**
 * Parses MDX frontmatter and content
 */
function parseMDX(content: string): { frontmatter: Record<string, FrontmatterValue>; content: string } {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!frontmatterMatch) {
    return { frontmatter: {}, content }
  }

  const frontmatterText = frontmatterMatch[1]
  const bodyContent = frontmatterMatch[2]

  try {
    const frontmatter = yaml.load(frontmatterText) as Record<string, FrontmatterValue>
    return { frontmatter: frontmatter || {}, content: bodyContent }
  } catch (error) {
    console.error('Error parsing YAML frontmatter:', error)
    return { frontmatter: {}, content: bodyContent }
  }
}

/**
 * Serializes frontmatter and content to MDX format
 */
function serializeMDX(frontmatter: Record<string, FrontmatterValue>, content: string): string {
  const yamlString = yaml.dump(frontmatter, {
    lineWidth: -1, // Don't wrap lines
    noRefs: true, // Don't use YAML references
    sortKeys: false, // Preserve key order
  })
  return `---\n${yamlString}---\n\n${content}`
}

/**
 * Collects all MDX files from .db directory
 */
function collectMDXFiles(dataDir: string): Array<{ path: string; relativePath: string }> {
  const files: Array<{ path: string; relativePath: string }> = []

  function traverse(dir: string, relativeDir: string = '') {
    const entries = readdirSync(dir)

    for (const entry of entries) {
      const fullPath = join(dir, entry)
      const relativePath = relativeDir ? join(relativeDir, entry) : entry

      // Skip hidden files and directories
      if (entry.startsWith('.')) continue

      const stat = statSync(fullPath)

      if (stat.isDirectory()) {
        traverse(fullPath, relativePath)
      } else if (entry.endsWith('.mdx')) {
        files.push({ path: fullPath, relativePath })
      }
    }
  }

  traverse(dataDir)
  return files
}

/**
 * Creates enrichment prompt for GPT-5
 */
function createEnrichmentPrompt(frontmatter: Record<string, FrontmatterValue>, content: string): string {
  return `Analyze the following semantic data and extract structured information for a Business-as-Code platform.

Frontmatter:
${JSON.stringify(frontmatter, null, 2)}

Content:
${content}

Extract and return a JSON object with the following structure:
{
  "nouns": ["array", "of", "key", "nouns"],
  "verbs": ["array", "of", "key", "verbs", "and", "actions"],
  "triggers": ["array", "of", "potential", "trigger", "events"],
  "searches": ["array", "of", "potential", "search", "queries"],
  "actions": ["array", "of", "potential", "actions", "or", "operations"],
  "businessEvents": ["array", "of", "business", "event", "patterns", "in", "$.Subject.predicate.Object", "format"],
  "relationships": [
    {"subject": "SubjectEntity", "predicate": "relationshipType", "object": "ObjectEntity"}
  ],
  "ontologyMappings": {
    "schemaOrgType": "MappedType",
    "gs1Type": "MappedType"
  }
}

Focus on extracting semantic meaning that would be useful for:
1. Building autonomous digital workers
2. Creating business workflows
3. Mapping to Schema.org, GS1, and O*NET vocabularies
4. Identifying trigger-action patterns
5. Understanding business process relationships

Return ONLY valid JSON, no additional text.`
}

/**
 * Creates batch file with enrichment requests
 * Uses async file operations (Performance #5)
 */
async function createBatchFile(files: Array<{ path: string; relativePath: string }>): Promise<number> {
  console.log(`Creating batch file for ${files.length} MDX files...`)

  const requests: BatchRequestItem[] = []

  for (const file of files) {
    try {
      const content = await readFile(file.path, 'utf-8')
      const { frontmatter, content: bodyContent } = parseMDX(content)

      const request: BatchRequestItem = {
        custom_id: file.relativePath,
        method: 'POST',
        url: '/v1/chat/completions',
        body: {
          model: MODEL_NAME,
          messages: [
            {
              role: 'system',
              content: 'You are a semantic analysis expert for Business-as-Code platforms. Extract structured semantic information from data.',
            },
            {
              role: 'user',
              content: createEnrichmentPrompt(frontmatter, bodyContent),
            },
          ],
          temperature: GPT_TEMPERATURE,
          max_tokens: GPT_MAX_TOKENS,
        },
      }

      requests.push(request)
    } catch (error) {
      console.error(`Error processing ${file.relativePath}:`, error)
    }
  }

  // Write JSONL format (one JSON object per line)
  const jsonl = requests.map((req) => JSON.stringify(req)).join('\n')
  writeFileSync(BATCH_FILE_PATH, jsonl, 'utf-8')

  console.log(`✓ Created batch file with ${requests.length} requests`)
  return requests.length
}

/**
 * Uploads batch file to OpenAI
 */
async function uploadBatchFile(openai: OpenAI): Promise<string> {
  console.log('Uploading batch file to OpenAI...')

  const file = await openai.files.create({
    file: createReadStream(BATCH_FILE_PATH),
    purpose: 'batch',
  })

  console.log(`✓ Uploaded batch file: ${file.id}`)
  return file.id
}

/**
 * Creates batch job
 * Note: The Batch API provides cost-effective processing with 24h completion window.
 * service_tier and background processing are not configurable in the current Batch API.
 */
async function createBatchJob(openai: OpenAI, inputFileId: string): Promise<string> {
  console.log('Creating batch job...')

  const batch = await openai.batches.create({
    input_file_id: inputFileId,
    endpoint: '/v1/chat/completions',
    completion_window: '24h',
    metadata: {
      source: 'graphdl-enrichment',
    },
  })

  console.log(`✓ Created batch job: ${batch.id}`)
  console.log(`  Status: ${batch.status}`)
  console.log(`  Request counts: ${JSON.stringify(batch.request_counts)}`)

  return batch.id
}

/**
 * Polls batch job for completion with exponential backoff
 * (Medium Priority #8)
 */
async function pollBatchCompletion(openai: OpenAI, batchId: string, progress: EnrichmentProgress): Promise<OpenAI.Batches.Batch> {
  console.log(`\nPolling batch job ${batchId} for completion...`)
  console.log(`Initial interval: ${INITIAL_POLL_INTERVAL_MS / 1000}s, max interval: ${MAX_POLL_INTERVAL_MS / 1000}s\n`)

  let attempts = 0
  let currentInterval = INITIAL_POLL_INTERVAL_MS

  while (attempts < MAX_POLL_ATTEMPTS) {
    const batch = await openai.batches.retrieve(batchId)

    // Update progress status with proper type checking
    const validStatuses = ['preparing', 'uploading', 'processing', 'completed', 'failed', 'expired']
    if (validStatuses.includes(batch.status)) {
      progress.status = batch.status as EnrichmentProgress['status']
    }
    saveProgress(progress)

    console.log(`[${new Date().toISOString()}] Status: ${batch.status}`)
    if (batch.request_counts) {
      console.log(`  Completed: ${batch.request_counts.completed || 0}/${batch.request_counts.total || 0}`)
      console.log(`  Failed: ${batch.request_counts.failed || 0}`)
    }

    if (batch.status === 'completed') {
      console.log('\n✓ Batch completed successfully!')
      return batch
    }

    if (batch.status === 'failed' || batch.status === 'expired' || batch.status === 'cancelled') {
      throw new Error(`Batch ${batch.status}: ${JSON.stringify(batch.errors)}`)
    }

    // Wait before next poll with exponential backoff
    console.log(`  Next check in ${currentInterval / 1000}s...`)
    await new Promise((resolve) => setTimeout(resolve, currentInterval))

    // Increase interval for next poll (exponential backoff)
    currentInterval = Math.min(currentInterval * POLL_BACKOFF_MULTIPLIER, MAX_POLL_INTERVAL_MS)
    attempts++
  }

  throw new Error(`Batch polling timed out after ${MAX_POLL_ATTEMPTS} attempts`)
}

/**
 * Process a single batch result item
 */
async function processSingleResult(result: BatchResponseItem, dataDir: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (result.error) {
      return { success: false, error: result.error.message }
    }

    // Add null checks for batch response structure (Critical #3)
    const choice = result.response?.body?.choices?.[0]
    if (!choice?.message?.content) {
      return { success: false, error: 'Invalid response structure' }
    }

    const filePath = join(dataDir, result.custom_id)
    // Use async file operations (Medium Priority #9)
    const originalContent = await readFile(filePath, 'utf-8')
    const { frontmatter, content } = parseMDX(originalContent)

    // Extract enrichment data from GPT response
    const enrichmentText = choice.message.content

    // Add JSON parse error handling (Critical #3)
    let enrichmentData: unknown
    try {
      enrichmentData = JSON.parse(enrichmentText)
    } catch (parseError) {
      return { success: false, error: `Invalid JSON: ${parseError}` }
    }

    // Validate enrichment data
    if (!validateEnrichment(enrichmentData)) {
      return { success: false, error: 'Invalid enrichment structure' }
    }

    // Validate non-empty enrichment data (Medium Priority #10)
    const hasContent =
      enrichmentData.nouns.length > 0 ||
      enrichmentData.verbs.length > 0 ||
      enrichmentData.triggers.length > 0 ||
      enrichmentData.searches.length > 0 ||
      enrichmentData.actions.length > 0 ||
      enrichmentData.businessEvents.length > 0 ||
      enrichmentData.relationships.length > 0 ||
      Object.keys(enrichmentData.ontologyMappings).length > 0

    if (!hasContent) {
      console.warn(`⚠️  Empty enrichment data for ${result.custom_id}`)
    }

    // Add enrichment to frontmatter
    frontmatter.enrichment = enrichmentData

    // Write enriched MDX back to file (async)
    const enrichedMDX = serializeMDX(frontmatter, content)
    await writeFile(filePath, enrichedMDX, 'utf-8')

    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

/**
 * Downloads and processes batch results with concurrent writes (Performance #6)
 */
async function processBatchResults(openai: OpenAI, outputFileId: string, dataDir: string): Promise<number> {
  console.log('\nDownloading batch results...')

  const fileContent = await openai.files.content(outputFileId)
  const text = await fileContent.text()

  const results: BatchResponseItem[] = text
    .split('\n')
    .filter((line) => line.trim())
    .map((line) => JSON.parse(line))

  console.log(`Processing ${results.length} enrichment results with concurrency limit of ${CONCURRENT_WRITES}...`)

  let successCount = 0
  let errorCount = 0
  const activePromises: Promise<void>[] = []

  for (let i = 0; i < results.length; i++) {
    const result = results[i]

    // Process result with concurrency control
    const processPromise = processSingleResult(result, dataDir).then((outcome) => {
      if (outcome.success) {
        successCount++
      } else {
        console.error(`✗ Error for ${result.custom_id}: ${outcome.error}`)
        errorCount++
      }

      // Add progress updates during result processing (High Priority #6)
      const processed = successCount + errorCount
      if (processed % PROGRESS_LOG_INTERVAL === 0 || processed === results.length) {
        console.log(`Progress: ${processed}/${results.length} files processed (${successCount} successful, ${errorCount} errors)`)
      }
    })

    activePromises.push(processPromise)

    // Wait when we hit concurrency limit
    if (activePromises.length >= CONCURRENT_WRITES) {
      await Promise.race(activePromises)
      // Remove completed promises
      const completedIndex = activePromises.findIndex((p) => p === (await Promise.race(activePromises)))
      if (completedIndex !== -1) {
        activePromises.splice(completedIndex, 1)
      }
    }
  }

  // Wait for remaining promises
  await Promise.all(activePromises)

  console.log(`\n✓ Enrichment complete: ${successCount} successful, ${errorCount} errors`)
  return successCount
}

/**
 * Main enrichment function
 */
export async function enrichWithGPT5(dataDir: string = join(process.cwd(), '.db')): Promise<void> {
  console.log('='.repeat(60))
  console.log('GPT-5 Semantic Enrichment Pipeline')
  console.log('='.repeat(60))
  console.log()

  // Validate OpenAI API key
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is required')
  }

  const openai = new OpenAI({ apiKey })

  // Load or resume progress
  let progress = loadProgress()

  try {
    // Check if we can resume an existing batch
    if (progress.batchId && progress.status === 'processing') {
      console.log(`Resuming existing batch: ${progress.batchId}`)
      const batch = await openai.batches.retrieve(progress.batchId)

      if (batch.status === 'completed' && batch.output_file_id) {
        progress.outputFileId = batch.output_file_id
        progress.status = 'completed'
        saveProgress(progress)

        await processBatchResults(openai, batch.output_file_id, dataDir)
        return
      }

      // Improve error recovery for failed/expired batches (High Priority #5)
      if (batch.status === 'failed' || batch.status === 'expired' || batch.status === 'cancelled') {
        console.warn(`\n⚠️  Previous batch ${progress.batchId} ${batch.status}.`)
        console.warn(`Starting fresh enrichment process...\n`)
        progress = {
          status: 'preparing',
          startedAt: new Date().toISOString(),
          processedCount: 0,
          totalCount: 0,
          errors: [],
        }
        saveProgress(progress)
        // Fall through to start new enrichment process
      } else if (batch.status === 'validating' || batch.status === 'in_progress' || batch.status === 'finalizing') {
        // Continue polling if still in progress
        const completedBatch = await pollBatchCompletion(openai, progress.batchId, progress)
        if (completedBatch.output_file_id) {
          await processBatchResults(openai, completedBatch.output_file_id, dataDir)
        }
        return
      }
    }

    // Start new enrichment process
    console.log(`Data directory: ${dataDir}\n`)

    // Step 1: Collect MDX files
    const files = collectMDXFiles(dataDir)
    progress.totalCount = files.length
    saveProgress(progress)

    if (files.length === 0) {
      console.log('No MDX files found to enrich.')
      return
    }

    // Step 2: Create batch file
    progress.status = 'preparing'
    saveProgress(progress)
    const requestCount = await createBatchFile(files)

    // Step 3: Upload batch file
    progress.status = 'uploading'
    saveProgress(progress)
    const inputFileId = await uploadBatchFile(openai)
    progress.inputFileId = inputFileId
    saveProgress(progress)

    // Step 4: Create batch job
    const batchId = await createBatchJob(openai, inputFileId)
    progress.batchId = batchId
    progress.status = 'processing'
    saveProgress(progress)

    // Step 5: Poll for completion
    const completedBatch = await pollBatchCompletion(openai, batchId, progress)

    // Step 6: Process results
    if (completedBatch.output_file_id) {
      progress.outputFileId = completedBatch.output_file_id
      saveProgress(progress)

      const processedCount = await processBatchResults(openai, completedBatch.output_file_id, dataDir)
      progress.processedCount = processedCount
      progress.status = 'completed'
      progress.completedAt = new Date().toISOString()
      saveProgress(progress)
    }

    console.log()
    console.log('='.repeat(60))
    console.log('Enrichment Pipeline Complete')
    console.log('='.repeat(60))
    console.log()
  } catch (error) {
    progress.status = 'failed'
    progress.errors.push(error instanceof Error ? error.message : String(error))
    saveProgress(progress)

    console.error()
    console.error('='.repeat(60))
    console.error('Enrichment Pipeline Failed')
    console.error('='.repeat(60))
    console.error()
    console.error(error)
    throw error
  }
}

// CLI support
if (import.meta.url === `file://${process.argv[1]}`) {
  const dataDir = process.argv[2] || join(process.cwd(), '.db')
  enrichWithGPT5(dataDir)
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Fatal error:', error)
      process.exit(1)
    })
}
