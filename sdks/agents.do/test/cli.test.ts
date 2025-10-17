/**
 * E2E Tests for agents.do CLI
 */

import { describe, it, expect } from 'vitest'
import { promisify } from 'util'

const exec = promisify(require('child_process').exec)

describe('agents.do - CLI Help', () => {
  it('should show main help', async () => {
    try {
      const { stdout } = await exec('node dist/cli.js --help')
      expect(stdout).toContain('agents.do')
      expect(stdout).toContain('autonomous agent')
      expect(stdout).toContain('auth')
      expect(stdout).toContain('agent')
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log('Skipping test - CLI not built')
        return
      }
      throw error
    }
  })
})

describe('agents.do - Auth Commands', () => {
  it('should show auth help', async () => {
    try {
      const { stdout } = await exec('node dist/cli.js auth --help')
      expect(stdout).toContain('authentication')
      expect(stdout).toContain('login')
      expect(stdout).toContain('logout')
      expect(stdout).toContain('status')
      expect(stdout).toContain('validate')
      expect(stdout).toContain('set-token')
      expect(stdout).toContain('set-admin-token')
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

describe('agents.do - Agent Commands', () => {
  it('should show agent help', async () => {
    try {
      const { stdout } = await exec('node dist/cli.js agent --help')
      expect(stdout).toContain('autonomous agents')
      expect(stdout).toContain('list')
      expect(stdout).toContain('create')
      expect(stdout).toContain('start')
      expect(stdout).toContain('stop')
      expect(stdout).toContain('logs')
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log('Skipping test - CLI not built')
        return
      }
      throw error
    }
  })

  it('should show list command help', async () => {
    try {
      const { stdout } = await exec('node dist/cli.js agent list --help')
      expect(stdout).toContain('List all agents')
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log('Skipping test - CLI not built')
        return
      }
      throw error
    }
  })

  it('should show create command help', async () => {
    try {
      const { stdout } = await exec('node dist/cli.js agent create --help')
      expect(stdout).toContain('Create a new agent')
      expect(stdout).toContain('description')
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log('Skipping test - CLI not built')
        return
      }
      throw error
    }
  })
})
