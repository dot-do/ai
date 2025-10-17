import React, { useState } from 'react'
import type { HumanFunction, HumanTaskRequest, ReactConfig } from '../../core/types'

/**
 * Props for the HumanFeedback component
 */
export interface HumanFeedbackProps<TInput, TOutput> {
  taskId: string
  title: string
  description: string
  input: TInput
  options?: string[] | Array<{ value: string; label: string }>
  freeText?: boolean
  onSubmit: (response: Partial<TOutput>) => void
  config?: ReactConfig
}

/**
 * Simple React component for human feedback
 */
export function HumanFeedback<TInput, TOutput>({
  taskId,
  title,
  description,
  input,
  options,
  freeText,
  onSubmit,
  config,
}: HumanFeedbackProps<TInput, TOutput>) {
  const [response, setResponse] = useState<string>('')
  const [selectedOption, setSelectedOption] = useState<string>('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const responseObj: Record<string, any> = {}

    if (selectedOption) {
      responseObj.selectedOption = selectedOption
    }

    if (response) {
      responseObj.freeText = response
    }

    onSubmit(responseObj as Partial<TOutput>)
  }

  const styles = {
    container: {
      maxWidth: '500px',
      margin: '0 auto',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      backgroundColor: config?.theme === 'dark' ? '#1a1a1a' : '#fff',
      color: config?.theme === 'dark' ? '#fff' : '#333',
      ...config?.styles?.container,
    },
    title: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '10px',
      ...config?.styles?.title,
    },
    description: {
      marginBottom: '20px',
      ...config?.styles?.description,
    },
    optionsContainer: {
      marginBottom: '20px',
      ...config?.styles?.optionsContainer,
    },
    option: {
      display: 'block',
      margin: '8px 0',
      ...config?.styles?.option,
    },
    textarea: {
      width: '100%',
      padding: '10px',
      borderRadius: '4px',
      border: '1px solid #ccc',
      minHeight: '100px',
      marginBottom: '20px',
      backgroundColor: config?.theme === 'dark' ? '#333' : '#fff',
      color: config?.theme === 'dark' ? '#fff' : '#333',
      ...config?.styles?.textarea,
    },
    button: {
      padding: '10px 20px',
      backgroundColor: '#0070f3',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      ...config?.styles?.button,
    },
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>{title}</h2>
      <p style={styles.description}>{description}</p>

      <form onSubmit={handleSubmit}>
        {options && options.length > 0 && (
          <div style={styles.optionsContainer}>
            {options.map((option, index) => {
              const value = typeof option === 'string' ? option : option.value
              const label = typeof option === 'string' ? option : option.label

              return (
                <label key={index} style={styles.option}>
                  <input type="radio" name="option" value={value} checked={selectedOption === value} onChange={() => setSelectedOption(value)} /> {label}
                </label>
              )
            })}
          </div>
        )}

        {freeText && <textarea style={styles.textarea} value={response} onChange={(e) => setResponse(e.target.value)} placeholder="Enter your response..." />}

        <button type="submit" style={styles.button}>
          Submit
        </button>
      </form>
    </div>
  )
}

/**
 * Storage for in-memory responses (in a real implementation, this would be a database)
 */
const responses = new Map<string, any>()
const tasks = new Map<string, { status: 'pending' | 'completed' | 'timeout' }>()

/**
 * Implementation of HumanFunction for React
 */
export class ReactHumanFunction<TInput, TOutput> implements HumanFunction<TInput, TOutput> {
  private config: ReactConfig & {
    title: string
    description: string
    options?: string[] | Array<{ value: string; label: string }>
    freeText?: boolean
  }

  constructor(
    config: ReactConfig & {
      title: string
      description: string
      options?: string[] | Array<{ value: string; label: string }>
      freeText?: boolean
    }
  ) {
    this.config = config
  }

  async request(input: TInput): Promise<HumanTaskRequest> {
    const taskId = `task-${Date.now()}`

    tasks.set(taskId, { status: 'pending' })

    return {
      taskId,
      status: 'pending',
      messageId: {
        slack: '',
        teams: '',
        react: taskId,
        email: '',
      },
    }
  }

  async getResponse(taskId: string): Promise<TOutput | null> {
    const response = responses.get(taskId)
    return response || null
  }

  /**
   * Handle a response submission
   */
  handleResponse(taskId: string, response: TOutput): void {
    responses.set(taskId, response)
    tasks.set(taskId, { status: 'completed' })
  }

  /**
   * Get a React component for this human function
   */
  getComponent(taskId: string, input: TInput): React.ReactNode {
    return (
      <HumanFeedback<TInput, TOutput>
        taskId={taskId}
        title={this.config.title}
        description={this.config.description}
        input={input}
        options={this.config.options}
        freeText={this.config.freeText}
        config={this.config}
        onSubmit={(response) => this.handleResponse(taskId, response as TOutput)}
      />
    )
  }
}
