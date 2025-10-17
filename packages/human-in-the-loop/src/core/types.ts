import { z } from 'zod'

/**
 * Supported platforms for human-in-the-loop interactions
 */
export type HumanPlatform = 'slack' | 'teams' | 'react' | 'email'

/**
 * Status of a human task
 */
export type HumanTaskStatus = 'pending' | 'completed' | 'timeout'

/**
 * Base configuration for Human Functions
 */
export interface HumanFunctionConfig {
  /**
   * Title of the request shown to humans
   */
  title: string

  /**
   * Description of the task for humans
   */
  description: string

  /**
   * Platform to use for human interaction
   */
  platform: HumanPlatform

  /**
   * Timeout in milliseconds after which the task is marked as timed out
   */
  timeout?: number

  /**
   * Additional platform-specific options
   */
  [key: string]: any
}

/**
 * A request for human input
 */
export interface HumanTaskRequest {
  /**
   * Unique identifier for the task
   */
  taskId: string

  /**
   * Current status of the task
   */
  status: HumanTaskStatus

  /**
   * Platform-specific message ID
   */
  messageId?: Record<HumanPlatform, string>
}

/**
 * Human Function interface with strongly-typed input and output
 */
export interface HumanFunction<TInput, TOutput> {
  /**
   * Request human input with the given input data
   */
  request(input: TInput): Promise<HumanTaskRequest>

  /**
   * Get the human response for a given task
   */
  getResponse(taskId: string): Promise<TOutput | null>
}

/**
 * Platform-specific configurations
 */
export interface PlatformConfigs {
  slack?: SlackConfig
  teams?: TeamsConfig
  react?: ReactConfig
  email?: EmailConfig
}

/**
 * Slack-specific configuration
 */
export interface SlackConfig {
  /**
   * Slack channel to send the message to
   */
  channel?: string

  /**
   * User IDs to mention in the message
   */
  mentions?: string[]

  /**
   * Whether to use a modal dialog instead of a message
   */
  modal?: boolean

  /**
   * Custom Slack blocks
   */
  blocks?: any[]

  /**
   * Webhook URL for callbacks
   */
  webhookUrl?: string

  /**
   * Slack API token
   */
  token?: string

  /**
   * Thread timestamp to reply in a thread
   */
  thread_ts?: string

  /**
   * Message attachments
   */
  attachments?: any[]

  /**
   * Response type ('in_channel' or 'ephemeral')
   */
  response_type?: 'in_channel' | 'ephemeral'
}

/**
 * Microsoft Teams specific configuration
 */
export interface TeamsConfig {
  /**
   * Teams webhook URL
   */
  webhookUrl?: string

  /**
   * Whether to use adaptive cards
   */
  useAdaptiveCards?: boolean

  /**
   * Authentication token for Teams API
   */
  token?: string

  /**
   * Callback URL for Teams webhook responses
   */
  callbackUrl?: string

  /**
   * Team/channel ID to send messages to
   */
  channelId?: string

  /**
   * Bot name to use for messages
   */
  botName?: string
}

/**
 * React-specific configuration
 */
export interface ReactConfig {
  /**
   * Custom component styling
   */
  styles?: Record<string, any>

  /**
   * Theme configuration
   */
  theme?: 'light' | 'dark' | 'system'
}

/**
 * Email-specific configuration
 */
export interface EmailConfig {
  /**
   * Recipients of the email
   */
  to: string | string[]

  /**
   * CC recipients
   */
  cc?: string | string[]

  /**
   * BCC recipients
   */
  bcc?: string | string[]

  /**
   * From address
   */
  from?: string

  /**
   * Reply-to address
   */
  replyTo?: string

  /**
   * Callback URL for email responses
   */
  callbackUrl?: string
}

/**
 * Options for creating human functions
 */
export interface CreateHumanFunctionOptions extends HumanFunctionConfig, PlatformConfigs {
  /**
   * Optional validation schema for the output
   */
  outputSchema?: z.ZodType<any>
}
