#!/usr/bin/env node
import { spawn } from 'child_process'
import path from 'path'
import fs from 'fs'
import { initDirectory } from './index'

/**
 * CLI implementation for Next.js command proxying
 */
export async function cli() {
  const [, , command, ...args] = process.argv

  const { nextConfig, appDir } = await initDirectory()

  if (!['dev', 'build', 'start'].includes(command)) {
    console.error(`Unsupported command: ${command}`)
    console.log('Supported commands: dev, build, start')
    process.exit(1)
  }

  await executeNextCommand(command, args, nextConfig, appDir)
}

/**
 * Execute a Next.js command
 */
async function executeNextCommand(command: string, args: string[], nextConfig: Record<string, any>, appDir: string) {
  const nextBinPath = resolveNextBin()
  if (!nextBinPath) {
    console.error('Could not find Next.js binary. Make sure Next.js is installed.')
    process.exit(1)
  }

  const env = {
    ...process.env,
    NEXT_CONFIG: JSON.stringify(nextConfig),
    APP_DIR: appDir,
  }

  const nextProcess = spawn(nextBinPath, [command, ...args], {
    stdio: 'inherit',
    env,
  })

  nextProcess.on('close', (code) => {
    process.exit(code || 0)
  })
}

/**
 * Resolve the path to the Next.js binary
 */
function resolveNextBin(): string | null {
  const localNextBin = path.resolve(process.cwd(), 'node_modules', '.bin', 'next')
  if (fs.existsSync(localNextBin)) {
    return localNextBin
  }

  const packageNextBin = path.resolve(__dirname, '..', 'node_modules', '.bin', 'next')
  if (fs.existsSync(packageNextBin)) {
    return packageNextBin
  }

  return null
}

if (require.main === module) {
  cli().catch((error) => {
    console.error('Error executing command:', error)
    process.exit(1)
  })
}
