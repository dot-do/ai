/**
 * Tests for wrangler integration
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { extractWranglerConfig, generateWranglerConfig, cleanupWranglerConfig, checkWranglerInstalled } from '../wrangler'
import type { MDXLDWorker, WorkerFrontmatter } from '../types'

// Mock fs/promises
vi.mock('fs/promises', () => ({
  writeFile: vi.fn(),
  unlink: vi.fn(),
}))

// Mock which
vi.mock('which', () => ({
  default: vi.fn(),
}))

import { writeFile, unlink } from 'fs/promises'
import which from 'which'

describe('extractWranglerConfig', () => {
  it('should extract wrangler-specific fields', () => {
    const worker: MDXLDWorker = {
      frontmatter: {
        $type: 'Worker',
        $id: 'https://workers.do/test',
        $context: 'https://schema.org',
        name: 'test-worker',
        main: 'src/index.ts',
        compatibility_date: '2025-10-04',
        compatibility_flags: ['nodejs_compat'],
      },
      content: '# Test',
      filePath: '/path/to/worker.mdx',
    }

    const config = extractWranglerConfig(worker)

    expect(config.name).toBe('test-worker')
    expect(config.main).toBe('src/index.ts')
    expect(config.compatibility_date).toBe('2025-10-04')
    expect(config.compatibility_flags).toEqual(['nodejs_compat'])
    expect(config).toHaveProperty('$schema')
  })

  it('should not include linked data fields', () => {
    const worker: MDXLDWorker = {
      frontmatter: {
        $type: 'Worker',
        $id: 'https://workers.do/test',
        name: 'test-worker',
        main: 'src/index.ts',
        compatibility_date: '2025-10-04',
      },
      content: '# Test',
      filePath: '/path/to/worker.mdx',
    }

    const config = extractWranglerConfig(worker)

    expect(config).not.toHaveProperty('$type')
    expect(config).not.toHaveProperty('$id')
  })

  it('should handle service bindings', () => {
    const worker: MDXLDWorker = {
      frontmatter: {
        $type: 'Worker',
        name: 'test-worker',
        main: 'src/index.ts',
        compatibility_date: '2025-10-04',
        services: [
          { binding: 'API', service: 'api' },
          { binding: 'DB', service: 'db' },
        ],
      },
      content: '# Test',
      filePath: '/path/to/worker.mdx',
    }

    const config = extractWranglerConfig(worker)

    expect(config.services).toHaveLength(2)
    expect(config.services?.[0].binding).toBe('API')
  })

  it('should handle environment variables', () => {
    const worker: MDXLDWorker = {
      frontmatter: {
        $type: 'Worker',
        name: 'test-worker',
        main: 'src/index.ts',
        compatibility_date: '2025-10-04',
        vars: {
          API_KEY: 'secret',
          DEBUG: 'true',
        },
      },
      content: '# Test',
      filePath: '/path/to/worker.mdx',
    }

    const config = extractWranglerConfig(worker)

    expect(config.vars).toEqual({
      API_KEY: 'secret',
      DEBUG: 'true',
    })
  })
})

describe('generateWranglerConfig', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should write config file to worker directory', async () => {
    const worker: MDXLDWorker = {
      frontmatter: {
        $type: 'Worker',
        name: 'test-worker',
        main: 'src/index.ts',
        compatibility_date: '2025-10-04',
      },
      content: '# Test',
      filePath: '/path/to/workers/test/worker.mdx',
    }

    vi.mocked(writeFile).mockResolvedValue(undefined)

    const configPath = await generateWranglerConfig(worker)

    expect(configPath).toBe('/path/to/workers/test/.wrangler.mdxe.jsonc')
    expect(writeFile).toHaveBeenCalledWith('/path/to/workers/test/.wrangler.mdxe.jsonc', expect.stringContaining('"name": "test-worker"'), 'utf-8')
  })
})

describe('cleanupWranglerConfig', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should delete the config file', async () => {
    vi.mocked(unlink).mockResolvedValue(undefined)

    await cleanupWranglerConfig('/path/to/.wrangler.mdxe.jsonc')

    expect(unlink).toHaveBeenCalledWith('/path/to/.wrangler.mdxe.jsonc')
  })

  it('should silently ignore ENOENT errors', async () => {
    const error: any = new Error('File not found')
    error.code = 'ENOENT'
    vi.mocked(unlink).mockRejectedValue(error)

    // Should not throw
    await expect(cleanupWranglerConfig('/path/to/.wrangler.mdxe.jsonc')).resolves.toBeUndefined()
  })

  it('should log other errors but not throw', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.mocked(unlink).mockRejectedValue(new Error('Permission denied'))

    await cleanupWranglerConfig('/path/to/.wrangler.mdxe.jsonc')

    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })
})

describe('checkWranglerInstalled', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return true if wrangler is installed', async () => {
    vi.mocked(which).mockResolvedValue('/usr/local/bin/wrangler')

    const result = await checkWranglerInstalled()

    expect(result).toBe(true)
  })

  it('should return false if wrangler is not installed', async () => {
    vi.mocked(which).mockRejectedValue(new Error('not found'))

    const result = await checkWranglerInstalled()

    expect(result).toBe(false)
  })
})
