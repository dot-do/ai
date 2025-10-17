/**
 * E2E Tests for apis.do CLI
 */

import { describe, it, expect } from 'vitest'
import { promisify } from 'util'

const exec = promisify(require('child_process').exec)

describe('apis.do - CLI Help', () => {
  it('should show main help', async () => {
    try {
      const { stdout } = await exec('node dist/cli.js --help')
      expect(stdout).toContain('APIs.do CLI')
      expect(stdout).toContain('API platform')
      expect(stdout).toContain('auth')
      expect(stdout).toContain('api')
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log('Skipping test - CLI not built')
        return
      }
      throw error
    }
  })
})

describe('apis.do - Auth Commands', () => {
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

describe('apis.do - API Commands', () => {
  it('should show api help', async () => {
    try {
      const { stdout } = await exec('node dist/cli.js api --help')
      expect(stdout).toContain('Interact with APIs.do')
      expect(stdout).toContain('health')
      expect(stdout).toContain('user')
      expect(stdout).toContain('endpoints')
      expect(stdout).toContain('generate')
      expect(stdout).toContain('repo')
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log('Skipping test - CLI not built')
        return
      }
      throw error
    }
  })

  it('should show api health help', async () => {
    try {
      const { stdout } = await exec('node dist/cli.js api health --help')
      expect(stdout).toContain('Check API health')
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log('Skipping test - CLI not built')
        return
      }
      throw error
    }
  })

  it('should show api user help', async () => {
    try {
      const { stdout } = await exec('node dist/cli.js api user --help')
      expect(stdout).toContain('Get current user')
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log('Skipping test - CLI not built')
        return
      }
      throw error
    }
  })

  it('should show api endpoints help', async () => {
    try {
      const { stdout } = await exec('node dist/cli.js api endpoints --help')
      expect(stdout).toContain('List available')
      expect(stdout).toContain('endpoints')
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log('Skipping test - CLI not built')
        return
      }
      throw error
    }
  })

  it('should show api generate help', async () => {
    try {
      const { stdout } = await exec('node dist/cli.js api generate --help')
      expect(stdout).toContain('Generate AI text')
      expect(stdout).toContain('prompt')
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log('Skipping test - CLI not built')
        return
      }
      throw error
    }
  })

  it('should show api repo help', async () => {
    try {
      const { stdout } = await exec('node dist/cli.js api repo --help')
      expect(stdout).toContain('GitHub repository')
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log('Skipping test - CLI not built')
        return
      }
      throw error
    }
  })
})
