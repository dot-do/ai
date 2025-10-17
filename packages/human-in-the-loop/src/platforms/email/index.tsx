import React from 'react'
import type { HumanFunction, HumanTaskRequest, EmailConfig } from '../../core/types'

/**
 * Basic Email Template component
 */
export function EmailTemplate({
  taskId,
  title,
  description,
  options,
  callbackUrl,
}: {
  taskId: string
  title: string
  description: string
  options?: string[] | Array<{ value: string; label: string }>
  callbackUrl?: string
}) {
  return (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>

      {options && options.length > 0 && (
        <div>
          <p>Please select one of the following options:</p>
          <ul>
            {options.map((option, index) => {
              const value = typeof option === 'string' ? option : option.value
              const label = typeof option === 'string' ? option : option.label
              const responseUrl = callbackUrl ? `${callbackUrl}?taskId=${taskId}&option=${encodeURIComponent(value)}` : '#'

              return (
                <li key={index}>
                  <a href={responseUrl}>{label}</a>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      <p>Or, you can reply to this email with your response.</p>
    </div>
  )
}

/**
 * Mock function to send an email
 */
export async function sendEmail(
  config: EmailConfig & {
    title: string
    description: string
    options?: string[] | Array<{ value: string; label: string }>
    taskId: string
  }
): Promise<{ messageId: string }> {
  console.log(`Sending email to ${config.to}`)
  console.log(`Title: ${config.title}`)
  console.log(`Description: ${config.description}`)

  return { messageId: `email-${config.taskId}-${Date.now()}` }
}

/**
 * Get the response for an email task
 */
export async function getEmailResponse<TOutput>(taskId: string): Promise<TOutput | null> {
  console.log(`Getting response for email task ${taskId}`)

  return null
}

/**
 * Implementation of HumanFunction for Email
 */
export class EmailHumanFunction<TInput, TOutput> implements HumanFunction<TInput, TOutput> {
  private config: EmailConfig & {
    title: string
    description: string
    options?: string[] | Array<{ value: string; label: string }>
  }

  constructor(
    config: EmailConfig & {
      title: string
      description: string
      options?: string[] | Array<{ value: string; label: string }>
    }
  ) {
    this.config = config
  }

  async request(input: TInput): Promise<HumanTaskRequest> {
    const taskId = `task-${Date.now()}`

    const { messageId } = await sendEmail({
      ...this.config,
      taskId,
    })

    return {
      taskId,
      status: 'pending',
      messageId: {
        slack: '',
        teams: '',
        react: '',
        email: messageId,
      },
    }
  }

  async getResponse(taskId: string): Promise<TOutput | null> {
    return getEmailResponse<TOutput>(taskId)
  }

  /**
   * Get a React component for this email template
   */
  getEmailComponent(taskId: string): React.ReactNode {
    return (
      <EmailTemplate
        taskId={taskId}
        title={this.config.title}
        description={this.config.description}
        options={this.config.options}
        callbackUrl={this.config.callbackUrl}
      />
    )
  }
}
