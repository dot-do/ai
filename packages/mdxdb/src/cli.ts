#!/usr/bin/env node

/**
 * mdxdb CLI
 *
 * Command-line interface for MDX database management
 */

import { Command } from 'commander'
import { createAuthCommands } from './commands/auth.js'
import { createDbCommands } from './commands/db.js'
import { config } from 'dotenv'

// Load environment variables
config()

const packageJson = {
  name: 'mdxdb',
  version: '0.1.0',
  description: 'MDX-powered database with schema validation and CMS integration',
}

const program = new Command()

program
  .name('mdxdb')
  .description(packageJson.description)
  .version(packageJson.version)

// Add command groups
program.addCommand(createAuthCommands())
program.addCommand(createDbCommands())

// Parse arguments
program.parse()
