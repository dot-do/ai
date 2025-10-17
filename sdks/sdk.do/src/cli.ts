#!/usr/bin/env node

/**
 * sdk.do CLI - SDK.do platform interaction
 *
 * Commands for interacting with SDK.do platform and managing authentication.
 *
 * @example
 * ```bash
 * sdk auth login
 * sdk exec run "$.Business.list()"
 * sdk exec entities
 * ```
 */

import { Command } from 'commander'
import { config } from 'dotenv'
import { createAuthCommands } from './commands/auth.js'
import { createSdkCommands } from './commands/sdk.js'
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
  .name('sdk')
  .description('SDK.do CLI - Interact with the .do platform SDK')
  .version(packageJson.version)

// Add auth commands
program.addCommand(createAuthCommands())

// Add SDK commands
program.addCommand(createSdkCommands())

// Parse arguments
program.parse()
