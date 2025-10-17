/**
 * Integration Compiler
 *
 * Main compiler that orchestrates parsing, validation, generation, and file writing.
 */

import { join } from 'path'
import { readdir } from 'fs/promises'
import { Integration } from '../schema/integration.js'
import { FrontmatterParser } from '../parser/frontmatter-parser.js'
import { TypesGenerator } from '../generators/types-generator.js'
import { ClientGenerator } from '../generators/client-generator.js'
import { ErrorsGenerator } from '../generators/errors-generator.js'
import { WebhooksGenerator } from '../generators/webhooks-generator.js'
import { IndexGenerator } from '../generators/index-generator.js'
import { ReadmeGenerator } from '../generators/readme-generator.js'
import { TestsGenerator } from '../generators/tests-generator.js'
import { FileWriter } from './file-writer.js'

export interface CompileResult {
  integration: Integration
  filesGenerated: string[]
  linesOfCode: number
  success: boolean
  error?: string
}

/**
 * Integration Compiler class
 *
 * Compiles MDXLD Integration definitions into TypeScript code.
 */
export class IntegrationCompiler {
  private parser: FrontmatterParser
  private typesGenerator: TypesGenerator
  private clientGenerator: ClientGenerator
  private errorsGenerator: ErrorsGenerator
  private webhooksGenerator: WebhooksGenerator
  private indexGenerator: IndexGenerator
  private readmeGenerator: ReadmeGenerator
  private testsGenerator: TestsGenerator
  private fileWriter: FileWriter

  constructor() {
    this.parser = new FrontmatterParser()
    this.typesGenerator = new TypesGenerator()
    this.clientGenerator = new ClientGenerator()
    this.errorsGenerator = new ErrorsGenerator()
    this.webhooksGenerator = new WebhooksGenerator()
    this.indexGenerator = new IndexGenerator()
    this.readmeGenerator = new ReadmeGenerator()
    this.testsGenerator = new TestsGenerator()
    this.fileWriter = new FileWriter()
  }

  /**
   * Compile an MDX Integration file to TypeScript
   *
   * @param mdxPath - Path to MDX file
   * @param outputDir - Output directory
   * @returns Compile result
   */
  async compile(mdxPath: string, outputDir: string): Promise<CompileResult> {
    try {
      // Parse Integration definition
      const integration = await this.parser.parseFile(mdxPath)

      // Generate all files
      const files = new Map<string, string>()

      // types.ts
      const typesCode = this.typesGenerator.generate(integration)
      files.set(join(outputDir, 'types.ts'), typesCode)

      // client.ts
      const clientCode = this.clientGenerator.generate(integration)
      files.set(join(outputDir, 'client.ts'), clientCode)

      // errors.ts
      const errorsCode = this.errorsGenerator.generate(integration)
      files.set(join(outputDir, 'errors.ts'), errorsCode)

      // webhooks.ts (if enabled)
      const webhooksCode = this.webhooksGenerator.generate(integration)
      if (webhooksCode) {
        files.set(join(outputDir, 'webhooks.ts'), webhooksCode)
      }

      // index.ts
      const indexCode = this.indexGenerator.generate(integration)
      files.set(join(outputDir, 'index.ts'), indexCode)

      // README.md
      const readmeCode = this.readmeGenerator.generate(integration)
      files.set(join(outputDir, 'README.md'), readmeCode)

      // tests.test.ts (if enabled)
      const testsCode = this.testsGenerator.generate(integration)
      if (testsCode) {
        files.set(join(outputDir, `${integration.service.toLowerCase()}.test.ts`), testsCode)
      }

      // Write all files
      const results = await this.fileWriter.writeFiles(files)

      return {
        integration,
        filesGenerated: FileWriter.getFilePaths(results),
        linesOfCode: FileWriter.calculateTotalLOC(results),
        success: true,
      }
    } catch (error) {
      return {
        integration: { $id: mdxPath } as Integration,
        filesGenerated: [],
        linesOfCode: 0,
        success: false,
        error: error instanceof Error ? error.message : String(error),
      }
    }
  }

  /**
   * Compile multiple Integration files
   *
   * @param integrationsDir - Directory containing MDX files
   * @param outputDir - Base output directory
   * @returns Array of compile results
   */
  async compileAll(integrationsDir: string, outputDir: string): Promise<CompileResult[]> {
    const results: CompileResult[] = []

    // Find all MDX files
    const files = await this.findMDXFiles(integrationsDir)

    // Compile each file
    for (const file of files) {
      const integrationName = this.extractIntegrationName(file)
      const integrationOutputDir = join(outputDir, integrationName)

      const result = await this.compile(file, integrationOutputDir)
      results.push(result)
    }

    return results
  }

  /**
   * Validate Integration definition without compiling
   *
   * @param mdxPath - Path to MDX file
   * @returns Validation result
   */
  async validate(mdxPath: string): Promise<{ valid: boolean; errors?: string[]; integration?: Integration }> {
    try {
      const integration = await this.parser.parseFile(mdxPath)
      return { valid: true, integration }
    } catch (error) {
      return {
        valid: false,
        errors: [error instanceof Error ? error.message : String(error)],
      }
    }
  }

  /**
   * Get Integration summary
   *
   * @param mdxPath - Path to MDX file
   * @returns Integration summary
   */
  async getSummary(mdxPath: string) {
    const integration = await this.parser.parseFile(mdxPath)
    return this.parser.getSummary(integration)
  }

  /**
   * Find all MDX files in directory
   *
   * @param dir - Directory path
   * @returns Array of MDX file paths
   */
  private async findMDXFiles(dir: string): Promise<string[]> {
    const files: string[] = []

    try {
      const entries = await readdir(dir, { withFileTypes: true })

      for (const entry of entries) {
        const fullPath = join(dir, entry.name)

        if (entry.isDirectory()) {
          // Recursively search subdirectories
          const subFiles = await this.findMDXFiles(fullPath)
          files.push(...subFiles)
        } else if (entry.isFile() && (entry.name.endsWith('.mdx') || entry.name.endsWith('.md'))) {
          files.push(fullPath)
        }
      }
    } catch (error) {
      throw new Error(`Failed to read directory ${dir}: ${error instanceof Error ? error.message : String(error)}`)
    }

    return files
  }

  /**
   * Extract Integration name from file path
   *
   * @param filePath - File path
   * @returns Integration name
   */
  private extractIntegrationName(filePath: string): string {
    const parts = filePath.split('/')
    const fileName = parts[parts.length - 1]
    return fileName.replace(/\.(mdx?|md)$/, '')
  }

  /**
   * Print compilation report
   *
   * @param results - Array of compile results
   */
  static printReport(results: CompileResult[]): void {
    console.log('\n=== Integration Compilation Report ===\n')

    const successful = results.filter((r) => r.success)
    const failed = results.filter((r) => !r.success)

    console.log(`Total Integrations: ${results.length}`)
    console.log(`✓ Successful: ${successful.length}`)
    console.log(`✗ Failed: ${failed.length}`)
    console.log('')

    if (successful.length > 0) {
      console.log('Successful Compilations:')
      for (const result of successful) {
        console.log(`  ✓ ${result.integration.name} (${result.filesGenerated.length} files, ${result.linesOfCode} LOC)`)
      }
      console.log('')
    }

    if (failed.length > 0) {
      console.log('Failed Compilations:')
      for (const result of failed) {
        console.log(`  ✗ ${result.integration.$id}`)
        console.log(`    Error: ${result.error}`)
      }
      console.log('')
    }

    const totalLOC = successful.reduce((sum, r) => sum + r.linesOfCode, 0)
    const totalFiles = successful.reduce((sum, r) => sum + r.filesGenerated.length, 0)

    console.log(`Total Generated:`)
    console.log(`  Files: ${totalFiles}`)
    console.log(`  Lines of Code: ${totalLOC}`)
    console.log('')
  }
}
