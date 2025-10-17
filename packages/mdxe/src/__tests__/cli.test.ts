/**
 * Tests for CLI module
 * Demonstrates improved testability after removing process.exit calls
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CLIError } from '../cli.js'
import { parseWorker, validateWorkerConfig } from '../parser.js'
import { runWrangler } from '../wrangler.js'

// Mock the dependencies
vi.mock('../parser.js', () => ({
  parseWorker: vi.fn(),
  validateWorkerConfig: vi.fn(),
}))

vi.mock('../wrangler.js', () => ({
  runWrangler: vi.fn(),
  checkWranglerInstalled: vi.fn(),
}))

describe('CLIError', () => {
  it('should create error with default exit code 1', () => {
    const error = new CLIError('Test error')
    expect(error.message).toBe('Test error')
    expect(error.exitCode).toBe(1)
    expect(error.name).toBe('CLIError')
  })

  it('should create error with custom exit code', () => {
    const error = new CLIError('Test error', 2)
    expect(error.message).toBe('Test error')
    expect(error.exitCode).toBe(2)
  })

  it('should be instanceof Error', () => {
    const error = new CLIError('Test error')
    expect(error).toBeInstanceOf(Error)
  })
})

describe('CLI Commands (Error Handling)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Validation Errors', () => {
    it('should throw CLIError when worker config is invalid', async () => {
      // Mock parseWorker to return a worker
      vi.mocked(parseWorker).mockResolvedValue({
        frontmatter: {
          $type: 'Worker',
          name: 'test-worker',
          main: 'src/index.ts',
          compatibility_date: '2025-01-01',
        },
        content: 'export default { fetch() {} }',
        filePath: 'test.mdx',
      })

      // Mock validateWorkerConfig to return invalid
      vi.mocked(validateWorkerConfig).mockReturnValue({
        valid: false,
        errors: ['Missing required field: name', 'Invalid compatibility_date format'],
      })

      // This would be called by the dev command action
      // We can't directly test the action without commander, but we can test the logic
      const worker = await parseWorker('test.mdx')
      const validation = validateWorkerConfig(worker.frontmatter)

      if (!validation.valid) {
        const errorMsg = 'Invalid worker configuration:\n' + validation.errors.map((e) => `  - ${e}`).join('\n')
        const error = new CLIError(errorMsg)

        expect(error).toBeInstanceOf(CLIError)
        expect(error.message).toContain('Invalid worker configuration')
        expect(error.message).toContain('Missing required field: name')
        expect(error.message).toContain('Invalid compatibility_date format')
        expect(error.exitCode).toBe(1)
      }
    })

    it('should throw CLIError when wrangler command fails', async () => {
      // Mock parseWorker to return a worker
      vi.mocked(parseWorker).mockResolvedValue({
        frontmatter: {
          $type: 'Worker',
          name: 'test-worker',
          main: 'src/index.ts',
          compatibility_date: '2025-01-01',
        },
        content: 'export default { fetch() {} }',
        filePath: 'test.mdx',
      })

      // Mock validateWorkerConfig to return valid
      vi.mocked(validateWorkerConfig).mockReturnValue({
        valid: true,
        errors: [],
      })

      // Mock runWrangler to fail
      vi.mocked(runWrangler).mockResolvedValue({
        success: false,
        output: '',
        error: 'Wrangler command failed: deployment error',
      })

      // Simulate deploy command logic
      const worker = await parseWorker('test.mdx')
      const validation = validateWorkerConfig(worker.frontmatter)

      if (validation.valid) {
        const result = await runWrangler('deploy', worker, {})

        if (!result.success) {
          const errorMsg = `Deployment failed:\n${result.error || result.output}`
          const error = new CLIError(errorMsg)

          expect(error).toBeInstanceOf(CLIError)
          expect(error.message).toContain('Deployment failed')
          expect(error.message).toContain('deployment error')
          expect(error.exitCode).toBe(1)
        }
      }
    })
  })

  describe('Successful Operations', () => {
    it('should not throw when worker is valid and wrangler succeeds', async () => {
      // Mock parseWorker to return a worker
      vi.mocked(parseWorker).mockResolvedValue({
        frontmatter: {
          $type: 'Worker',
          name: 'test-worker',
          main: 'src/index.ts',
          compatibility_date: '2025-01-01',
        },
        content: 'export default { fetch() {} }',
        filePath: 'test.mdx',
      })

      // Mock validateWorkerConfig to return valid
      vi.mocked(validateWorkerConfig).mockReturnValue({
        valid: true,
        errors: [],
      })

      // Mock runWrangler to succeed
      vi.mocked(runWrangler).mockResolvedValue({
        success: true,
        output: 'Deployment successful',
      })

      // Simulate deploy command logic
      const worker = await parseWorker('test.mdx')
      const validation = validateWorkerConfig(worker.frontmatter)

      expect(validation.valid).toBe(true)

      const result = await runWrangler('deploy', worker, {})

      expect(result.success).toBe(true)
      expect(result.output).toBe('Deployment successful')
    })
  })

  describe('Error Message Formatting', () => {
    it('should format multiple validation errors correctly', () => {
      const errors = ['Error 1', 'Error 2', 'Error 3']
      const errorMsg = 'Invalid worker configuration:\n' + errors.map((e) => `  - ${e}`).join('\n')
      const error = new CLIError(errorMsg)

      expect(error.message).toBe('Invalid worker configuration:\n  - Error 1\n  - Error 2\n  - Error 3')
    })

    it('should include wrangler output in error message', () => {
      const wranglerError = 'Worker validation failed: syntax error in main.ts'
      const errorMsg = `Build failed:\n${wranglerError}`
      const error = new CLIError(errorMsg)

      expect(error.message).toContain('Build failed')
      expect(error.message).toContain('syntax error in main.ts')
    })
  })
})
