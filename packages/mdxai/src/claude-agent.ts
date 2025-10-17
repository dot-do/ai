/**
 * Claude Agents SDK integration for mdxai
 * Provides an alternative agent backend using Anthropic's Claude
 */

import Anthropic from '@anthropic-ai/sdk'
import type { AgentOptions, AgentResult } from './agent'
import { tools } from './tools'

export interface ClaudeAgentConfig {
  apiKey?: string
  model?: string
  maxTokens?: number
  temperature?: number
}

/**
 * Claude-powered agent using Anthropic SDK
 * Integrates with existing mdxai tools
 */
export class ClaudeAgent {
  private client: Anthropic
  private config: ClaudeAgentConfig

  constructor(config: ClaudeAgentConfig = {}) {
    this.config = {
      model: 'claude-sonnet-4.5',
      maxTokens: 4096,
      temperature: 1,
      ...config,
    }

    this.client = new Anthropic({
      apiKey: config.apiKey || process.env.ANTHROPIC_API_KEY || process.env.DO_TOKEN,
    })
  }

  /**
   * Run agent with tool support
   * Compatible with existing MdxAgent interface
   */
  async run(options: AgentOptions): Promise<AgentResult> {
    const {
      prompt,
      system = 'You are an AI assistant for MDX development. Use the available tools to help users with MDX-related tasks.',
      maxSteps = 10,
      temperature = this.config.temperature,
      maxTokens = this.config.maxTokens,
    } = options

    const steps: any[] = []
    let conversationHistory: Anthropic.MessageParam[] = [
      {
        role: 'user',
        content: prompt,
      },
    ]

    // Convert mdxai tools to Anthropic tool format
    const anthropicTools = Object.entries(tools).map(([name, tool]) => ({
      name,
      description: tool.description || `Tool: ${name}`,
      input_schema: tool.parameters || {
        type: 'object',
        properties: {},
        required: [],
      },
    }))

    let finalText = ''
    let stepCount = 0

    while (stepCount < maxSteps) {
      stepCount++

      const response = await this.client.messages.create({
        model: this.config.model!,
        max_tokens: maxTokens!,
        temperature: temperature!,
        system,
        messages: conversationHistory,
        tools: anthropicTools,
      })

      // Process response
      let hasToolCalls = false
      const toolResults: Anthropic.MessageParam[] = []

      for (const block of response.content) {
        if (block.type === 'text') {
          finalText = block.text
          steps.push({
            type: 'text',
            text: block.text,
          })
        } else if (block.type === 'tool_use') {
          hasToolCalls = true
          const tool = tools[block.name as keyof typeof tools]

          if (tool) {
            try {
              const result = await tool.execute(block.input)
              steps.push({
                type: 'tool-call',
                toolName: block.name,
                toolArgs: block.input,
                toolResult: result,
              })

              toolResults.push({
                role: 'user',
                content: [
                  {
                    type: 'tool_result',
                    tool_use_id: block.id,
                    content: typeof result === 'string' ? result : JSON.stringify(result),
                  },
                ],
              })
            } catch (error) {
              toolResults.push({
                role: 'user',
                content: [
                  {
                    type: 'tool_result',
                    tool_use_id: block.id,
                    content: `Error: ${error instanceof Error ? error.message : String(error)}`,
                    is_error: true,
                  },
                ],
              })
            }
          }
        }
      }

      // Add assistant response to history
      conversationHistory.push({
        role: 'assistant',
        content: response.content,
      })

      // If there were tool calls, add results and continue
      if (hasToolCalls && toolResults.length > 0) {
        conversationHistory.push(...toolResults)
        continue
      }

      // No more tool calls, we're done
      break
    }

    return {
      text: finalText,
      steps,
      usage: {
        promptTokens: 0, // TODO: Track token usage
        completionTokens: 0,
        totalTokens: 0,
      },
    }
  }

  /**
   * Simple text generation without tools
   */
  async generateText(options: {
    prompt: string
    system?: string
    temperature?: number
    maxTokens?: number
  }): Promise<string> {
    const response = await this.client.messages.create({
      model: this.config.model!,
      max_tokens: options.maxTokens || this.config.maxTokens!,
      temperature: options.temperature || this.config.temperature!,
      system: options.system,
      messages: [
        {
          role: 'user',
          content: options.prompt,
        },
      ],
    })

    const textBlock = response.content.find((block) => block.type === 'text')
    return textBlock && textBlock.type === 'text' ? textBlock.text : ''
  }
}

/**
 * Create a Claude-powered agent
 */
export function createClaudeAgent(config: ClaudeAgentConfig = {}): ClaudeAgent {
  return new ClaudeAgent(config)
}
