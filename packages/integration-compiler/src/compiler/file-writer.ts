/**
 * File Writer
 *
 * Write generated files to disk with formatting.
 */

import { writeFile, mkdir } from 'fs/promises'
import { dirname } from 'path'
import { format as prettierFormat } from 'prettier'

export interface WriteResult {
  filePath: string
  linesOfCode: number
}

/**
 * File Writer class
 *
 * Writes generated code to files with automatic formatting.
 */
export class FileWriter {
  /**
   * Write code to file
   *
   * @param filePath - Destination file path
   * @param content - File content
   * @param shouldFormat - Whether to format with Prettier (default: true)
   * @returns Write result with file path and LOC
   */
  async writeFile(filePath: string, content: string, shouldFormat: boolean = true): Promise<WriteResult> {
    // Ensure directory exists
    await this.ensureDirectory(dirname(filePath))

    // Format content if requested
    let finalContent = content
    if (shouldFormat) {
      finalContent = await this.formatCode(filePath, content)
    }

    // Write file
    await writeFile(filePath, finalContent, 'utf-8')

    // Count lines
    const linesOfCode = this.countLines(finalContent)

    return {
      filePath,
      linesOfCode,
    }
  }

  /**
   * Write multiple files
   *
   * @param files - Map of file paths to content
   * @param shouldFormat - Whether to format with Prettier (default: true)
   * @returns Array of write results
   */
  async writeFiles(files: Map<string, string>, shouldFormat: boolean = true): Promise<WriteResult[]> {
    const results: WriteResult[] = []

    for (const [filePath, content] of files.entries()) {
      const result = await this.writeFile(filePath, content, shouldFormat)
      results.push(result)
    }

    return results
  }

  /**
   * Ensure directory exists
   *
   * @param dirPath - Directory path
   */
  private async ensureDirectory(dirPath: string): Promise<void> {
    try {
      await mkdir(dirPath, { recursive: true })
    } catch (error) {
      // Ignore if directory already exists
      if ((error as any).code !== 'EEXIST') {
        throw error
      }
    }
  }

  /**
   * Format code with Prettier
   *
   * @param filePath - File path (for parser detection)
   * @param content - Code content
   * @returns Formatted code
   */
  private async formatCode(filePath: string, content: string): Promise<string> {
    try {
      const parser = this.detectParser(filePath)

      return await prettierFormat(content, {
        parser,
        singleQuote: true,
        semi: false,
        tabWidth: 2,
        printWidth: 160,
        trailingComma: 'es5',
      })
    } catch (error) {
      // If formatting fails, return original content
      console.warn(`Failed to format ${filePath}:`, error)
      return content
    }
  }

  /**
   * Detect Prettier parser from file extension
   *
   * @param filePath - File path
   * @returns Parser name
   */
  private detectParser(filePath: string): string {
    if (filePath.endsWith('.ts')) {
      return 'typescript'
    } else if (filePath.endsWith('.js')) {
      return 'babel'
    } else if (filePath.endsWith('.json')) {
      return 'json'
    } else if (filePath.endsWith('.md')) {
      return 'markdown'
    }

    // Default to typescript
    return 'typescript'
  }

  /**
   * Count lines of code
   *
   * @param content - File content
   * @returns Number of lines
   */
  private countLines(content: string): number {
    return content.split('\n').length
  }

  /**
   * Calculate total lines of code
   *
   * @param results - Array of write results
   * @returns Total LOC
   */
  static calculateTotalLOC(results: WriteResult[]): number {
    return results.reduce((sum, result) => sum + result.linesOfCode, 0)
  }

  /**
   * Get file paths from results
   *
   * @param results - Array of write results
   * @returns Array of file paths
   */
  static getFilePaths(results: WriteResult[]): string[] {
    return results.map((result) => result.filePath)
  }
}
