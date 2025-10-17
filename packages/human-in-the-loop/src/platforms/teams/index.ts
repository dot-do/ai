import type { HumanFunction, HumanTaskRequest, TeamsConfig } from '../../core/types'
import { TeamsApiClient, createAdaptiveCard } from './client'

/**
 * Teams-specific response option
 */
export interface TeamsResponseOption {
  value: string
  label: string
}

/**
 * Create a Teams message with the given options
 */
export async function createTeamsMessage<TInput, TOutput>(
  taskId: string,
  input: TInput,
  config: TeamsConfig & {
    title: string
    description: string
    options?: string[] | TeamsResponseOption[]
    freeText?: boolean
  }
): Promise<{ messageId: string }> {
  if (!config.webhookUrl) {
    throw new Error('Teams webhook URL is required')
  }

  try {
    const client = new TeamsApiClient(config.webhookUrl)

    const card = createAdaptiveCard({
      title: config.title,
      description: config.description,
      options: config.options,
      freeText: config.freeText,
      taskId,
    })

    const response = await client.sendCard(card)
    return { messageId: response.id }
  } catch (error) {
    console.error('Error creating Teams message:', error)
    throw new Error(`Failed to create Teams message: ${error instanceof Error ? error.message : String(error)}`)
  }
}

const responseStore = new Map<string, any>()

/**
 * Get the response for a Teams task
 */
export async function getTeamsResponse<TOutput>(taskId: string): Promise<TOutput | null> {
  const response = responseStore.get(taskId)
  if (!response) {
    return null
  }

  return response as TOutput
}

/**
 * Store a response from Teams
 */
export function storeTeamsResponse(taskId: string, response: any): void {
  responseStore.set(taskId, response)
}

/**
 * Register a webhook handler for Teams responses
 */
export function registerTeamsWebhook(config: TeamsConfig): void {
  if (!config.webhookUrl || !config.callbackUrl) {
    console.warn('Both webhookUrl and callbackUrl are required to register a Teams webhook')
    return
  }

  try {
    const client = new TeamsApiClient(config.webhookUrl)
    client.registerWebhook(config.callbackUrl)
  } catch (error) {
    console.error('Error registering Teams webhook:', error)
  }
}

/**
 * Implementation of HumanFunction for Microsoft Teams
 */
export class TeamsHumanFunction<TInput, TOutput> implements HumanFunction<TInput, TOutput> {
  private config: TeamsConfig & {
    title: string
    description: string
    options?: string[] | TeamsResponseOption[]
    freeText?: boolean
  }

  constructor(
    config: TeamsConfig & {
      title: string
      description: string
      options?: string[] | TeamsResponseOption[]
      freeText?: boolean
    }
  ) {
    this.config = config
  }

  async request(input: TInput): Promise<HumanTaskRequest> {
    const taskId = `task-${Date.now()}`
    const { messageId } = await createTeamsMessage<TInput, TOutput>(taskId, input, this.config)

    return {
      taskId,
      status: 'pending',
      messageId: {
        slack: '',
        teams: messageId,
        react: '',
        email: '',
      },
    }
  }

  async getResponse(taskId: string): Promise<TOutput | null> {
    return getTeamsResponse<TOutput>(taskId)
  }
}
