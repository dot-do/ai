/**
 * Orchestration Commands
 *
 * Master CLI orchestrator that can invoke other .do CLIs:
 * - mcp.do CLI for MCP server interactions
 * - apis.do CLI for API platform interactions
 * - sdk.do CLI for SDK operations
 */

import { Command } from 'commander'
import chalk from 'chalk'
import { spawn } from 'child_process'

/**
 * Execute a CLI command and stream output
 */
async function executeSubCLI(cli: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(cli, args, {
      stdio: 'inherit',
      shell: true,
    })

    child.on('error', (error) => {
      reject(new Error(`Failed to execute ${cli}: ${error.message}`))
    })

    child.on('exit', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`${cli} exited with code ${code}`))
      }
    })
  })
}

export function createOrchestrationCommands(): Command {
  const orchestrate = new Command('orchestrate').alias('x').description('Orchestrate multiple .do CLIs')

  /**
   * MCP CLI integration
   */
  orchestrate
    .command('mcp <command> [args...]')
    .description('Execute MCP CLI commands')
    .allowUnknownOption()
    .action(async (command, args) => {
      try {
        console.log(chalk.cyan(`Executing: mcp ${command} ${args.join(' ')}\n`))
        await executeSubCLI('mcp', [command, ...args])
      } catch (error) {
        console.error(chalk.red(error instanceof Error ? error.message : String(error)))
        process.exit(1)
      }
    })

  /**
   * APIs CLI integration
   */
  orchestrate
    .command('apis <command> [args...]')
    .description('Execute APIs.do CLI commands')
    .allowUnknownOption()
    .action(async (command, args) => {
      try {
        console.log(chalk.cyan(`Executing: apis ${command} ${args.join(' ')}\n`))
        await executeSubCLI('apis', [command, ...args])
      } catch (error) {
        console.error(chalk.red(error instanceof Error ? error.message : String(error)))
        process.exit(1)
      }
    })

  /**
   * SDK CLI integration
   */
  orchestrate
    .command('sdk <command> [args...]')
    .description('Execute SDK.do CLI commands')
    .allowUnknownOption()
    .action(async (command, args) => {
      try {
        console.log(chalk.cyan(`Executing: sdk ${command} ${args.join(' ')}\n`))
        await executeSubCLI('sdk', [command, ...args])
      } catch (error) {
        console.error(chalk.red(error instanceof Error ? error.message : String(error)))
        process.exit(1)
      }
    })

  /**
   * Batch execution - run multiple CLI commands in sequence
   */
  orchestrate
    .command('batch <commands...>')
    .description('Execute multiple CLI commands in sequence')
    .option('-c, --continue-on-error', 'Continue execution even if a command fails')
    .action(async (commands, options) => {
      console.log(chalk.cyan(`Executing ${commands.length} commands in sequence\n`))

      for (let i = 0; i < commands.length; i++) {
        const command = commands[i]
        console.log(chalk.bold(`\n[${i + 1}/${commands.length}] ${command}`))

        try {
          // Parse command (format: "cli:command:arg1:arg2")
          const parts = command.split(':')
          if (parts.length < 2) {
            throw new Error(`Invalid command format: ${command}. Use "cli:command:arg1:arg2"`)
          }

          const [cli, cmd, ...args] = parts
          await executeSubCLI(cli, [cmd, ...args])

          console.log(chalk.green(`✓ Completed: ${command}\n`))
        } catch (error) {
          console.error(chalk.red(`✗ Failed: ${command}`))
          console.error(chalk.red(error instanceof Error ? error.message : String(error)))

          if (!options.continueOnError) {
            console.error(chalk.yellow('\nStopping execution due to error'))
            process.exit(1)
          } else {
            console.log(chalk.yellow('Continuing to next command...\n'))
          }
        }
      }

      console.log(chalk.green(`\n✓ Batch execution completed`))
    })

  /**
   * Parallel execution - run multiple CLI commands in parallel
   */
  orchestrate
    .command('parallel <commands...>')
    .description('Execute multiple CLI commands in parallel')
    .action(async (commands) => {
      console.log(chalk.cyan(`Executing ${commands.length} commands in parallel\n`))

      const promises = commands.map(async (command: string, i: number) => {
        console.log(chalk.bold(`[${i + 1}/${commands.length}] Starting: ${command}`))

        try {
          // Parse command (format: "cli:command:arg1:arg2")
          const parts = command.split(':')
          if (parts.length < 2) {
            throw new Error(`Invalid command format: ${command}. Use "cli:command:arg1:arg2"`)
          }

          const [cli, cmd, ...args] = parts
          await executeSubCLI(cli, [cmd, ...args])

          console.log(chalk.green(`✓ Completed: ${command}`))
          return { command, success: true }
        } catch (error) {
          console.error(chalk.red(`✗ Failed: ${command}`))
          console.error(chalk.red(error instanceof Error ? error.message : String(error)))
          return { command, success: false, error }
        }
      })

      const results = await Promise.allSettled(promises)

      const successful = results.filter((r) => r.status === 'fulfilled' && r.value.success).length
      const failed = results.length - successful

      console.log(chalk.cyan(`\nParallel execution completed:`))
      console.log(chalk.green(`  ✓ Successful: ${successful}`))
      if (failed > 0) {
        console.log(chalk.red(`  ✗ Failed: ${failed}`))
        process.exit(1)
      }
    })

  /**
   * List available CLIs
   */
  orchestrate
    .command('list')
    .description('List available .do CLIs')
    .action(() => {
      console.log(chalk.cyan('\nAvailable .do CLIs:\n'))
      console.log(chalk.green('  • mcp') + chalk.gray('   - Model Context Protocol server interaction'))
      console.log(chalk.green('  • apis') + chalk.gray('  - APIs.do platform interaction'))
      console.log(chalk.green('  • sdk') + chalk.gray('   - SDK.do platform operations'))
      console.log(chalk.green('  • do') + chalk.gray('    - Main CLI (current)'))
      console.log()
      console.log(chalk.cyan('Examples:'))
      console.log(chalk.white('  do orchestrate mcp server tools npx @dotdo/mcp'))
      console.log(chalk.white('  do orchestrate apis api health'))
      console.log(chalk.white('  do orchestrate sdk exec entities'))
      console.log(chalk.white('  do x batch "mcp:auth:status" "apis:auth:status" "sdk:auth:status"'))
      console.log()
    })

  return orchestrate
}
