#!/usr/bin/env node
/**
 * CLI interface for mdxai using commander for structured commands
 * This wraps the agentic CLI and adds authentication commands
 */

import { Command } from 'commander'
import { createAuthCommands } from './commands/auth.js'
import { spawn } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const program = new Command()

program
  .name('mdxai')
  .description('AI-powered MDX development tool with Claude Agents SDK')
  .version('0.0.1')

// Add authentication commands
program.addCommand(createAuthCommands())

// Default action: run the natural language agent
program
  .argument('[prompt...]', 'Natural language request for the AI agent')
  .action(async (prompt: string[]) => {
    // If prompt provided, run the agent CLI
    if (prompt && prompt.length > 0) {
      const cliPath = join(__dirname, 'cli.js')
      const child = spawn('node', [cliPath, ...prompt], {
        stdio: 'inherit',
        env: process.env,
      })

      child.on('exit', (code) => {
        process.exit(code || 0)
      })
    }
  })

program.parse()
