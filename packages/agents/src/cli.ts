#!/usr/bin/env node
/**
 * CLI for agents package
 */

import { readFileSync, writeFileSync } from 'fs'
import { parse } from './parser'
import { render } from './renderer'
import type { AgentFormat } from './types'

function printUsage() {
  console.log(`
agents - Universal agent configuration CLI

Usage:
  agents parse <file> [--format <format>]     Parse agent config file
  agents render <file> --to <format>          Render config to format
  agents convert <input> <output>             Convert between formats
  agents validate <file>                      Validate agent config
  agents help                                 Show this help

Formats:
  agents      agents.md format (default)
  cursor      .cursorrules format
  claude      CLAUDE.md format
  windsurf    windsurf format
  json        JSON format

Examples:
  agents parse agents.md
  agents render agents.md --to cursor > .cursorrules
  agents convert .cursorrules agents.md
  agents validate CLAUDE.md
`)
}

function main() {
  const args = process.argv.slice(2)

  if (args.length === 0 || args[0] === 'help' || args[0] === '--help') {
    printUsage()
    process.exit(0)
  }

  const command = args[0]

  try {
    switch (command) {
      case 'parse':
        handleParse(args.slice(1))
        break
      case 'render':
        handleRender(args.slice(1))
        break
      case 'convert':
        handleConvert(args.slice(1))
        break
      case 'validate':
        handleValidate(args.slice(1))
        break
      default:
        console.error(`Unknown command: ${command}`)
        printUsage()
        process.exit(1)
    }
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error)
    process.exit(1)
  }
}

function handleParse(args: string[]) {
  if (args.length === 0) {
    console.error('Missing file argument')
    process.exit(1)
  }

  const file = args[0]
  const formatIdx = args.indexOf('--format')
  const format = formatIdx >= 0 ? (args[formatIdx + 1] as AgentFormat) : undefined

  const content = readFileSync(file, 'utf-8')
  const config = parse(content, { format })

  console.log(JSON.stringify(config, null, 2))
}

function handleRender(args: string[]) {
  if (args.length === 0) {
    console.error('Missing file argument')
    process.exit(1)
  }

  const file = args[0]
  const toIdx = args.indexOf('--to')

  if (toIdx < 0) {
    console.error('Missing --to format argument')
    process.exit(1)
  }

  const format = args[toIdx + 1] as AgentFormat
  const content = readFileSync(file, 'utf-8')
  const config = parse(content)
  const rendered = render(config, { format, pretty: true })

  console.log(rendered)
}

function handleConvert(args: string[]) {
  if (args.length < 2) {
    console.error('Missing input or output file')
    process.exit(1)
  }

  const [input, output] = args
  const content = readFileSync(input, 'utf-8')
  const config = parse(content)

  // Detect output format from extension
  let format: AgentFormat = 'agents'
  if (output.endsWith('.cursorrules')) format = 'cursor'
  else if (output.includes('CLAUDE')) format = 'claude'
  else if (output.includes('windsurf')) format = 'windsurf'
  else if (output.endsWith('.json')) format = 'json'
  else if (output.endsWith('.md')) format = 'agents'

  const rendered = render(config, { format, pretty: true })
  writeFileSync(output, rendered, 'utf-8')

  console.log(`✓ Converted ${input} to ${output} (${format} format)`)
}

function handleValidate(args: string[]) {
  if (args.length === 0) {
    console.error('Missing file argument')
    process.exit(1)
  }

  const file = args[0]
  const content = readFileSync(file, 'utf-8')

  try {
    const config = parse(content)

    // Validate required fields
    if (!config.name) {
      throw new Error('Missing required field: name')
    }

    console.log('✓ Valid agent configuration')
    console.log(`  Name: ${config.name}`)
    if (config.rules) console.log(`  Rules: ${config.rules.length}`)
    if (config.capabilities) console.log(`  Capabilities: ${config.capabilities.length}`)
    if (config.examples) console.log(`  Examples: ${config.examples.length}`)
  } catch (error) {
    console.error('✗ Invalid agent configuration')
    throw error
  }
}

main()
