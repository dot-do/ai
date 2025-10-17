/**
 * Index Generator
 *
 * Generate index.ts barrel export file.
 */

import { Integration } from '../schema/integration.js'

/**
 * Index Generator class
 *
 * Generates index.ts files that re-export all Integration components.
 */
export class IndexGenerator {
  /**
   * Generate index.ts from Integration definition
   *
   * @param integration - Integration definition
   * @returns Generated TypeScript code
   */
  generate(integration: Integration): string {
    const sections: string[] = []

    // File header
    sections.push(this.generateHeader(integration))

    // Exports
    sections.push(this.generateExports(integration))

    return sections.join('\n\n')
  }

  /**
   * Generate file header
   */
  private generateHeader(integration: Integration): string {
    return `/**
 * ${integration.name} Integration
 *
 * Auto-generated Integration exports for ${integration.name}.
 * Generated from MDXLD Integration definition.
 *
 * @see ${integration.$id}
 */`
  }

  /**
   * Generate exports
   */
  private generateExports(integration: Integration): string {
    const lines: string[] = []

    // Export client
    lines.push('export { ')
    lines.push(`  ${this.getServiceName(integration)}Client,`)
    lines.push(`  ${this.getServiceName(integration)}ClientOptions,`)
    lines.push("} from './client.js'")

    // Export types
    lines.push("export type * from './types.js'")

    // Export errors
    lines.push('export { ')
    lines.push(`  ${this.getServiceName(integration)}Error,`)
    lines.push(`  ${this.getServiceName(integration)}ErrorType,`)
    lines.push("} from './errors.js'")

    // Export webhooks if enabled
    if (integration.webhooks?.enabled) {
      lines.push('export {')
      lines.push(`  ${this.getServiceName(integration)}WebhookHandler,`)
      lines.push('  WebhookEventRouter,')
      lines.push('  WEBHOOK_EVENTS,')
      lines.push('  type WebhookEvent,')
      lines.push('  type WebhookEventType,')
      lines.push("} from './webhooks.js'")
    }

    return lines.join('\n')
  }

  /**
   * Convert to PascalCase
   */
  private pascalCase(str: string): string {
    return str.replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase()).replace(/^[a-z]/, (chr) => chr.toUpperCase())
  }

  /**
   * Get service name for identifier usage (PascalCase)
   */
  private getServiceName(integration: Integration): string {
    return this.pascalCase(integration.service)
  }
}
