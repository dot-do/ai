/**
 * Tests for MDXLD Worker parser
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { readFile } from 'fs/promises'
import { parseWorker, validateWorkerConfig } from '../parser'
import type { WorkerFrontmatter } from '../types'

// Mock fs/promises
vi.mock('fs/promises', () => ({
  readFile: vi.fn(),
}))

// Mock mdxld
vi.mock('mdxld', () => ({
  parseMDXLD: vi.fn((content: string) => {
    // Simple mock parser
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
    if (!match) {
      return { data: {}, content }
    }
    // Parse YAML-like frontmatter
    const frontmatter = match[1]
    const body = match[2]
    const data: Record<string, any> = {}
    frontmatter.split('\n').forEach((line) => {
      const [key, ...valueParts] = line.split(':')
      if (key && valueParts.length > 0) {
        data[key.trim()] = valueParts.join(':').trim()
      }
    })
    return { data, content: body }
  }),
  validateLinkedData: vi.fn(() => ({ valid: true, errors: [] })),
}))

describe('parseWorker', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should parse a valid MDXLD worker file', async () => {
    const mockContent = `---
$type: Worker
name: test-worker
main: src/index.ts
compatibility_date: 2025-10-04
---
# Test Worker`

    vi.mocked(readFile).mockResolvedValue(mockContent)

    const worker = await parseWorker('/path/to/worker.mdx')

    expect(worker.frontmatter.$type).toBe('Worker')
    expect(worker.frontmatter.name).toBe('test-worker')
    expect(worker.frontmatter.main).toBe('src/index.ts')
    expect(worker.filePath).toBe('/path/to/worker.mdx')
    expect(worker.content).toContain('# Test Worker')
  })

  it('should throw error if $type is not Worker', async () => {
    const mockContent = `---
$type: NotWorker
name: test
---
Content`

    vi.mocked(readFile).mockResolvedValue(mockContent)

    await expect(parseWorker('/path/to/worker.mdx')).rejects.toThrow('Expected $type: Worker')
  })

  it('should throw error if file cannot be read', async () => {
    vi.mocked(readFile).mockRejectedValue(new Error('File not found'))

    await expect(parseWorker('/nonexistent.mdx')).rejects.toThrow('File not found')
  })
})

describe('validateWorkerConfig', () => {
  it('should validate a complete worker config', () => {
    const config: WorkerFrontmatter = {
      $type: 'Worker',
      name: 'test-worker',
      main: 'src/index.ts',
      compatibility_date: '2025-10-04',
    }

    const result = validateWorkerConfig(config)

    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('should fail if name is missing', () => {
    const config: WorkerFrontmatter = {
      $type: 'Worker',
      main: 'src/index.ts',
      compatibility_date: '2025-10-04',
    } as any

    const result = validateWorkerConfig(config)

    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Missing required field: name')
  })

  it('should fail if main is missing', () => {
    const config: WorkerFrontmatter = {
      $type: 'Worker',
      name: 'test',
      compatibility_date: '2025-10-04',
    } as any

    const result = validateWorkerConfig(config)

    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Missing required field: main')
  })

  it('should fail if compatibility_date is missing', () => {
    const config: WorkerFrontmatter = {
      $type: 'Worker',
      name: 'test',
      main: 'src/index.ts',
    } as any

    const result = validateWorkerConfig(config)

    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Missing required field: compatibility_date')
  })

  it('should fail if compatibility_date has invalid format', () => {
    const config: WorkerFrontmatter = {
      $type: 'Worker',
      name: 'test',
      main: 'src/index.ts',
      compatibility_date: '10-04-2025',
    }

    const result = validateWorkerConfig(config)

    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Invalid compatibility_date format: 10-04-2025 (expected YYYY-MM-DD)')
  })

  it('should pass with valid date format', () => {
    const config: WorkerFrontmatter = {
      $type: 'Worker',
      name: 'test',
      main: 'src/index.ts',
      compatibility_date: '2025-10-04',
    }

    const result = validateWorkerConfig(config)

    expect(result.valid).toBe(true)
  })

  it('should allow optional fields', () => {
    const config: WorkerFrontmatter = {
      $type: 'Worker',
      name: 'test',
      main: 'src/index.ts',
      compatibility_date: '2025-10-04',
      $id: 'https://workers.do/test',
      $context: 'https://schema.org',
      compatibility_flags: ['nodejs_compat'],
    }

    const result = validateWorkerConfig(config)

    expect(result.valid).toBe(true)
  })
})
