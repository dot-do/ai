/**
 * Integration Examples
 *
 * Examples of using Zapier/n8n/O*NET integrations in workflows
 */

import type { Integration, IntegrationTrigger, IntegrationAction, IntegrationSearch } from '../src/types/integrations.js'

/**
 * Example: Semantic path patterns for integrations
 *
 * The $.Subject.predicate.Object pattern enables intuitive, type-safe access
 * to integration capabilities.
 */

// Zapier examples - accessing triggers, searches, and actions
const zapierPaths = {
  // Gmail integration
  gmailNewEmail: '$.Gmail.triggers.newEmail',
  gmailFindEmail: '$.Gmail.searches.findEmail',
  gmailSendEmail: '$.Gmail.actions.sendEmail',

  // Slack integration
  slackMessageReceived: '$.Slack.triggers.messageReceived',
  slackFindUser: '$.Slack.searches.findUser',
  slackPostMessage: '$.Slack.actions.postMessage',

  // Stripe integration
  stripePaymentSucceeded: '$.Stripe.triggers.paymentSucceeded',
  stripeFindCustomer: '$.Stripe.searches.findCustomer',
  stripeCreateCharge: '$.Stripe.actions.createCharge',
}

// n8n examples - accessing node operations
const n8nPaths = {
  httpRequest: '$.n8n.HTTP.actions.request',
  googleSheetsAppend: '$.n8n.GoogleSheets.actions.append',
  postgresQuery: '$.n8n.Postgres.actions.query',
  webhookTrigger: '$.n8n.Webhook.triggers.webhook',
}

// O*NET examples - accessing tools by occupation
const onetPaths = {
  // Software Developer tools
  devGit: '$.SoftwareDeveloper.usesTool.Git',
  devTypeScript: '$.SoftwareDeveloper.usesTechnology.TypeScript',
  devVSCode: '$.SoftwareDeveloper.usesSoftware.VSCode',

  // Data Scientist tools
  dataScientistPython: '$.DataScientist.usesTool.Python',
  dataScientistTensorFlow: '$.DataScientist.usesTechnology.TensorFlow',
  dataScientistJupyter: '$.DataScientist.usesSoftware.JupyterNotebook',
}

/**
 * Example: Using integrations in workflow definitions
 *
 * This shows how integrations can be used with the SDK's `on`, `api`, and `send` functions.
 */

interface BusinessContext {
  on: {
    // Zapier triggers
    Gmail: {
      newEmail: (handler: (email: GmailEmail) => void | Promise<void>) => void
    }
    Slack: {
      messageReceived: (handler: (message: SlackMessage) => void | Promise<void>) => void
    }
    Stripe: {
      paymentSucceeded: (handler: (payment: StripePayment) => void | Promise<void>) => void
    }
  }
  api: {
    // Zapier actions
    Gmail: {
      sendEmail: (params: GmailSendParams) => Promise<void>
    }
    Slack: {
      postMessage: (params: SlackMessageParams) => Promise<void>
    }
    Stripe: {
      createCharge: (params: StripeChargeParams) => Promise<void>
    }
  }
  send: (event: string, data: unknown) => Promise<void>
}

// Type definitions for integration data
interface GmailEmail {
  id: string
  from: string
  to: string
  subject: string
  body: string
  timestamp: number
}

interface SlackMessage {
  channel: string
  user: string
  text: string
  timestamp: number
}

interface StripePayment {
  id: string
  amount: number
  currency: string
  customer: {
    id: string
    email: string
  }
}

interface GmailSendParams {
  to: string
  subject: string
  body: string
}

interface SlackMessageParams {
  channel: string
  text: string
}

interface StripeChargeParams {
  amount: number
  currency: string
  customer: string
}

/**
 * Example workflow: Email to Slack notification
 */
export function emailToSlackWorkflow($: BusinessContext) {
  const { on, api } = $

  // Trigger: When Gmail receives new email
  on.Gmail.newEmail(async (email) => {
    // Action: Post to Slack
    await api.Slack.postMessage({
      channel: '#inbox',
      text: `📧 New email from ${email.from}: ${email.subject}`,
    })
  })
}

/**
 * Example workflow: Stripe payment to thank you email
 */
export function paymentToEmailWorkflow($: BusinessContext) {
  const { on, api } = $

  // Trigger: When Stripe payment succeeds
  on.Stripe.paymentSucceeded(async (payment) => {
    // Action: Send thank you email
    await api.Gmail.sendEmail({
      to: payment.customer.email,
      subject: 'Thank you for your payment!',
      body: `We've received your payment of ${payment.amount / 100} ${payment.currency.toUpperCase()}. Thank you!`,
    })
  })
}

/**
 * Example workflow: Multi-step integration
 */
export function multiStepWorkflow($: BusinessContext) {
  const { on, api, send } = $

  // Trigger: Slack message received
  on.Slack.messageReceived(async (message) => {
    // Check if message contains payment request
    if (message.text.includes('/invoice')) {
      // Extract amount from message
      const amount = parseFloat(message.text.match(/\$(\d+)/)?.[1] || '0')

      if (amount > 0) {
        // Action: Create Stripe charge
        await api.Stripe.createCharge({
          amount: amount * 100, // Convert to cents
          currency: 'usd',
          customer: message.user,
        })

        // Action: Send confirmation to Slack
        await api.Slack.postMessage({
          channel: message.channel,
          text: `✅ Invoice created for $${amount}`,
        })

        // Emit event for tracking
        await send('invoice.created', {
          user: message.user,
          amount,
          timestamp: Date.now(),
        })
      }
    }
  })
}

/**
 * Example: Integration metadata access
 *
 * Shows how to work with integration definitions programmatically.
 */
export function getIntegrationInfo(integration: Integration) {
  return {
    name: integration.name,
    platform: integration.platform,
    capabilities: {
      triggerCount: integration.triggers.length,
      searchCount: integration.searches.length,
      actionCount: integration.actions.length,
    },
    semanticPaths: {
      triggers: integration.triggers.map((t) => `$.${integration.name}.triggers.${t.key}`),
      searches: integration.searches.map((s) => `$.${integration.name}.searches.${s.key}`),
      actions: integration.actions.map((a) => `$.${integration.name}.actions.${a.key}`),
    },
  }
}

/**
 * Example: Building dynamic workflows from integration definitions
 */
export function createDynamicWorkflow(integration: Integration, $: BusinessContext) {
  // Register all triggers
  integration.triggers.forEach((trigger) => {
    console.log(`Registering trigger: $.${integration.name}.triggers.${trigger.key}`)
    // Dynamic trigger registration would happen here
  })

  // Register all actions
  integration.actions.forEach((action) => {
    console.log(`Registering action: $.${integration.name}.actions.${action.key}`)
    // Dynamic action registration would happen here
  })
}

/**
 * Example: O*NET tool-based workflow recommendations
 *
 * Based on occupation and tools, suggest relevant integrations.
 */
export function recommendIntegrations(occupation: string, tools: string[]): string[] {
  const recommendations: string[] = []

  // Software Developer using Git → suggest GitHub integration
  if (occupation === 'Software Developer' && tools.includes('Git')) {
    recommendations.push('$.GitHub.actions.createPullRequest')
    recommendations.push('$.GitHub.triggers.pullRequestOpened')
  }

  // Data Scientist using Jupyter → suggest data pipeline integrations
  if (occupation === 'Data Scientist' && tools.includes('Jupyter Notebook')) {
    recommendations.push('$.GoogleSheets.actions.appendRow')
    recommendations.push('$.Postgres.actions.query')
  }

  // Any occupation using Slack → suggest communication integrations
  if (tools.includes('Slack')) {
    recommendations.push('$.Slack.actions.postMessage')
    recommendations.push('$.Gmail.actions.sendEmail')
  }

  return recommendations
}
