/**
 * Zapier Apps Data Ingestion
 * Source: Zapier Platform API / Public App Directory
 */

import { join } from 'path'
import type { IngestionResult, ZapierApp, FrontmatterValue } from './types.js'
import { toFilename, logResult, writeMDXFile } from './types.js'

const OUTPUT_DIR = join(process.cwd(), '.db', 'Zapier')

/**
 * Popular Zapier Apps
 * Based on Zapier's public app directory
 *
 * TODO: Future enhancement - fetch from Zapier Platform API
 * API endpoint: https://platform.zapier.com/docs/apis
 * Note: Requires API authentication and rate limiting consideration
 */
const ZAPIER_APPS: ZapierApp[] = [
  {
    key: 'gmail',
    name: 'Gmail',
    description: "Gmail is email that's intuitive, efficient, and useful. 15 GB of storage, less spam, and mobile access.",
    category: 'Email',
    imageUrl: 'https://zapier.com/app-icons/gmail.png',
    url: 'https://zapier.com/apps/gmail',
    triggers: ['New Email', 'New Attachment', 'New Label', 'New Starred Email'],
    actions: ['Send Email', 'Create Draft', 'Add Label to Email', 'Remove Label from Email'],
  },
  {
    key: 'slack',
    name: 'Slack',
    description: 'Slack is a platform for team communication: everything in one place, instantly searchable, available wherever you go.',
    category: 'Team Chat',
    imageUrl: 'https://zapier.com/app-icons/slack.png',
    url: 'https://zapier.com/apps/slack',
    triggers: ['New Message Posted to Channel', 'New Reaction Added', 'New File', 'New User'],
    actions: ['Send Channel Message', 'Send Direct Message', 'Update Message', 'Upload File'],
  },
  {
    key: 'google-sheets',
    name: 'Google Sheets',
    description: 'Create, edit, and share spreadsheets wherever you are with Google Sheets, and get automated insights from your data.',
    category: 'Spreadsheets',
    imageUrl: 'https://zapier.com/app-icons/google-sheets.png',
    url: 'https://zapier.com/apps/google-sheets',
    triggers: ['New Spreadsheet Row', 'New Worksheet', 'New or Updated Spreadsheet Row'],
    actions: ['Create Spreadsheet Row', 'Update Spreadsheet Row', 'Create Worksheet', 'Clear Worksheet'],
  },
  {
    key: 'salesforce',
    name: 'Salesforce',
    description: 'Salesforce is a leading enterprise customer relationship management (CRM) application.',
    category: 'CRM',
    imageUrl: 'https://zapier.com/app-icons/salesforce.png',
    url: 'https://zapier.com/apps/salesforce',
    triggers: ['New Record', 'Updated Record', 'New Outbound Message', 'New Record of a Specific Type'],
    actions: ['Create Record', 'Update Record', 'Find Record', 'Add Contact to Campaign'],
  },
  {
    key: 'hubspot',
    name: 'HubSpot',
    description: 'HubSpot is your all-in-one stop for all of your marketing software needs.',
    category: 'CRM',
    imageUrl: 'https://zapier.com/app-icons/hubspot.png',
    url: 'https://zapier.com/apps/hubspot',
    triggers: ['New Contact', 'New Deal', 'New Company', 'New Engagement'],
    actions: ['Create Contact', 'Update Contact', 'Create Deal', 'Create Company', 'Create Task'],
  },
  {
    key: 'trello',
    name: 'Trello',
    description: 'Trello is a team collaboration tool that lets you organize anything and everything to keep your projects on task.',
    category: 'Project Management',
    imageUrl: 'https://zapier.com/app-icons/trello.png',
    url: 'https://zapier.com/apps/trello',
    triggers: ['New Card', 'New Activity', 'Card Moved to List', 'New Label Added to Card'],
    actions: ['Create Card', 'Update Card', 'Move Card to List', 'Add Label to Card', 'Add Checklist Item'],
  },
  {
    key: 'asana',
    name: 'Asana',
    description: 'Asana is a leading work management platform that helps teams orchestrate work, from daily tasks to strategic initiatives.',
    category: 'Project Management',
    imageUrl: 'https://zapier.com/app-icons/asana.png',
    url: 'https://zapier.com/apps/asana',
    triggers: ['New Task', 'New Project', 'Task Completed', 'Tag Added to Task'],
    actions: ['Create Task', 'Update Task', 'Create Project', 'Add Comment to Task'],
  },
  {
    key: 'mailchimp',
    name: 'Mailchimp',
    description: 'Mailchimp is an email and marketing automation platform for growing businesses.',
    category: 'Email Marketing',
    imageUrl: 'https://zapier.com/app-icons/mailchimp.png',
    url: 'https://zapier.com/apps/mailchimp',
    triggers: ['New Subscriber', 'New Campaign', 'Unsubscribed Email', 'Updated Subscriber'],
    actions: ['Add/Update Subscriber', 'Unsubscribe Email', 'Create Campaign', 'Add Tag to Subscriber'],
  },
  {
    key: 'dropbox',
    name: 'Dropbox',
    description: 'Dropbox lets you store files online, sync them to all your devices, and share them easily.',
    category: 'File Management',
    imageUrl: 'https://zapier.com/app-icons/dropbox.png',
    url: 'https://zapier.com/apps/dropbox',
    triggers: ['New File in Folder', 'New Folder', 'Updated File'],
    actions: ['Upload File', 'Create Folder', 'Move File', 'Copy File', 'Create Text File'],
  },
  {
    key: 'google-drive',
    name: 'Google Drive',
    description: "Google Drive is Google's file sync app that lets you store all of your files online alongside your Google Docs documents.",
    category: 'File Management',
    imageUrl: 'https://zapier.com/app-icons/google-drive.png',
    url: 'https://zapier.com/apps/google-drive',
    triggers: ['New File in Folder', 'New Folder', 'Updated File'],
    actions: ['Upload File', 'Create Folder', 'Move File', 'Copy File', 'Create File From Text'],
  },
  {
    key: 'shopify',
    name: 'Shopify',
    description: 'Shopify is a powerful ecommerce platform that includes everything you need to create an online store and sell online.',
    category: 'Ecommerce',
    imageUrl: 'https://zapier.com/app-icons/shopify.png',
    url: 'https://zapier.com/apps/shopify',
    triggers: ['New Order', 'New Customer', 'New Product', 'Order Paid', 'Order Fulfilled'],
    actions: ['Create Order', 'Create Customer', 'Create Product', 'Update Order', 'Add Product to Collection'],
  },
  {
    key: 'stripe',
    name: 'Stripe',
    description: 'Stripe is a developer-friendly way to accept payments online and in mobile apps.',
    category: 'Payment Processing',
    imageUrl: 'https://zapier.com/app-icons/stripe.png',
    url: 'https://zapier.com/apps/stripe',
    triggers: ['New Payment', 'New Customer', 'New Subscription', 'Failed Payment', 'Canceled Subscription'],
    actions: ['Create Customer', 'Create Charge', 'Create Subscription', 'Update Customer', 'Create Invoice'],
  },
  {
    key: 'twitter',
    name: 'Twitter',
    description: "Twitter is the social network that shows what's happening around the world in real time.",
    category: 'Social Media',
    imageUrl: 'https://zapier.com/app-icons/twitter.png',
    url: 'https://zapier.com/apps/twitter',
    triggers: ['New Tweet by You', 'New Mention', 'New Follower', 'New Tweet from Search'],
    actions: ['Create Tweet', 'Update Status with Media', 'Like Tweet', 'Follow User'],
  },
  {
    key: 'linkedin',
    name: 'LinkedIn',
    description: "LinkedIn is the world's largest professional network, built to help professionals achieve more in their careers.",
    category: 'Social Media',
    imageUrl: 'https://zapier.com/app-icons/linkedin.png',
    url: 'https://zapier.com/apps/linkedin',
    triggers: ['New Post', 'New Connection', 'New Company Update'],
    actions: ['Share Update', 'Create Company Update', 'Share Article'],
  },
  {
    key: 'zoom',
    name: 'Zoom',
    description: 'Zoom is a video conferencing service for online meetings, webinars, and collaboration.',
    category: 'Video Conferencing',
    imageUrl: 'https://zapier.com/app-icons/zoom.png',
    url: 'https://zapier.com/apps/zoom',
    triggers: ['New Meeting', 'New Webinar', 'Meeting Started', 'Meeting Ended', 'New Recording'],
    actions: ['Create Meeting', 'Create Webinar Registrant', 'Add Meeting Registrant'],
  },
]

/**
 * Converts Zapier app to frontmatter and content
 */
function zapierToDocument(app: ZapierApp): { frontmatter: Record<string, FrontmatterValue>; content: string } {
  const frontmatter = {
    $id: `zapier:${app.key}`,
    $type: 'IntegrationApp',
    key: app.key,
    name: app.name,
    description: app.description,
    category: app.category,
    imageUrl: app.imageUrl,
    url: app.url,
    triggers: app.triggers,
    actions: app.actions,
  }

  const content = `# ${app.name}

${app.description}

## App Details

- **App Key**: ${app.key}
- **Category**: ${app.category}
- **Zapier URL**: [${app.url}](${app.url})

## Integration Capabilities

### Triggers (${app.triggers.length})

Triggers start automated workflows when events occur in ${app.name}:

${app.triggers.map((trigger) => `- **${trigger}**: Fires when a new ${trigger.toLowerCase()} occurs`).join('\n')}

### Actions (${app.actions.length})

Actions perform operations in ${app.name} as part of automated workflows:

${app.actions.map((action) => `- **${action}**: Performs ${action.toLowerCase()} operation`).join('\n')}

## Common Use Cases

### Automation Examples

1. **Data Sync**: Keep data synchronized between ${app.name} and other apps
2. **Notifications**: Send notifications to team chat when important events occur
3. **Reporting**: Automatically log activities to spreadsheets or databases
4. **Task Management**: Create tasks or tickets based on ${app.name} events
5. **Lead Generation**: Capture and route leads to CRM systems

### Popular Zap Templates

- Connect ${app.name} to Gmail for email automation
- Sync ${app.name} data with Google Sheets
- Send Slack notifications for ${app.name} events
- Create Trello cards from ${app.name} items
- Update CRM records when ${app.name} data changes

## Integration Setup

### Prerequisites

1. Active ${app.name} account
2. Zapier account (free or paid plan)
3. API access or OAuth permissions for ${app.name}

### Connection Steps

1. In Zapier, search for "${app.name}"
2. Click "Connect" and authorize access
3. Select trigger or action event
4. Configure event settings and filters
5. Map fields between apps
6. Test and activate your Zap

## Technical Details

### Authentication

${app.name} uses OAuth 2.0 or API key authentication for secure connections.

### Rate Limits

- Free plans: Standard rate limits apply
- Paid plans: Higher rate limits available
- Enterprise: Custom rate limits and SLAs

### API Version

Integration uses the latest stable API version of ${app.name}.

## Support and Resources

- [${app.name} on Zapier](${app.url})
- [Zapier Help Documentation](https://help.zapier.com/)
- [${app.name} API Documentation](https://developers.${app.key}.com/)
- [Community Forum](https://community.zapier.com/)

## Related Apps

Similar apps in the ${app.category} category:
- Browse [${app.category} apps on Zapier](https://zapier.com/apps/categories/${toFilename(app.category)})
`

  return { frontmatter, content }
}

/**
 * Ingests Zapier apps data into .db/Zapier/
 */
export async function ingestZapier(): Promise<IngestionResult> {
  const startTime = Date.now()
  const result: IngestionResult = {
    source: 'Zapier',
    totalRecords: ZAPIER_APPS.length,
    successCount: 0,
    errorCount: 0,
    errors: [],
    duration: 0,
  }

  try {
    // Process each Zapier app
    for (const app of ZAPIER_APPS) {
      try {
        const filename = `${toFilename(app.key)}.mdx`
        const { frontmatter, content } = zapierToDocument(app)

        writeMDXFile(OUTPUT_DIR, filename, frontmatter, content)
        result.successCount++
      } catch (error) {
        result.errorCount++
        result.errors.push(`Failed to process Zapier app ${app.key} (${app.name}): ${error instanceof Error ? error.message : String(error)}`)
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
  ingestZapier().catch(console.error)
}
