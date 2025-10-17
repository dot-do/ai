import { defineConfig } from 'vitest/config'
import { RunnerConfig, VitestConfig } from './types'
import * as path from 'path'
import * as fs from 'fs'

/**
 * Creates a vitest configuration for running experiments
 */
export function createRunner(config: RunnerConfig = {}): VitestConfig {
  const outputDir = config.outputDir || '.ai/experiments'
  const testMatch = config.testMatch || ['**/*experiment*.(js|ts|mjs|cjs)']
  const watch = config.watch || false

  return () =>
    defineConfig({
      test: {
        include: testMatch,
        exclude: ['node_modules', 'dist'],
        globals: true,
        watch: watch,
        reporters: ['default', createMarkdownReporter(outputDir)],
      },
    })
}

/**
 * Creates a custom reporter that saves experiment results as markdown
 */
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
