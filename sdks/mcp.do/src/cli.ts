#!/usr/bin/env node

/**
 * mcp.do CLI - Model Context Protocol testing and server interaction
 *
 * Commands for testing MCP servers, managing authentication, and executing tools.
 *
 * @example
 * ```bash
 * mcp auth login
 * mcp server tools npx @dotdo/mcp
 * mcp server execute npx @dotdo/mcp do '{"script": "$.Business.list"}'
 * ```
 */

import { Command } from 'commander'
import { config } from 'dotenv'
import { createAuthCommands } from './commands/auth.js'
import { createServerCommands } from './commands/server.js'
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
  .name('mcp')
  .description('Model Context Protocol CLI - Test and interact with MCP servers')
  .version(packageJson.version)

// Add auth commands
program.addCommand(createAuthCommands())

// Add server commands
program.addCommand(createServerCommands())

// Parse arguments
program.parse()
