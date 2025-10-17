import axios from 'axios'
import type { TeamsConfig } from '../../core/types'

/**
 * Client for communicating with Microsoft Teams via webhook URLs
 */
export class TeamsApiClient {
  private webhookUrl: string

  constructor(webhookUrl: string) {
    this.webhookUrl = webhookUrl
  }

  /**
   * Send an Adaptive Card to Teams
   */
  async sendCard(card: any): Promise<{ id: string }> {
    if (!this.webhookUrl) {
      throw new Error('Teams webhook URL is required')
    }

    try {
      const response = await axios.post(this.webhookUrl, card)
      return { id: `teams-${Date.now()}` }
    } catch (error) {
      console.error('Error sending Teams Adaptive Card:', error)
      throw new Error(`Failed to send Teams message: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * Register a webhook for Teams responses
   */
  async registerWebhook(callbackUrl: string): Promise<void> {
    console.log(`Would register a webhook to ${callbackUrl} for Teams responses`)
  }
}

/**
 * Create an Adaptive Card for Teams
 */
export function createAdaptiveCard({
  title,
  description,
  options,
  freeText,
  taskId,
}: {
  title: string
  description: string
  options?: string[] | { value: string; label: string }[]
  freeText?: boolean
  taskId: string
}): any {
  const card = {
    type: 'AdaptiveCard',
    version: '1.2',
    body: [
      {
        type: 'TextBlock',
        size: 'Medium',
        weight: 'Bolder',
        text: title,
      },
      {
        type: 'TextBlock',
        text: description,
        wrap: true,
      },
    ],
    actions: [] as any[],
  }

  if (options && options.length > 0) {
    const choiceSet = {
      type: 'Input.ChoiceSet',
      id: 'userChoice',
      style: 'expanded',
      isMultiSelect: false,
      choices: [] as any[],
    }

    options.forEach((option) => {
      if (typeof option === 'string') {
        choiceSet.choices.push({
          title: option,
          value: option,
        })
      } else {
        choiceSet.choices.push({
          title: option.label,
          value: option.value,
        })
      }
    })

    card.body.push({
      type: 'TextBlock',
      text: 'Please select an option:',
      wrap: true,
    })

    card.actions.unshift({
      type: 'Action.ShowCard',
      title: 'Select Options',
      card: {
        type: 'AdaptiveCard',
        body: [choiceSet],
      },
    })
  }

  if (freeText) {
    card.body.push({
      type: 'TextBlock',
      text: 'Additional comments:',
      wrap: true,
    })

    card.actions.unshift({
      type: 'Action.ShowCard',
      title: 'Add Comments',
      card: {
        type: 'AdaptiveCard',
        body: [
          {
            type: 'Input.Text',
            id: 'userComment',
            placeholder: 'Enter your comments here...',
            isMultiline: true,
          },
        ],
      },
    })
  }

  card.actions.push({
    type: 'Action.Submit',
    title: 'Submit',
    data: {
      taskId: taskId,
    },
  })

  return card
}
