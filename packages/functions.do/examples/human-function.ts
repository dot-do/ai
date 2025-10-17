/**
 * Human Function Examples
 *
 * Human-in-the-loop via Slack BlockKit, Discord, Email, etc.
 */

import { defineHumanFunction, execute } from '../src'
import { z } from 'zod'

// Expense approval via Slack
export const approveExpense = defineHumanFunction({
  name: 'approveExpense',
  description: 'Request human approval for an expense',
  input: z.object({
    amount: z.number(),
    description: z.string(),
    category: z.string(),
    submitter: z.string(),
  }),
  output: z.object({
    approved: z.boolean(),
    notes: z.string().optional(),
    approver: z.string(),
  }),
  uiType: 'slack',
  render: (input, ctx) => ({
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '💰 Expense Approval Request',
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Amount:*\n$${input.amount.toFixed(2)}`,
          },
          {
            type: 'mrkdwn',
            text: `*Category:*\n${input.category}`,
          },
          {
            type: 'mrkdwn',
            text: `*Submitted by:*\n${input.submitter}`,
          },
          {
            type: 'mrkdwn',
            text: `*Description:*\n${input.description}`,
          },
        ],
      },
      {
        type: 'divider',
      },
      {
        type: 'input',
        block_id: 'notes_input',
        element: {
          type: 'plain_text_input',
          action_id: 'notes',
          placeholder: {
            type: 'plain_text',
            text: 'Add notes (optional)',
          },
          multiline: true,
        },
        label: {
          type: 'plain_text',
          text: 'Notes',
        },
        optional: true,
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: '✅ Approve',
            },
            value: 'approve',
            style: 'primary',
            action_id: 'approve_button',
          },
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: '❌ Reject',
            },
            value: 'reject',
            style: 'danger',
            action_id: 'reject_button',
          },
        ],
      },
    ],
  }),
  responseTimeout: 3600000, // 1 hour
  reminderInterval: 1800000, // 30 minutes
  parseResponse: (response) => ({
    approved: response.action === 'approve',
    notes: response.notes || '',
    approver: response.user.email,
  }),
  handler: async (input, ctx) => {
    // Human worker handles UI and response
    return {
      approved: false,
      approver: '',
    }
  },
})

// Code review via Slack
export const reviewCode = defineHumanFunction({
  name: 'reviewCode',
  description: 'Request human code review',
  input: z.object({
    pullRequest: z.string(),
    author: z.string(),
    changes: z.number(),
    description: z.string(),
  }),
  output: z.object({
    approved: z.boolean(),
    feedback: z.string(),
    reviewer: z.string(),
  }),
  uiType: 'slack',
  render: (input, ctx) => ({
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '🔍 Code Review Request',
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Pull Request:* <${input.pullRequest}|View PR>\n*Author:* ${input.author}\n*Files changed:* ${input.changes}`,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Description:*\n${input.description}`,
        },
      },
      {
        type: 'input',
        block_id: 'feedback_input',
        element: {
          type: 'plain_text_input',
          action_id: 'feedback',
          placeholder: {
            type: 'plain_text',
            text: 'Provide your feedback',
          },
          multiline: true,
        },
        label: {
          type: 'plain_text',
          text: 'Feedback',
        },
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: { type: 'plain_text', text: '✅ Approve' },
            value: 'approve',
            style: 'primary',
          },
          {
            type: 'button',
            text: { type: 'plain_text', text: '💬 Request Changes' },
            value: 'changes',
            style: 'danger',
          },
        ],
      },
    ],
  }),
  responseTimeout: 7200000, // 2 hours
  reminderInterval: 3600000, // 1 hour
  handler: async (input, ctx) => {
    return {
      approved: false,
      feedback: '',
      reviewer: '',
    }
  },
})

// Content approval via email
export const approveContent = defineHumanFunction({
  name: 'approveContent',
  description: 'Request content approval via email',
  input: z.object({
    title: z.string(),
    content: z.string(),
    platform: z.string(),
    scheduledFor: z.string(),
  }),
  output: z.object({
    approved: z.boolean(),
    edits: z.string().optional(),
    approver: z.string(),
  }),
  uiType: 'email',
  render: (input, ctx) => ({
    to: ctx.user?.email,
    subject: `Content Approval: ${input.title}`,
    html: `
      <h2>Content Approval Request</h2>
      <p><strong>Title:</strong> ${input.title}</p>
      <p><strong>Platform:</strong> ${input.platform}</p>
      <p><strong>Scheduled for:</strong> ${input.scheduledFor}</p>
      <hr>
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
        ${input.content}
      </div>
      <hr>
      <p>
        <a href="{{approveUrl}}" style="background: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          ✅ Approve
        </a>
        <a href="{{editUrl}}" style="background: #ffc107; color: black; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-left: 10px;">
          ✏️ Request Edits
        </a>
        <a href="{{rejectUrl}}" style="background: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-left: 10px;">
          ❌ Reject
        </a>
      </p>
    `,
  }),
  responseTimeout: 86400000, // 24 hours
  reminderInterval: 14400000, // 4 hours
  handler: async (input, ctx) => {
    return {
      approved: false,
      approver: '',
    }
  },
})

// Design feedback via web interface
export const reviewDesign = defineHumanFunction({
  name: 'reviewDesign',
  description: 'Request design review via web interface',
  input: z.object({
    designUrl: z.string(),
    description: z.string(),
    designer: z.string(),
  }),
  output: z.object({
    approved: z.boolean(),
    feedback: z.array(
      z.object({
        x: z.number(),
        y: z.number(),
        comment: z.string(),
      })
    ),
    reviewer: z.string(),
  }),
  uiType: 'web',
  render: (input, ctx) => ({
    component: 'DesignReview',
    props: {
      imageUrl: input.designUrl,
      description: input.description,
      designer: input.designer,
      executionId: ctx.executionId,
    },
  }),
  responseTimeout: 7200000, // 2 hours
  reminderInterval: 3600000, // 1 hour
  handler: async (input, ctx) => {
    return {
      approved: false,
      feedback: [],
      reviewer: '',
    }
  },
})

// Decision making via Discord
export const makeDecision = defineHumanFunction({
  name: 'makeDecision',
  description: 'Request a decision via Discord',
  input: z.object({
    question: z.string(),
    options: z.array(
      z.object({
        label: z.string(),
        value: z.string(),
        description: z.string(),
      })
    ),
    context: z.string(),
  }),
  output: z.object({
    choice: z.string(),
    reasoning: z.string(),
    decider: z.string(),
  }),
  uiType: 'discord',
  render: (input, ctx) => ({
    embeds: [
      {
        title: '🤔 Decision Required',
        description: input.question,
        color: 0x5865f2,
        fields: [
          {
            name: 'Context',
            value: input.context,
          },
          ...input.options.map((opt, i) => ({
            name: `${i + 1}. ${opt.label}`,
            value: opt.description,
          })),
        ],
      },
    ],
    components: [
      {
        type: 1,
        components: input.options.map((opt, i) => ({
          type: 2,
          style: i === 0 ? 1 : 2,
          label: opt.label,
          custom_id: `option_${opt.value}`,
        })),
      },
    ],
  }),
  responseTimeout: 3600000, // 1 hour
  reminderInterval: 1800000, // 30 minutes
  handler: async (input, ctx) => {
    return {
      choice: '',
      reasoning: '',
      decider: '',
    }
  },
})

// Example usage
async function main() {
  // Request expense approval
  const expense = await execute('fn_approve_expense', {
    amount: 500,
    description: 'New laptop for development',
    category: 'Equipment',
    submitter: 'john@example.com',
  })
  console.log('Expense decision:', expense.output)

  // Request code review
  const review = await execute('fn_review_code', {
    pullRequest: 'https://github.com/org/repo/pull/123',
    author: 'jane@example.com',
    changes: 15,
    description: 'Add new authentication feature',
  })
  console.log('Review feedback:', review.output)

  // Request decision
  const decision = await execute('fn_make_decision', {
    question: 'Which cloud provider should we use?',
    options: [
      { label: 'AWS', value: 'aws', description: 'Most mature, extensive services' },
      { label: 'GCP', value: 'gcp', description: 'Best for ML/AI workloads' },
      { label: 'Cloudflare', value: 'cloudflare', description: 'Edge-first, simplest' },
    ],
    context: 'We need to deploy our new application with global edge distribution.',
  })
  console.log('Decision made:', decision.output)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}
