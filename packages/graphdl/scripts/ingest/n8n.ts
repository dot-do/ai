/**
 * n8n Nodes Data Ingestion
 * Source: n8n GitHub repository / Community nodes
 */

import { join } from 'path'
import type { IngestionResult, N8nNode, FrontmatterValue } from './types.js'
import { toFilename, logResult, writeMDXFile } from './types.js'

const OUTPUT_DIR = join(process.cwd(), '.db', 'n8n')

/**
 * Popular n8n Nodes
 * Based on n8n's public node directory
 *
 * TODO: Future enhancement - scrape from n8n GitHub repository
 * Repository: https://github.com/n8n-io/n8n
 * Node definitions: packages/nodes-base/nodes/
 */
const N8N_NODES: N8nNode[] = [
  {
    name: 'HTTP Request',
    displayName: 'HTTP Request',
    description: 'Makes an HTTP request and returns the response data',
    category: 'Core',
    version: 1,
    operations: [
      {
        name: 'request',
        displayName: 'Request',
        description: 'Make an HTTP request',
        type: 'action',
        properties: [
          {
            displayName: 'Method',
            name: 'method',
            type: 'options',
            required: true,
            default: 'GET',
            options: [
              { name: 'GET', value: 'GET' },
              { name: 'POST', value: 'POST' },
              { name: 'PUT', value: 'PUT' },
              { name: 'DELETE', value: 'DELETE' },
              { name: 'PATCH', value: 'PATCH' },
            ],
          },
          {
            displayName: 'URL',
            name: 'url',
            type: 'string',
            required: true,
            default: '',
            description: 'The URL to make the request to',
          },
        ],
      },
    ],
    documentationUrl: 'https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.httprequest/',
  },
  {
    name: 'Google Sheets',
    displayName: 'Google Sheets',
    description: 'Read, update and write data to Google Sheets',
    category: 'Productivity',
    version: 3,
    credentials: ['googleSheetsOAuth2Api'],
    operations: [
      {
        name: 'append',
        displayName: 'Append',
        description: 'Append data to a sheet',
        type: 'action',
        properties: [
          {
            displayName: 'Spreadsheet ID',
            name: 'spreadsheetId',
            type: 'string',
            required: true,
            default: '',
          },
          {
            displayName: 'Sheet Name',
            name: 'sheetName',
            type: 'string',
            required: true,
            default: 'Sheet1',
          },
        ],
      },
      {
        name: 'read',
        displayName: 'Read',
        description: 'Read data from a sheet',
        type: 'action',
        properties: [
          {
            displayName: 'Spreadsheet ID',
            name: 'spreadsheetId',
            type: 'string',
            required: true,
            default: '',
          },
        ],
      },
    ],
    documentationUrl: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.googlesheets/',
  },
  {
    name: 'Slack',
    displayName: 'Slack',
    description: 'Consume Slack events and interact with Slack',
    category: 'Communication',
    version: 2,
    credentials: ['slackOAuth2Api', 'slackApi'],
    operations: [
      {
        name: 'messageReceived',
        displayName: 'Message Received',
        description: 'Triggers when a message is received',
        type: 'trigger',
        properties: [
          {
            displayName: 'Channel',
            name: 'channel',
            type: 'string',
            required: true,
            default: '',
          },
        ],
      },
      {
        name: 'postMessage',
        displayName: 'Post Message',
        description: 'Post a message to a channel',
        type: 'action',
        properties: [
          {
            displayName: 'Channel',
            name: 'channel',
            type: 'string',
            required: true,
            default: '',
          },
          {
            displayName: 'Text',
            name: 'text',
            type: 'string',
            required: true,
            default: '',
          },
        ],
      },
    ],
    documentationUrl: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.slack/',
  },
  {
    name: 'Postgres',
    displayName: 'Postgres',
    description: 'Execute SQL queries against PostgreSQL databases',
    category: 'Database',
    version: 2,
    credentials: ['postgres'],
    operations: [
      {
        name: 'query',
        displayName: 'Execute Query',
        description: 'Execute a SQL query',
        type: 'action',
        properties: [
          {
            displayName: 'Query',
            name: 'query',
            type: 'string',
            required: true,
            default: '',
            description: 'SQL query to execute',
          },
        ],
      },
    ],
    documentationUrl: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.postgres/',
  },
  {
    name: 'Gmail',
    displayName: 'Gmail',
    description: 'Consume Gmail messages and send emails',
    category: 'Communication',
    version: 2,
    credentials: ['googleOAuth2Api'],
    operations: [
      {
        name: 'newEmail',
        displayName: 'New Email',
        description: 'Triggers when a new email is received',
        type: 'trigger',
        properties: [
          {
            displayName: 'Label',
            name: 'label',
            type: 'string',
            required: false,
            default: 'INBOX',
          },
        ],
      },
      {
        name: 'sendEmail',
        displayName: 'Send Email',
        description: 'Send an email',
        type: 'action',
        properties: [
          {
            displayName: 'To',
            name: 'to',
            type: 'string',
            required: true,
            default: '',
          },
          {
            displayName: 'Subject',
            name: 'subject',
            type: 'string',
            required: true,
            default: '',
          },
          {
            displayName: 'Message',
            name: 'message',
            type: 'string',
            required: true,
            default: '',
          },
        ],
      },
    ],
    documentationUrl: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.gmail/',
  },
  {
    name: 'Webhook',
    displayName: 'Webhook',
    description: 'Receive webhooks and HTTP requests',
    category: 'Core',
    version: 1,
    operations: [
      {
        name: 'webhook',
        displayName: 'Webhook',
        description: 'Receives data when webhook is called',
        type: 'trigger',
        properties: [
          {
            displayName: 'HTTP Method',
            name: 'httpMethod',
            type: 'options',
            required: true,
            default: 'POST',
            options: [
              { name: 'GET', value: 'GET' },
              { name: 'POST', value: 'POST' },
              { name: 'PUT', value: 'PUT' },
              { name: 'DELETE', value: 'DELETE' },
            ],
          },
          {
            displayName: 'Path',
            name: 'path',
            type: 'string',
            required: true,
            default: '',
          },
        ],
      },
    ],
    documentationUrl: 'https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/',
  },
  {
    name: 'OpenAI',
    displayName: 'OpenAI',
    description: 'Interact with OpenAI API for text and image generation',
    category: 'AI',
    version: 1,
    credentials: ['openAiApi'],
    operations: [
      {
        name: 'completion',
        displayName: 'Text Completion',
        description: 'Generate text using GPT models',
        type: 'action',
        properties: [
          {
            displayName: 'Model',
            name: 'model',
            type: 'string',
            required: true,
            default: 'gpt-4',
          },
          {
            displayName: 'Prompt',
            name: 'prompt',
            type: 'string',
            required: true,
            default: '',
          },
        ],
      },
    ],
    documentationUrl: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.openai/',
  },
  {
    name: 'MySQL',
    displayName: 'MySQL',
    description: 'Execute SQL queries against MySQL databases',
    category: 'Database',
    version: 2,
    credentials: ['mysql'],
    operations: [
      {
        name: 'query',
        displayName: 'Execute Query',
        description: 'Execute a SQL query',
        type: 'action',
        properties: [
          {
            displayName: 'Query',
            name: 'query',
            type: 'string',
            required: true,
            default: '',
          },
        ],
      },
    ],
    documentationUrl: 'https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.mysql/',
  },
]

/**
 * Converts n8n node to frontmatter and content
 */
function n8nToDocument(node: N8nNode): { frontmatter: Record<string, FrontmatterValue>; content: string } {
  const triggers = node.operations.filter((op) => op.type === 'trigger')
  const actions = node.operations.filter((op) => op.type === 'action')

  const frontmatter = {
    $id: `n8n:${toFilename(node.name)}`,
    $type: 'IntegrationApp',
    name: node.name,
    displayName: node.displayName,
    description: node.description,
    category: node.category,
    version: node.version,
    credentials: node.credentials || [],
    documentationUrl: node.documentationUrl || '',
    triggers: triggers.map((t) => t.name),
    actions: actions.map((a) => a.name),
  }

  const content = `# ${node.displayName}

${node.description}

## Node Details

- **Node Name**: ${node.name}
- **Category**: ${node.category}
- **Version**: ${node.version}
${node.credentials ? `- **Credentials**: ${node.credentials.join(', ')}` : ''}
${node.documentationUrl ? `- **Documentation**: [${node.documentationUrl}](${node.documentationUrl})` : ''}

## Integration Capabilities

### Triggers (${triggers.length})

${
  triggers.length > 0
    ? triggers
        .map(
          (trigger) => `#### ${trigger.displayName}

${trigger.description}

**Properties:**
${trigger.properties.map((p) => `- **${p.displayName}** (\`${p.name}\`): ${p.type}${p.required ? ' (required)' : ''}${p.description ? ` - ${p.description}` : ''}`).join('\n')}
`
        )
        .join('\n')
    : '*No triggers available*'
}

### Actions (${actions.length})

${
  actions.length > 0
    ? actions
        .map(
          (action) => `#### ${action.displayName}

${action.description}

**Properties:**
${action.properties.map((p) => `- **${p.displayName}** (\`${p.name}\`): ${p.type}${p.required ? ' (required)' : ''}${p.description ? ` - ${p.description}` : ''}`).join('\n')}
`
        )
        .join('\n')
    : '*No actions available*'
}

## Common Use Cases

### Workflow Examples

1. **Data Processing**: Transform and route data between systems
2. **Automation**: Automate repetitive tasks and business processes
3. **Integration**: Connect ${node.displayName} with other services
4. **Monitoring**: Track events and send notifications
5. **Data Sync**: Keep data synchronized across platforms

## Integration Setup

### Prerequisites

1. n8n instance (cloud or self-hosted)
2. ${node.displayName} account and access credentials
${node.credentials ? `3. Configured credentials: ${node.credentials.join(', ')}` : ''}

### Connection Steps

1. In n8n, add a new node
2. Search for "${node.displayName}"
3. Configure credentials if required
4. Select trigger or action operation
5. Configure operation properties
6. Connect to other nodes in your workflow
7. Test and activate your workflow

## Technical Details

### Node Type

${triggers.length > 0 ? 'Supports triggers (webhook/polling)' : ''}
${actions.length > 0 ? 'Supports actions' : ''}

### Version

Node version: ${node.version}

## Support and Resources

- [n8n Documentation](https://docs.n8n.io/)
${node.documentationUrl ? `- [${node.displayName} Node Documentation](${node.documentationUrl})` : ''}
- [n8n Community Forum](https://community.n8n.io/)
- [n8n GitHub Repository](https://github.com/n8n-io/n8n)

## Related Nodes

Browse more nodes in the ${node.category} category on [n8n](https://n8n.io/integrations/).
`

  return { frontmatter, content }
}

/**
 * Ingests n8n nodes data into .db/n8n/
 */
export async function ingestN8n(): Promise<IngestionResult> {
  const startTime = Date.now()
  const result: IngestionResult = {
    source: 'n8n',
    totalRecords: N8N_NODES.length,
    successCount: 0,
    errorCount: 0,
    errors: [],
    duration: 0,
  }

  try {
    // Process each n8n node
    for (const node of N8N_NODES) {
      try {
        const filename = `${toFilename(node.name)}.mdx`
        const { frontmatter, content } = n8nToDocument(node)

        writeMDXFile(OUTPUT_DIR, filename, frontmatter, content)
        result.successCount++
      } catch (error) {
        result.errorCount++
        result.errors.push(`Failed to process n8n node ${node.name}: ${error instanceof Error ? error.message : String(error)}`)
      }
    }
  } catch (error) {
    result.errorCount++
    result.errors.push(`Fatal error: ${error instanceof Error ? error.message : String(error)}`)
  }

  result.duration = Date.now() - startTime
  logResult(result)

  return result
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  ingestN8n().catch(console.error)
}
