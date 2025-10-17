#!/usr/bin/env node
/**
 * mdxld CLI
 * Manage MDX files with linked data ($id and $type)
 */

import { Command } from 'commander'
import chalk from 'chalk'
import { promises as fs } from 'fs'
import { parse, validateLinkedData } from './index.js'
import { createAuthCommands } from './commands/auth.js'

const program = new Command()

program
  .name('mdxld')
  .description('MDX Linked Data - Manage MDX files with $id and $type')
  .version('0.0.1')

// Auth commands
program.addCommand(createAuthCommands())

// Validate command
program
  .command('validate')
  .description('Validate MDX files for linked data compliance')
  .argument('<file>', 'Path to MDX file')
  .option('-v, --verbose', 'Verbose output')
  .action(async (file: string, options: { verbose?: boolean }) => {
    try {
      const content = await fs.readFile(file, 'utf-8')
      const doc = parse(content)
      const result = validateLinkedData(doc.data, { validateId: true })

      if (result.valid) {
        console.log(chalk.green('✓ Valid linked data document'))
        if (options.verbose && doc.data) {
          console.log(chalk.gray('\nLinked Data:'))
          console.log(JSON.stringify(doc.data, null, 2))
        }
      } else {
        console.log(chalk.red('✗ Validation errors:'))
        result.errors.forEach((error) => {
          console.log(chalk.red(`  - ${error}`))
        })
        process.exit(1)
      }
    } catch (error) {
      console.error(chalk.red('Error:', error instanceof Error ? error.message : String(error)))
      process.exit(1)
    }
  })

// Parse command
program
  .command('parse')
  .description('Parse MDX file and extract linked data')
  .argument('<file>', 'Path to MDX file')
  .option('-j, --json', 'Output as JSON')
  .action(async (file: string, options: { json?: boolean }) => {
    try {
      const content = await fs.readFile(file, 'utf-8')
      const doc = parse(content)

      if (options.json) {
        console.log(JSON.stringify(doc, null, 2))
      } else {
        console.log(chalk.bold('Linked Data:'))
        if (doc.data?.$id) {
          console.log(chalk.cyan('  $id:'), doc.data.$id)
        }
        if (doc.data?.$type) {
          console.log(chalk.cyan('  $type:'), doc.data.$type)
        }
        if (doc.data) {
          console.log(chalk.gray('\nAll linked data:'))
          console.log(JSON.stringify(doc.data, null, 2))
        }
      }
    } catch (error) {
      console.error(chalk.red('Error:', error instanceof Error ? error.message : String(error)))
      process.exit(1)
    }
  })

// Info command - show available schemas
program
  .command('info')
  .description('Show information about mdxld')
  .action(async () => {
    console.log(chalk.bold('mdxld - MDX Linked Data'))
    console.log(chalk.gray('\nSupports linked data in MDX frontmatter:'))
    console.log(chalk.cyan('  $id:'), 'Unique identifier (URI)')
    console.log(chalk.cyan('  $type:'), 'Resource type')
    console.log(chalk.cyan('  $context:'), 'JSON-LD context')
    console.log(chalk.gray('\nExample:'))
    console.log(`---
$id: https://example.com/posts/hello
$type: BlogPosting
title: Hello World
---`)
  })

program.parse()
