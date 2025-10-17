import type { HumanFunction, HumanTaskRequest, SlackConfig } from '../../core/types'

/**
 * Slack-specific response option
 */
export interface SlackResponseOption {
  value: string
  label: string
}

/**
 * Create a Slack message with the given options
 */
export async function createSlackMessage<TInput, TOutput>(
  taskId: string,
  input: TInput,
  config: SlackConfig & {
    title: string
    description: string
    options?: string[] | SlackResponseOption[]
    freeText?: boolean
  }
): Promise<{ messageId: string }> {
  try {
    console.log(`Creating Slack message for task ${taskId}`)

    const blocks: any[] = []

    blocks.push({
      type: 'header',
      text: {
        type: 'plain_text',
        text: config.title,
        emoji: true,
      },
    })

    blocks.push({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: config.description,
      },
    })

    blocks.push({ type: 'divider' })

    blocks.push({
      type: 'context',
      elements: [
        {
          type: 'mrkdwn',
          text: `*Task ID:* ${taskId}`,
        },
      ],
    })

    if (config.options && config.options.length > 0) {
      const actions: any[] = []

      config.options.forEach((option) => {
        const value = typeof option === 'string' ? option : option.value
        const label = typeof option === 'string' ? option : option.label

        actions.push({
          type: 'button',
          text: {
            type: 'plain_text',
            text: label,
            emoji: true,
          },
          value: value,
          action_id: `option_${value}_${taskId}`,
        })
      })

      blocks.push({
        type: 'actions',
        elements: actions,
      })
    }

    if (config.freeText) {
      blocks.push({
        type: 'input',
        block_id: `freetext_${taskId}`,
        label: {
          type: 'plain_text',
          text: 'Additional comments',
          emoji: true,
        },
        element: {
          type: 'plain_text_input',
          action_id: `freetext_input_${taskId}`,
          multiline: true,
        },
        optional: true,
      })

      blocks.push({
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Submit',
              emoji: true,
            },
            style: 'primary',
            value: 'submit',
            action_id: `submit_${taskId}`,
          },
        ],
      })
    }

    const finalBlocks = config.blocks || blocks

    const messagePayload = {
      channel: config.channel || process.env.SLACK_DEFAULT_CHANNEL,
      blocks: finalBlocks,
      text: config.title, // Fallback text
      thread_ts: config.thread_ts,
      attachments: config.attachments,
      response_type: config.response_type || 'in_channel',
    }

    const token = config.token || process.env.SLACK_BOT_TOKEN

    if (!token) {
      throw new Error('No Slack token provided. Add it to the config or set SLACK_BOT_TOKEN environment variable.')
    }

    if (!messagePayload.channel) {
      throw new Error('No Slack channel provided. Add it to the config or set SLACK_DEFAULT_CHANNEL environment variable.')
    }

    const response = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(messagePayload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to send Slack message: ${response.status} ${errorText}`)
    }

    const data = await response.json()

    if (!data.ok) {
      throw new Error(`Slack API error: ${data.error}`)
    }

    return { messageId: data.ts }
  } catch (error) {
    console.error('Error creating Slack message:', error)
    throw error
  }
}

/**
 * In-memory storage for Slack responses
 * TODO: Replace with a persistent storage solution
 */
const slackResponses = new Map<string, any>()

/**
 * Get the response for a Slack task
 */
export async function getSlackResponse<TOutput>(taskId: string): Promise<TOutput | null> {
  try {
    console.log(`Getting response for Slack task ${taskId}`)

    const response = slackResponses.get(taskId) as TOutput | undefined

    return response || null
  } catch (error) {
    console.error('Error getting Slack response:', error)
    throw error
  }
}

/**
 * Save a response for a Slack task
 * This would be called by your Slack webhook handler
 */
export function saveSlackResponse<TOutput>(taskId: string, response: TOutput): void {
  console.log(`Saving response for Slack task ${taskId}:`, response)
  slackResponses.set(taskId, response)
}

/**
 * Implementation of HumanFunction for Slack
 */
export class SlackHumanFunction<TInput, TOutput> implements HumanFunction<TInput, TOutput> {
  private config: SlackConfig & {
    title: string
    description: string
    options?: string[] | SlackResponseOption[]
    freeText?: boolean
  }

  constructor(
    config: SlackConfig & {
      title: string
      description: string
      options?: string[] | SlackResponseOption[]
      freeText?: boolean
    }
  ) {
    this.config = config
  }

  async request(input: TInput): Promise<HumanTaskRequest> {
    const taskId = `task-${Date.now()}`
    const { messageId } = await createSlackMessage<TInput, TOutput>(taskId, input, this.config)

    return {
      taskId,
      status: 'pending',
      messageId: {
        slack: messageId,
        teams: '',
        react: '',
        email: '',
      },
    }
  }

  async getResponse(taskId: string): Promise<TOutput | null> {
    return getSlackResponse<TOutput>(taskId)
  }
}
