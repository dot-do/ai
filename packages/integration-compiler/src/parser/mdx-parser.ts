/**
 * MDX Parser
 *
 * Parse MDX files and extract frontmatter + content.
 * Supports YAML frontmatter with Integration metadata.
 */

import { readFile } from 'fs/promises'
import matter from 'gray-matter'
import { parse as parseYaml } from 'yaml'

export interface ParseResult {
  frontmatter: any
  content: string
}

/**
 * MDX Parser class
 *
 * Parses MDX files and extracts YAML frontmatter and content.
 */
export class MDXParser {
  /**
   * Parse an MDX file from disk
   *
   * @param filePath - Path to the MDX file
   * @returns Parsed frontmatter and content
   * @throws Error if file cannot be read or parsed
   */
  async parse(filePath: string): Promise<ParseResult> {
    try {
      const fileContent = await readFile(filePath, 'utf-8')
      return this.parseContent(fileContent)
    } catch (error) {
      throw new Error(`Failed to parse MDX file ${filePath}: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * Parse MDX content string
   *
   * @param mdxContent - Raw MDX content with frontmatter
   * @returns Parsed frontmatter and content
   * @throws Error if content cannot be parsed
   */
  parseContent(mdxContent: string): ParseResult {
    try {
      // Use gray-matter to extract frontmatter
      const { data, content } = matter(mdxContent)

      // Validate that we have frontmatter
      if (!data || Object.keys(data).length === 0) {
        throw new Error('No frontmatter found in MDX content')
      }

      return {
        frontmatter: data,
        content: content.trim(),
      }
    } catch (error) {
      throw new Error(`Failed to parse MDX content: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * Parse YAML string to object
   *
   * @param yamlString - Raw YAML string
   * @returns Parsed object
   * @throws Error if YAML is invalid
   */
  parseYaml(yamlString: string): any {
    try {
      return parseYaml(yamlString)
    } catch (error) {
      throw new Error(`Failed to parse YAML: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * Check if file is an MDX file
   *
   * @param filePath - Path to check
   * @returns True if file has .mdx extension
   */
  isMDXFile(filePath: string): boolean {
    return filePath.endsWith('.mdx') || filePath.endsWith('.md')
  }

  /**
   * Extract Integration ID from frontmatter
   *
   * @param frontmatter - Parsed frontmatter object
   * @returns Integration ID or undefined
   */
  extractIntegrationId(frontmatter: any): string | undefined {
    return frontmatter.$id || frontmatter.id
  }

  /**
   * Extract Integration type from frontmatter
   *
   * @param frontmatter - Parsed frontmatter object
   * @returns Integration type or undefined
   */
  extractIntegrationType(frontmatter: any): string | undefined {
    return frontmatter.$type || frontmatter.type
  }

  /**
   * Validate that frontmatter contains Integration metadata
   *
   * @param frontmatter - Parsed frontmatter object
   * @returns True if frontmatter appears to be an Integration definition
   */
  isIntegrationFrontmatter(frontmatter: any): boolean {
    const type = this.extractIntegrationType(frontmatter)
    return type === 'Integration' && !!this.extractIntegrationId(frontmatter)
  }
}
