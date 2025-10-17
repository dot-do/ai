#!/usr/bin/env node

/**
 * apis.do CLI - APIs.do API interaction
 *
 * Commands for interacting with APIs.do endpoints and managing authentication.
 *
 * @example
 * ```bash
 * apis auth login
 * apis api health
 * apis api generate "Write a haiku about TypeScript"
 * ```
 */

import { Command } from 'commander'
import { config } from 'dotenv'
import { createAuthCommands } from './commands/auth.js'
import { createApiCommands } from './commands/api.js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Load environment variables
config()

// Read package.json for version
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const packageJsonPath = join(__dirname, '..', 'package.json')
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))

// Create program
const program = new Command()

program
  .name('apis')
  .description('APIs.do CLI - Interact with the .do API platform')
  .version(packageJson.version)

// Add auth commands
program.addCommand(createAuthCommands())

// Add API commands
program.addCommand(createApiCommands())

// Parse arguments
program.parse()
