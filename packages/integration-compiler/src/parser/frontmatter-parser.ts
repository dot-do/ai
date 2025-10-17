/**
 * Frontmatter Parser
 *
 * Extract and validate Integration definitions from MDX frontmatter.
 */

import { Integration } from '../schema/integration.js'
import { validateIntegration, safeValidateIntegration } from '../schema/validator.js'
import { MDXParser } from './mdx-parser.js'

export interface ParsedIntegration {
  integration: Integration
  valid: boolean
  errors?: string[]
}

/**
 * Frontmatter Parser class
 *
 * Extracts and validates Integration definitions from MDX frontmatter.
 */
export class FrontmatterParser {
  private mdxParser: MDXParser

  constructor() {
    this.mdxParser = new MDXParser()
  }

  /**
   * Parse an MDX file and extract Integration definition
   *
   * @param filePath - Path to the MDX file
   * @returns Parsed and validated Integration
   * @throws Error if file cannot be parsed or validation fails
   */
  async parseFile(filePath: string): Promise<Integration> {
    const { frontmatter } = await this.mdxParser.parse(filePath)
    return this.parseIntegration(frontmatter)
  }

  /**
   * Parse frontmatter object into Integration
   *
   * @param frontmatter - Parsed frontmatter object
   * @returns Validated Integration
   * @throws Error if validation fails
   */
  parseIntegration(frontmatter: any): Integration {
    // Validate using Zod schema
    const result = validateIntegration(frontmatter)
    return result as Integration
  }

  /**
   * Safely parse frontmatter into Integration
   *
   * @param frontmatter - Parsed frontmatter object
   * @returns Parsed Integration with validation status
   */
  safeParseIntegration(frontmatter: any): ParsedIntegration {
    const result = safeValidateIntegration(frontmatter)

    if (result.success) {
      return {
        integration: result.data as Integration,
        valid: true,
      }
    } else {
      // Extract error messages from Zod errors
      const errors = result.error.errors.map((err) => {
        const path = err.path.join('.')
        return `${path}: ${err.message}`
      })

      // Return partial data (may be incomplete)
      return {
        integration: frontmatter as Integration,
        valid: false,
        errors,
      }
    }
  }

  /**
   * Validate an Integration definition
   *
   * @param integration - Integration to validate
   * @returns Validation result
   */
  validate(integration: any): { valid: boolean; errors?: string[] } {
    const result = safeValidateIntegration(integration)

    if (result.success) {
      return { valid: true }
    } else {
      const errors = result.error.errors.map((err) => {
        const path = err.path.join('.')
        return `${path}: ${err.message}`
      })
      return { valid: false, errors }
    }
  }

  /**
   * Extract resource names from Integration
   *
   * @param integration - Integration definition
   * @returns Array of resource names
   */
  extractResourceNames(integration: Integration): string[] {
    return integration.resources.map((r) => r.name)
  }

  /**
   * Extract operation types from Integration
   *
   * @param integration - Integration definition
   * @returns Array of unique operation types
   */
  extractOperationTypes(integration: Integration): string[] {
    const types = new Set<string>()
    for (const resource of integration.resources) {
      for (const operation of resource.operations) {
        if (operation.type) {
          types.add(operation.type)
        }
      }
    }
    return Array.from(types)
  }

  /**
   * Check if Integration has webhooks enabled
   *
   * @param integration - Integration definition
   * @returns True if webhooks are enabled
   */
  hasWebhooks(integration: Integration): boolean {
    return integration.webhooks?.enabled === true
  }

  /**
   * Check if Integration has tests enabled
   *
   * @param integration - Integration definition
   * @returns True if tests are enabled
   */
  hasTests(integration: Integration): boolean {
    return integration.tests?.enabled === true
  }

  /**
   * Get Integration metadata summary
   *
   * @param integration - Integration definition
   * @returns Metadata summary
   */
  getSummary(integration: Integration) {
    return {
      id: integration.$id,
      name: integration.name,
      service: integration.service,
      category: integration.category,
      resourceCount: integration.resources.length,
      operationCount: integration.resources.reduce((sum, r) => sum + r.operations.length, 0),
      hasWebhooks: this.hasWebhooks(integration),
      hasTests: this.hasTests(integration),
      authType: integration.auth.type,
    }
  }
}
