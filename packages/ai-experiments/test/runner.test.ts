import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createRunner } from '../src/runner'
import * as fs from 'fs'
import * as path from 'path'
import { UserConfig } from 'vitest/config'

vi.mock('fs')
vi.mock('path')

const mockReporter = {
  onFinished: vi.fn(),
}

describe('createRunner', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.mocked(path.join).mockImplementation((...args) => args.join('/'))
    mockReporter.onFinished.mockClear()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should return a function that returns a Vitest config', () => {
    const runner = createRunner()
    expect(typeof runner).toBe('function')

    const config = runner({ mode: 'test' } as any) as UserConfig
    expect(config).toHaveProperty('test')
  })

  it('should use default values when no config is provided', () => {
    const runner = createRunner()
    const config = runner({ mode: 'test' } as any) as UserConfig

    expect(config.test).toHaveProperty('include')
    expect(config.test?.include).toContain('**/*experiment*.(js|ts|mjs|cjs)')
    expect(config.test).toHaveProperty('watch', false)
  })

  it('should use custom values when config is provided', () => {
    const customConfig = {
      outputDir: 'custom/output',
      testMatch: ['**/*.custom.ts'],
      watch: true,
    }

    const runner = createRunner(customConfig)
    const config = runner({ mode: 'test' } as any) as UserConfig

    expect(config.test).toHaveProperty('include')
    expect(config.test?.include).toContain('**/*.custom.ts')
    expect(config.test).toHaveProperty('watch', true)
  })

  it('should create output directory if it does not exist', () => {
    vi.mocked(fs.existsSync).mockReturnValue(false)

    const runner = createRunner()
    const config = runner({ mode: 'test' } as any) as UserConfig

    expect(config.test).toBeDefined()
    expect(config.test?.reporters).toBeDefined()

    const customReporter = createMarkdownReporter('.ai/experiments')
    customReporter.onFinished([], [])

    expect(fs.mkdirSync).toHaveBeenCalledWith('.ai/experiments', { recursive: true })
  })

  it('should create README.md in output directory if it does not exist', () => {
    vi.mocked(fs.existsSync).mockImplementation((path) => {
      if (path === '.ai/experiments') return true
      if (path === '.ai/experiments/README.md') return false
      return false
    })

    const customReporter = createMarkdownReporter('.ai/experiments')
    customReporter.onFinished([], [])

    expect(fs.writeFileSync).toHaveBeenCalledWith('.ai/experiments/README.md', expect.stringContaining('Experiment Results'))
  })

  it('should not create README.md if it already exists', () => {
    vi.mocked(fs.existsSync).mockReturnValue(true)

    const customReporter = createMarkdownReporter('.ai/experiments')
    customReporter.onFinished([], [])

    expect(fs.writeFileSync).not.toHaveBeenCalled()
  })

  it('should handle custom output directory paths', () => {
    vi.mocked(fs.existsSync).mockReturnValue(false)

    const customReporter = createMarkdownReporter('custom/path/experiments')
    customReporter.onFinished([], [])

    expect(fs.mkdirSync).toHaveBeenCalledWith('custom/path/experiments', { recursive: true })
    expect(fs.writeFileSync).toHaveBeenCalledWith('custom/path/experiments/README.md', expect.stringContaining('Experiment Results'))
  })
})

function createMarkdownReporter(outputDir: string) {
  return {
    onFinished(_files: any, _errors: any) {
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true })
      }

      const placeholderContent = `# Experiment Results\n\nResults will be available here after running experiments.\n`
      const outputPath = path.join(outputDir, 'README.md')

      if (!fs.existsSync(outputPath)) {
        fs.writeFileSync(outputPath, placeholderContent)
      }
    },
  }
}
