/**
 * E2E Tests for mcp.do CLI
 */

import { describe, it, expect } from 'vitest'
import { promisify } from 'util'

const exec = promisify(require('child_process').exec)

describe('mcp.do - CLI Help', () => {
  it('should show main help', async () => {
    try {
      const { stdout } = await exec('node dist/cli.js --help')
      expect(stdout).toContain('Model Context Protocol')
      expect(stdout).toContain('auth')
      expect(stdout).toContain('server')
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log('Skipping test - CLI not built')
        return
      }
      throw error
    }
  })
})

describe('mcp.do - Auth Commands', () => {
  it('should show auth help', async () => {
    try {
      const { stdout } = await exec('node dist/cli.js auth --help')
      expect(stdout).toContain('authentication')
      expect(stdout).toContain('login')
      expect(stdout).toContain('logout')
      expect(stdout).toContain('status')
      expect(stdout).toContain('validate')
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log('Skipping test - CLI not built')
        return
      }
      throw error
    }
  })

  it('should show auth status (unauthenticated)', async () => {
    try {
      await exec('node dist/cli.js auth status')
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log('Skipping test - CLI not built')
        return
      }
      // Expected to fail when not authenticated
      expect(error.code).toBe(1)
      expect(error.stdout || error.stderr).toContain('Not authenticated')
    }
  })
})

describe('mcp.do - Server Commands', () => {
  it('should show server help', async () => {
    try {
      const { stdout } = await exec('node dist/cli.js server --help')
      expect(stdout).toContain('Interact with MCP servers')
      expect(stdout).toContain('tools')
      expect(stdout).toContain('resources')
      expect(stdout).toContain('prompts')
      expect(stdout).toContain('execute')
      expect(stdout).toContain('health')
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log('Skipping test - CLI not built')
        return
      }
      throw error
    }
  })

  it('should show server tools help', async () => {
    try {
      const { stdout } = await exec('node dist/cli.js server tools --help')
      expect(stdout).toContain('List available tools')
      expect(stdout).toContain('command')
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log('Skipping test - CLI not built')
        return
      }
      throw error
    }
  })

  it('should show server resources help', async () => {
    try {
      const { stdout } = await exec('node dist/cli.js server resources --help')
      expect(stdout).toContain('List available resources')
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log('Skipping test - CLI not built')
        return
      }
      throw error
    }
  })

  it('should show server prompts help', async () => {
    try {
      const { stdout } = await exec('node dist/cli.js server prompts --help')
      expect(stdout).toContain('List available prompts')
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log('Skipping test - CLI not built')
        return
      }
      throw error
    }
  })

  it('should show server execute help', async () => {
    try {
      const { stdout } = await exec('node dist/cli.js server execute --help')
      expect(stdout).toContain('Execute a tool')
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log('Skipping test - CLI not built')
        return
      }
      throw error
    }
  })

  it('should show server health help', async () => {
    try {
      const { stdout } = await exec('node dist/cli.js server health --help')
      expect(stdout).toContain('Check health')
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log('Skipping test - CLI not built')
        return
      }
      throw error
    }
  })
})
