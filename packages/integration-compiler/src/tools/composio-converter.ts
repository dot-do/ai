#!/usr/bin/env node

/**
 * Composio to MDXLD Converter
 *
 * Converts Composio app definitions to MDXLD integration format.
 * This tool fetches all 815+ apps from Composio API and generates
 * MDXLD integration definitions that can be compiled by integration-compiler.
 */

import * as fs from 'fs/promises'
import * as path from 'path'

// Types from Composio API
interface ComposioApp {
  appId: string
  key: string
  name: string
  displayName: string
  description: string
  logo: string
  categories: string[]
  docs?: string
  no_auth: boolean
  auth_schemes?: ComposioAuthScheme[]
  meta: {
    triggersCount: number
    actionsCount: number
    is_custom_app: boolean
  }
}

interface ComposioAuthScheme {
  name: string
  mode: 'OAUTH2' | 'API_KEY' | 'BASIC' | 'BEARER'
  authorization_url?: string
  token_url?: string
  fields?: ComposioAuthField[]
  proxy?: {
    headers?: Record<string, string>
  }
}

interface ComposioAuthField {
  name: string
  displayName: string
  type: string
  description: string
  required: boolean
  default_value?: string
}

// Category mapping from Composio to MDXLD
const CATEGORY_MAP: Record<string, string> = {
  'developer tools & devops': 'developer-tools',
  crm: 'crm',
  'collaboration & communication': 'communication',
  'document & file management': 'storage',
  'analytics & data': 'analytics',
  'productivity & project management': 'productivity',
  'marketing & social media': 'marketing',
  'sales & customer support': 'support',
  'e-commerce': 'ecommerce',
  'education & lms': 'productivity',
  'finance & accounting': 'accounting',
  'hr & recruiting': 'hr',
  'scheduling & booking': 'productivity',
  'entertainment & media': 'social-media',
  'ai & machine learning': 'developer-tools',
  'design & creative tools': 'productivity',
  gaming: 'social-media',
  voice: 'communication',
  'workflow automation': 'productivity',
  ticketing: 'support',
  social: 'social-media',
  marketing: 'marketing',
  productivity: 'productivity',
  popular: 'productivity', // fallback for 'popular' tag
  'other / miscellaneous': 'productivity',
}

class ComposioConverter {
  private apiKey: string
  private baseUrl = 'https://backend.composio.dev/api/v1'
  private outputDir: string

  constructor(apiKey: string, outputDir: string) {
    this.apiKey = apiKey
    this.outputDir = outputDir
  }

  /**
   * Fetch all apps from Composio API
   */
  async fetchAllApps(): Promise<ComposioApp[]> {
    console.log('Fetching all apps from Composio API...')

    const response = await fetch(`${this.baseUrl}/apps`, {
      headers: {
        'X-API-Key': this.apiKey,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch apps: ${response.statusText}`)
    }

    const data = (await response.json()) as { items: ComposioApp[] }
    const apps = data.items || []

    console.log(`✓ Fetched ${apps.length} apps from Composio`)
    return apps
  }

  /**
   * Fetch detailed app info including auth schemes
   */
  async fetchAppDetails(appKey: string): Promise<ComposioApp> {
    const response = await fetch(`${this.baseUrl}/apps/${appKey}`, {
      headers: {
        'X-API-Key': this.apiKey,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch app ${appKey}: ${response.statusText}`)
    }

    return (await response.json()) as ComposioApp
  }

  /**
   * Map Composio category to MDXLD category
   */
  mapCategory(categories: string[]): string {
    if (!categories || categories.length === 0) {
      return 'productivity' // default fallback
    }

    // Use first category and map it
    const firstCategory = categories[0].toLowerCase()
    return CATEGORY_MAP[firstCategory] || 'productivity'
  }

  /**
   * Convert Composio auth scheme to MDXLD auth config
   */
  convertAuthScheme(authScheme: ComposioAuthScheme): string {
    if (authScheme.mode === 'OAUTH2') {
      // Extract scopes from fields
      const scopesField = authScheme.fields?.find((f) => f.name === 'scopes')
      const scopes = scopesField?.default_value?.split(',').map((s) => s.trim()) || []

      return `auth:
  type: oauth2
  authorizationUrl: ${authScheme.authorization_url || ''}
  tokenUrl: ${authScheme.token_url || ''}${
    scopes.length > 0
      ? `
  scopes:
${scopes.map((s) => `    - ${s}`).join('\n')}`
      : ''
  }`
    }

    if (authScheme.mode === 'API_KEY') {
      // Try to extract header info from proxy
      const authHeader = authScheme.proxy?.headers?.['Authorization'] || 'Authorization'
      let headerName = 'Authorization'
      let scheme = 'Bearer'

      // Parse "Bearer {{generic_api_key}}" format
      if (authHeader.includes('Bearer')) {
        scheme = 'Bearer'
      } else if (authHeader.includes('Basic')) {
        scheme = 'Basic'
      }

      return `auth:
  type: api-key
  location: header
  headerName: ${headerName}
  scheme: ${scheme}`
    }

    if (authScheme.mode === 'BASIC') {
      return `auth:
  type: basic`
    }

    // Default fallback
    return `auth:
  type: api-key
  location: header
  headerName: Authorization`
  }

  /**
   * Generate MDXLD content for a Composio app
   */
  generateMDXLD(app: ComposioApp): string {
    const category = this.mapCategory(app.categories)
    const authConfig =
      app.auth_schemes && app.auth_schemes.length > 0
        ? this.convertAuthScheme(app.auth_schemes[0])
        : `auth:
  type: api-key
  location: header
  headerName: Authorization`

    const webhooksEnabled = app.meta.triggersCount > 0

    return `---
$id: https://integrations.do/${app.key}
$type: Integration
name: ${app.displayName}
service: ${app.key}
description: ${app.description}
category: ${category}
sdkBased: false
baseUrl: https://api.${app.key}.com

${authConfig}

resources:
  - name: Action
    plural: Actions
    description: Execute ${app.displayName} actions
    operations:
      - name: execute
        method: POST
        path: /
        params:
          - name: action
            type: string
            required: true
            description: Action name to execute
          - name: parameters
            type: object
            required: false
            description: Action parameters
        returns: object

webhooks:
  enabled: ${webhooksEnabled}${
    webhooksEnabled
      ? `
  verificationMethod: none
  events:
    - name: generic_trigger
      type: trigger
      description: Generic webhook trigger`
      : `
  events: []`
  }

errors:
  mapping:
    - code: 401
      type: authentication
      statusCode: 401
      message: Unauthorized
      retryable: false
    - code: 429
      type: rate_limit
      statusCode: 429
      message: Rate limit exceeded
      retryable: true
  retryable: [429, 500]
  nonRetryable: [400, 401, 403, 404]

tests:
  enabled: true
  cleanup: false
  scenarios:
    - name: Basic Action Execution
      description: Test basic action execution
      steps:
        - action: custom
          resource: Action

docs:
  homepage: ${app.docs || `https://${app.key}.com`}
  apiDocs: ${app.docs || `https://${app.key}.com/api`}
---

# ${app.displayName} Integration

${app.description}

## Quick Start

\`\`\`typescript
import { ${app.displayName.replace(/\s/g, '')}Client } from '@dotdo/sdk.do/integrations/${app.key}'

const ${app.key} = new ${app.displayName.replace(/\s/g, '')}Client({
  apiKey: process.env.${app.key.toUpperCase()}_API_KEY
})

const result = await ${app.key}.action.execute({
  action: 'example_action',
  parameters: {}
})
\`\`\`

## Actions

${app.displayName} provides ${app.meta.actionsCount} actions through the Composio API.${
      webhooksEnabled
        ? `

## Webhooks

${app.displayName} supports ${app.meta.triggersCount} webhook triggers for real-time event notifications.`
        : ''
    }

## License

MIT
`
  }

  /**
   * Convert a single app
   */
  async convertApp(app: ComposioApp): Promise<{ success: boolean; error?: string }> {
    try {
      // Fetch detailed app info if needed
      let detailedApp = app
      if (!app.auth_schemes) {
        try {
          detailedApp = await this.fetchAppDetails(app.key)
        } catch (error) {
          console.warn(`⚠️  Could not fetch details for ${app.key}, using basic info`)
        }
      }

      // Generate MDXLD
      const mdxld = this.generateMDXLD(detailedApp)

      // Write to file
      const filename = `${app.key}.mdx`
      const filepath = path.join(this.outputDir, filename)
      await fs.writeFile(filepath, mdxld, 'utf-8')

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      }
    }
  }

  /**
   * Convert all apps
   */
  async convertAll(): Promise<{
    total: number
    success: number
    failed: number
    errors: Array<{ app: string; error: string }>
  }> {
    // Ensure output directory exists
    await fs.mkdir(this.outputDir, { recursive: true })

    // Fetch all apps
    const apps = await this.fetchAllApps()

    console.log(`\nConverting ${apps.length} apps to MDXLD format...\n`)

    const results = {
      total: apps.length,
      success: 0,
      failed: 0,
      errors: [] as Array<{ app: string; error: string }>,
    }

    // Convert each app (with some parallelism but not too much)
    const BATCH_SIZE = 10
    for (let i = 0; i < apps.length; i += BATCH_SIZE) {
      const batch = apps.slice(i, i + BATCH_SIZE)
      const promises = batch.map((app) => this.convertApp(app))
      const batchResults = await Promise.all(promises)

      batchResults.forEach((result, index) => {
        const app = batch[index]
        if (result.success) {
          results.success++
          console.log(`✓ ${app.key} (${i + index + 1}/${apps.length})`)
        } else {
          results.failed++
          results.errors.push({ app: app.key, error: result.error || 'Unknown error' })
          console.error(`✗ ${app.key}: ${result.error}`)
        }
      })

      // Small delay between batches to avoid rate limiting
      if (i + BATCH_SIZE < apps.length) {
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
    }

    return results
  }
}

/**
 * Main execution
 */
async function main() {
  const apiKey = process.env.COMPOSIO_API_KEY
  if (!apiKey) {
    console.error('Error: COMPOSIO_API_KEY environment variable not set')
    console.error('Get your API key from: https://app.composio.dev/settings')
    process.exit(1)
  }

  const outputDir = process.argv[2] || path.join(process.cwd(), '../sdk.do/integrations')

  console.log('Composio to MDXLD Converter')
  console.log('===========================\n')
  console.log(`Output directory: ${outputDir}\n`)

  const converter = new ComposioConverter(apiKey, outputDir)

  try {
    const results = await converter.convertAll()

    console.log('\n===========================')
    console.log('Conversion Complete')
    console.log('===========================\n')
    console.log(`Total apps: ${results.total}`)
    console.log(`✓ Successful: ${results.success}`)
    console.log(`✗ Failed: ${results.failed}`)
    console.log(`Success rate: ${((results.success / results.total) * 100).toFixed(1)}%\n`)

    if (results.errors.length > 0) {
      console.log('Errors:')
      results.errors.forEach(({ app, error }) => {
        console.log(`  - ${app}: ${error}`)
      })
      console.log()
    }

    console.log(`Next steps:`)
    console.log(`  1. Review generated files in ${outputDir}`)
    console.log(`  2. Run: pnpm compile to build all integrations`)
    console.log(`  3. Verify compilation success rate\n`)
  } catch (error) {
    console.error('Fatal error:', error)
    process.exit(1)
  }
}

export { ComposioConverter }

// Run if executed directly (ES module compatible)
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}
