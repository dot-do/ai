#!/usr/bin/env node

/**
 * agents.do CLI
 *
 * Command-line interface for autonomous agent orchestration
 */

import { Command } from 'commander'
import { createAuthCommands } from './commands/auth.js'
import { createAgentCommands } from './commands/agents.js'
import { config } from 'dotenv'

// Load environment variables
config()

const packageJson = {
  name: 'agents.do',
  version: '1.0.0',
  description: 'CLI for autonomous agent orchestration',
}

const program = new Command()

program
  .name('agents')
  .description(packageJson.description)
  .version(packageJson.version)

// Add command groups
program.addCommand(createAuthCommands())
program.addCommand(createAgentCommands())

// Parse arguments
program.parse()
