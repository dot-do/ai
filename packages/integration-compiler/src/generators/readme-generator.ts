/**
 * README Generator
 *
 * Generate README.md documentation from Integration schema.
 */

import { Integration, Resource, Operation } from '../schema/integration.js'

/**
 * README Generator class
 *
 * Generates README.md files with Integration documentation,
 * usage examples, and API reference.
 */
export class ReadmeGenerator {
  /**
   * Generate README.md from Integration definition
   *
   * @param integration - Integration definition
   * @returns Generated Markdown content
   */
  generate(integration: Integration): string {
    const sections: string[] = []

    // Title and description
    sections.push(this.generateTitle(integration))

    // Installation
    sections.push(this.generateInstallation(integration))

    // Quick start
    sections.push(this.generateQuickStart(integration))

    // Authentication
    sections.push(this.generateAuthentication(integration))

    // Resources
    sections.push(this.generateResources(integration))

    // Error handling
    sections.push(this.generateErrorHandling(integration))

    // Webhooks
    if (integration.webhooks?.enabled) {
      sections.push(this.generateWebhooks(integration))
    }

    // Rate limits
    if (integration.rateLimit) {
      sections.push(this.generateRateLimits(integration))
    }

    // License
    sections.push(this.generateLicense())

    return sections.join('\n\n')
  }

  /**
   * Generate title and description
   */
  private generateTitle(integration: Integration): string {
    return `# ${integration.name} Integration

${integration.description}

**Category**: ${integration.category}
**Service**: ${this.getServiceName(integration)}
**Base URL**: ${integration.baseUrl}

This Integration is auto-generated from MDXLD definition: [${integration.$id}](${integration.$id})`
  }

  /**
   * Generate installation section
   */
  private generateInstallation(integration: Integration): string {
    const packageName = `@dotdo/integration-${integration.service.toLowerCase()}`

    return `## Installation

\`\`\`bash
npm install ${packageName}
\`\`\`

Or with pnpm:

\`\`\`bash
pnpm add ${packageName}
\`\`\``
  }

  /**
   * Generate quick start section
   */
  private generateQuickStart(integration: Integration): string {
    const lines: string[] = []

    lines.push('## Quick Start')
    lines.push('')
    lines.push('```typescript')
    lines.push(`import { ${this.getServiceName(integration)}Client } from '${this.getPackageName(integration)}'`)
    lines.push('')
    lines.push('// Initialize client')
    lines.push(`const client = new ${this.getServiceName(integration)}Client({`)

    switch (integration.auth.type) {
      case 'api-key':
        lines.push("  apiKey: 'your-api-key',")
        break
      case 'oauth2':
        lines.push("  accessToken: 'your-access-token',")
        break
      case 'jwt':
        lines.push("  token: 'your-jwt-token',")
        break
      case 'basic':
        lines.push("  username: 'your-username',")
        lines.push("  password: 'your-password',")
        break
    }

    lines.push('})')
    lines.push('')

    // Add example operation
    if (integration.resources.length > 0) {
      const resource = integration.resources[0]
      const listOp = resource.operations.find((op) => op.type === 'list')
      const createOp = resource.operations.find((op) => op.type === 'create')

      if (listOp) {
        const opName = listOp.name || 'list'
        lines.push(`// List ${resource.name}s`)
        lines.push(`const ${this.camelCase(resource.name)}s = await client.${this.camelCase(resource.name)}.${opName}()`)
        lines.push(`console.log(${this.camelCase(resource.name)}s)`)
      } else if (createOp) {
        const opName = createOp.name || 'create'
        lines.push(`// Create ${resource.name}`)
        lines.push(`const ${this.camelCase(resource.name)} = await client.${this.camelCase(resource.name)}.${opName}({`)
        lines.push('  // your parameters')
        lines.push('})')
        lines.push(`console.log(${this.camelCase(resource.name)})`)
      }
    }

    lines.push('```')

    return lines.join('\n')
  }

  /**
   * Generate authentication section
   */
  private generateAuthentication(integration: Integration): string {
    const lines: string[] = []

    lines.push('## Authentication')
    lines.push('')
    lines.push(`This Integration uses **${integration.auth.type}** authentication.`)
    lines.push('')

    switch (integration.auth.type) {
      case 'api-key':
        lines.push('Provide your API key when initializing the client:')
        lines.push('')
        lines.push('```typescript')
        lines.push(`const client = new ${this.getServiceName(integration)}Client({`)
        lines.push('  apiKey: process.env.API_KEY,')
        lines.push('})')
        lines.push('```')
        break

      case 'oauth2':
        lines.push('This Integration uses OAuth2 for authentication. You need to obtain an access token first:')
        lines.push('')
        lines.push('```typescript')
        lines.push(`const client = new ${this.getServiceName(integration)}Client({`)
        lines.push('  accessToken: process.env.ACCESS_TOKEN,')
        lines.push('})')
        lines.push('```')
        if (integration.auth.oauth2) {
          lines.push('')
          lines.push('**OAuth2 Configuration:**')
          lines.push(`- Authorization URL: ${integration.auth.oauth2.authorizationUrl}`)
          lines.push(`- Token URL: ${integration.auth.oauth2.tokenUrl}`)
          lines.push(`- Scopes: ${integration.auth.oauth2.scopes.join(', ')}`)
        }
        break

      case 'jwt':
        lines.push('Provide your JWT token when initializing the client:')
        lines.push('')
        lines.push('```typescript')
        lines.push(`const client = new ${this.getServiceName(integration)}Client({`)
        lines.push('  token: process.env.JWT_TOKEN,')
        lines.push('})')
        lines.push('```')
        break

      case 'basic':
        lines.push('Provide your username and password:')
        lines.push('')
        lines.push('```typescript')
        lines.push(`const client = new ${this.getServiceName(integration)}Client({`)
        lines.push('  username: process.env.USERNAME,')
        lines.push('  password: process.env.PASSWORD,')
        lines.push('})')
        lines.push('```')
        break
    }

    return lines.join('\n')
  }

  /**
   * Generate resources section
   */
  private generateResources(integration: Integration): string {
    const lines: string[] = []

    lines.push('## Resources')
    lines.push('')

    for (const resource of integration.resources) {
      lines.push(`### ${resource.name}`)
      if (resource.description) {
        lines.push('')
        lines.push(resource.description)
      }
      lines.push('')

      for (const operation of resource.operations) {
        lines.push(this.generateOperationDoc(resource, operation))
        lines.push('')
      }
    }

    return lines.join('\n')
  }

  /**
   * Generate operation documentation
   */
  private generateOperationDoc(resource: Resource, operation: Operation): string {
    const lines: string[] = []
    const opName = operation.name || operation.type

    lines.push(`#### \`${this.camelCase(resource.name)}.${opName}()\``)
    lines.push('')

    if (operation.description) {
      lines.push(operation.description)
      lines.push('')
    }

    lines.push('```typescript')

    if (operation.params && operation.params.length > 0) {
      lines.push(`const result = await client.${this.camelCase(resource.name)}.${opName}({`)
      for (const param of operation.params) {
        lines.push(`  ${param.name}: ${this.getParamExample(param)}, ${param.description ? `// ${param.description}` : ''}`)
      }
      lines.push('})')
    } else {
      lines.push(`const result = await client.${this.camelCase(resource.name)}.${opName}()`)
    }

    lines.push('```')

    return lines.join('\n')
  }

  /**
   * Get example value for parameter
   */
  private getParamExample(param: any): string {
    if (param.default !== undefined) {
      return JSON.stringify(param.default)
    }

    switch (param.type) {
      case 'string':
        return param.validation?.enum ? `'${param.validation.enum[0]}'` : "'example'"
      case 'number':
        return '123'
      case 'boolean':
        return 'true'
      case 'object':
        return '{}'
      case 'array':
        return '[]'
      default:
        return 'value'
    }
  }

  /**
   * Generate error handling section
   */
  private generateErrorHandling(integration: Integration): string {
    return `## Error Handling

All errors are thrown as \`${this.getServiceName(integration)}Error\` instances with additional metadata:

\`\`\`typescript
try {
  const result = await client.${this.camelCase(integration.resources[0]?.name || 'resource')}.list()
} catch (error) {
  if (error instanceof ${this.getServiceName(integration)}Error) {
    console.error('Error type:', error.type)
    console.error('Error code:', error.code)
    console.error('Status code:', error.statusCode)
    console.error('Retryable:', error.isRetriable())
  }
}
\`\`\`

**Error Types:**
- \`authentication\` - Authentication failed
- \`authorization\` - Insufficient permissions
- \`validation\` - Invalid parameters
- \`not_found\` - Resource not found
- \`rate_limit\` - Rate limit exceeded
- \`server\` - Server error
- \`network\` - Network error
- \`unknown\` - Unknown error`
  }

  /**
   * Generate webhooks section
   */
  private generateWebhooks(integration: Integration): string {
    const lines: string[] = []

    lines.push('## Webhooks')
    lines.push('')
    lines.push('This Integration supports webhooks for real-time event notifications.')
    lines.push('')
    lines.push('```typescript')
    lines.push(`import { ${this.getServiceName(integration)}WebhookHandler, WebhookEventRouter } from '${this.getPackageName(integration)}'`)
    lines.push('')
    lines.push('// Initialize webhook handler')
    lines.push(`const handler = new ${this.getServiceName(integration)}WebhookHandler(process.env.WEBHOOK_SECRET)`)
    lines.push('')
    lines.push('// Verify and parse webhook')
    lines.push('const event = await handler.handleRequest(request)')
    lines.push('')
    lines.push('// Route events to handlers')
    lines.push('const router = new WebhookEventRouter()')

    if (integration.webhooks!.events.length > 0) {
      const firstEvent = integration.webhooks!.events[0]
      lines.push(`router.on${this.pascalCase(firstEvent.name)}(async (event) => {`)
      lines.push('  console.log(event.data)')
      lines.push('})')
    }

    lines.push('')
    lines.push('await router.route(event)')
    lines.push('```')

    if (integration.webhooks!.events.length > 0) {
      lines.push('')
      lines.push('**Available Events:**')
      for (const event of integration.webhooks!.events) {
        lines.push(`- \`${event.type}\` - ${event.description || event.name}`)
      }
    }

    return lines.join('\n')
  }

  /**
   * Generate rate limits section
   */
  private generateRateLimits(integration: Integration): string {
    const lines: string[] = []

    lines.push('## Rate Limits')
    lines.push('')
    lines.push('This Integration enforces the following rate limits:')
    lines.push('')

    const limits = integration.rateLimit!
    if (limits.requestsPerSecond) {
      lines.push(`- **Per Second**: ${limits.requestsPerSecond} requests`)
    }
    if (limits.requestsPerMinute) {
      lines.push(`- **Per Minute**: ${limits.requestsPerMinute} requests`)
    }
    if (limits.requestsPerHour) {
      lines.push(`- **Per Hour**: ${limits.requestsPerHour} requests`)
    }

    if (limits.burstSize) {
      lines.push('')
      lines.push(`**Burst Size**: ${limits.burstSize} requests`)
    }

    return lines.join('\n')
  }

  /**
   * Generate license section
   */
  private generateLicense(): string {
    return `## License

MIT`
  }

  /**
   * Get package name
   */
  private getPackageName(integration: Integration): string {
    return `@dotdo/integration-${integration.service.toLowerCase()}`
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

  /**
   * Convert to camelCase
   */
  private camelCase(str: string): string {
    return str.replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase()).replace(/^[A-Z]/, (chr) => chr.toLowerCase())
  }
}
