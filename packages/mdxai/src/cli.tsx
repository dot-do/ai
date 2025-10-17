#!/usr/bin/env node
/**
 * CLI interface for mdxai using react-ink
 *
 * All arguments are passed directly to the AI agent which has tools available
 */

import React, { useState, useEffect } from 'react'
import { render, Box, Text } from 'ink'
import { createAgent } from './agent'

interface CLIProps {
  args: string[]
}

function CLI({ args }: CLIProps) {
  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState<string>('')
  const [steps, setSteps] = useState<string[]>([])

  useEffect(() => {
    async function runAgent() {
      // If no arguments, show help
      if (args.length === 0) {
        setMessage(
          `mdxai - AI-powered MDX development tool

Usage: mdxai <your request in natural language>

Examples:
  mdxai generate a blog post about AI
  mdxai compile all MDX files in ./content
  mdxai validate the MDX files and fix any errors
  mdxai create a todo list for the project
  mdxai read README.mdx and generate a summary

The AI agent has access to these tools:
  - mdxe (compile, render, validate)
  - mdxdb (read, write files with frontmatter)
  - list (list files in directories)
  - todo (manage tasks)
  - forEach (iterate over items)
  - generate (recursive generation)

Just describe what you want in natural language, and the AI will use the appropriate tools.`
        )
        return
      }

      setStatus('running')
      setMessage('Starting AI agent...')

      try {
        const agent = createAgent()
        const prompt = args.join(' ')

        setMessage('AI agent is thinking and using tools...')

        const result = await agent.run({
          prompt,
          maxSteps: 20, // Allow more steps for complex tasks
        })

        // Show steps taken
        const stepDescriptions = result.steps
          .map((step, i) => {
            if (step.type === 'tool-call') {
              return `${i + 1}. Used tool: ${step.toolName}`
            } else if (step.text) {
              return `${i + 1}. Generated text (${step.text.length} chars)`
            }
            return null
          })
          .filter(Boolean) as string[]

        setSteps(stepDescriptions)
        setMessage(result.text)
        setStatus('success')
      } catch (error) {
        setStatus('error')
        setMessage(error instanceof Error ? error.message : String(error))
      }
    }

    runAgent()
  }, [args])

  return (
    <Box flexDirection="column">
      {status === 'running' && (
        <Box>
          <Text color="blue">⏳ Running...</Text>
        </Box>
      )}
      {status === 'success' && (
        <Box>
          <Text color="green">✓ Success</Text>
        </Box>
      )}
      {status === 'error' && (
        <Box>
          <Text color="red">✗ Error</Text>
        </Box>
      )}

      {steps.length > 0 && (
        <Box marginTop={1} flexDirection="column">
          <Text bold>Steps taken:</Text>
          {steps.map((step, i) => (
            <Text key={i} dimColor>
              {step}
            </Text>
          ))}
        </Box>
      )}

      {message && (
        <Box marginTop={1} flexDirection="column">
          <Text>{message}</Text>
        </Box>
      )}

      {status === 'success' && (
        <Box marginTop={1}>
          <Text dimColor>Need more help? Run: mdxai &lt;your request&gt;</Text>
        </Box>
      )}
    </Box>
  )
}

// Parse all command line arguments (no command parsing)
const args = process.argv.slice(2)

// Render the CLI
render(<CLI args={args} />)
