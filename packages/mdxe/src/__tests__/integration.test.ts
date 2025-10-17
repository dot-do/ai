/**
 * Integration tests for mdxe end-to-end flow
 * Tests the full workflow: parse -> validate -> generate config -> cleanup
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { writeFile, readFile, unlink, mkdir } from 'fs/promises'
import { join } from 'path'
import { tmpdir } from 'os'
import { parseWorker, validateWorkerConfig } from '../parser.js'
import { generateWranglerConfig, cleanupWranglerConfig, extractWranglerConfig } from '../wrangler.js'

describe('mdxe Integration Tests', () => {
  let testDir: string
  let workerPath: string
  let configPath: string

  beforeEach(async () => {
    // Create temporary test directory
    testDir = join(tmpdir(), `mdxe-test-${Date.now()}`)
    await mkdir(testDir, { recursive: true })
    workerPath = join(testDir, 'worker.mdx')
  })

  afterEach(async () => {
    // Cleanup test files
    try {
      if (configPath) {
        await unlink(configPath).catch(() => {})
      }
      await unlink(workerPath).catch(() => {})
    } catch (error) {
      // Ignore cleanup errors
    }
  })

  it('should parse and validate a complete MDXLD worker', async () => {
    // Create a test worker file
    const workerContent = `---
$type: Worker
$id: https://workers.do/test
name: test-worker
main: src/index.ts
compatibility_date: 2025-10-04
compatibility_flags:
  - nodejs_compat
observability:
  enabled: true
  head_sampling_rate: 1
services:
  - binding: API
    service: api
---

# Test Worker

This is a test worker for integration testing.
`

    await writeFile(workerPath, workerContent, 'utf-8')

    // Parse the worker
    const worker = await parseWorker(workerPath)

    // Validate structure
    expect(worker.frontmatter.$type).toBe('Worker')
    expect(worker.frontmatter.$id).toBe('https://workers.do/test')
    expect(worker.frontmatter.name).toBe('test-worker')
    expect(worker.frontmatter.main).toBe('src/index.ts')
    // Parser normalizes dates to YYYY-MM-DD format
    expect(worker.frontmatter.compatibility_date).toBe('2025-10-04')
    expect(worker.frontmatter.compatibility_flags).toEqual(['nodejs_compat'])
    expect(worker.content).toContain('# Test Worker')
    expect(worker.filePath).toBe(workerPath)

    // Validate configuration
    const validation = validateWorkerConfig(worker.frontmatter)
    expect(validation.valid).toBe(true)
    expect(validation.errors).toHaveLength(0)
  })

  it('should generate valid wrangler config from MDXLD worker', async () => {
    const workerContent = `---
$type: Worker
name: config-test
main: src/index.ts
compatibility_date: 2025-10-04
services:
  - binding: DB
    service: db
vars:
  API_KEY: secret
  DEBUG: 'true'
---

# Config Test Worker
`

    await writeFile(workerPath, workerContent, 'utf-8')

    // Parse and generate config
    const worker = await parseWorker(workerPath)
    configPath = await generateWranglerConfig(worker)

    // Verify config file was created
    expect(configPath).toBe(join(testDir, '.wrangler.mdxe.jsonc'))

    // Read and parse the generated config
    const configContent = await readFile(configPath, 'utf-8')
    const config = JSON.parse(configContent)

    // Verify config structure
    expect(config.name).toBe('config-test')
    expect(config.main).toBe('src/index.ts')
    // Parser normalizes dates to YYYY-MM-DD format
    expect(config.compatibility_date).toBe('2025-10-04')
    expect(config.$schema).toBe('node_modules/wrangler/config-schema.json')

    // Verify bindings
    expect(config.services).toHaveLength(1)
    expect(config.services[0].binding).toBe('DB')
    expect(config.services[0].service).toBe('db')

    // Verify environment variables
    expect(config.vars).toEqual({
      API_KEY: 'secret',
      DEBUG: 'true',
    })

    // Verify linked data properties are excluded
    expect(config.$type).toBeUndefined()
    expect(config.$id).toBeUndefined()
  })

  it('should handle queue configurations correctly', async () => {
    const workerContent = `---
$type: Worker
name: queue-worker
main: src/index.ts
compatibility_date: 2025-10-04
queues:
  producers:
    - queue: events
      binding: EVENTS_QUEUE
    - queue: tasks
      binding: TASKS_QUEUE
  consumers:
    - queue: events
      dead_letter_queue: events-dlq
      max_retries: 3
      max_batch_size: 10
      max_batch_timeout: 30
      retry_delay: 300
---

# Queue Worker
`

    await writeFile(workerPath, workerContent, 'utf-8')

    const worker = await parseWorker(workerPath)
    const config = extractWranglerConfig(worker)

    // Verify queue configuration
    expect(config.queues).toBeDefined()
    expect(config.queues?.producers).toHaveLength(2)
    expect(config.queues?.consumers).toHaveLength(1)

    // Verify producer config
    expect(config.queues?.producers?.[0]).toEqual({
      queue: 'events',
      binding: 'EVENTS_QUEUE',
    })

    // Verify consumer config
    expect(config.queues?.consumers?.[0]).toEqual({
      queue: 'events',
      dead_letter_queue: 'events-dlq',
      max_retries: 3,
      max_batch_size: 10,
      max_batch_timeout: 30,
      retry_delay: 300,
    })
  })

  it('should handle analytics engine datasets', async () => {
    const workerContent = `---
$type: Worker
name: analytics-worker
main: src/index.ts
compatibility_date: 2025-10-04
analytics_engine_datasets:
  - binding: ANALYTICS
    dataset: queue_operations
---

# Analytics Worker
`

    await writeFile(workerPath, workerContent, 'utf-8')

    const worker = await parseWorker(workerPath)
    const config = extractWranglerConfig(worker)

    expect(config.analytics_engine_datasets).toBeDefined()
    expect(config.analytics_engine_datasets).toHaveLength(1)
    expect(config.analytics_engine_datasets?.[0]).toEqual({
      binding: 'ANALYTICS',
      dataset: 'queue_operations',
    })
  })

  it('should cleanup temporary config files', async () => {
    const workerContent = `---
$type: Worker
name: cleanup-test
main: src/index.ts
compatibility_date: 2025-10-04
---

# Cleanup Test
`

    await writeFile(workerPath, workerContent, 'utf-8')

    const worker = await parseWorker(workerPath)
    configPath = await generateWranglerConfig(worker)

    // Verify file exists
    const beforeCleanup = await readFile(configPath, 'utf-8')
    expect(beforeCleanup).toBeTruthy()

    // Cleanup
    await cleanupWranglerConfig(configPath)

    // Verify file is deleted
    await expect(readFile(configPath, 'utf-8')).rejects.toThrow()
  })

  it('should handle validation errors gracefully', async () => {
    const workerContent = `---
$type: Worker
name: invalid-worker
main: src/index.ts
compatibility_date: invalid-date
---

# Invalid Worker
`

    await writeFile(workerPath, workerContent, 'utf-8')

    const worker = await parseWorker(workerPath)
    const validation = validateWorkerConfig(worker.frontmatter)

    expect(validation.valid).toBe(false)
    expect(validation.errors).toContain('Invalid compatibility_date format: invalid-date (expected YYYY-MM-DD)')
  })

  it('should handle missing required fields', async () => {
    const workerContent = `---
$type: Worker
name: incomplete-worker
---

# Incomplete Worker
`

    await writeFile(workerPath, workerContent, 'utf-8')

    const worker = await parseWorker(workerPath)
    const validation = validateWorkerConfig(worker.frontmatter)

    expect(validation.valid).toBe(false)
    expect(validation.errors).toContain('Missing required field: main')
    expect(validation.errors).toContain('Missing required field: compatibility_date')
  })

  it('should reject non-Worker types', async () => {
    const workerContent = `---
$type: NotAWorker
name: wrong-type
main: src/index.ts
compatibility_date: 2025-10-04
---

# Wrong Type
`

    await writeFile(workerPath, workerContent, 'utf-8')

    await expect(parseWorker(workerPath)).rejects.toThrow('Expected $type: Worker')
  })
})
