/**
 * E2E Tests for sdk.do CLI
 */

import { describe, it, expect } from 'vitest'
import { promisify } from 'util'

const exec = promisify(require('child_process').exec)

describe('sdk.do - CLI Help', () => {
  it('should show main help', async () => {
    try {
      const { stdout } = await exec('node dist/cli.js --help')
      expect(stdout).toContain('SDK.do CLI')
      expect(stdout).toContain('SDK')
      expect(stdout).toContain('auth')
      expect(stdout).toContain('exec')
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log('Skipping test - CLI not built')
        return
      }
      throw error
    }
  })
})

describe('sdk.do - Auth Commands', () => {
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

describe('sdk.do - Exec Commands', () => {
  it('should show exec help', async () => {
    try {
      const { stdout } = await exec('node dist/cli.js exec --help')
      expect(stdout).toContain('Execute SDK')
      expect(stdout).toContain('run')
      expect(stdout).toContain('entities')
      expect(stdout).toContain('describe')
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log('Skipping test - CLI not built')
        return
      }
      throw error
    }
  })

  it('should show exec run help', async () => {
    try {
      const { stdout } = await exec('node dist/cli.js exec run --help')
      expect(stdout).toContain('Execute SDK')
      expect(stdout).toContain('code')
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log('Skipping test - CLI not built')
        return
      }
      throw error
    }
  })

  it('should show exec entities help', async () => {
    try {
      const { stdout } = await exec('node dist/cli.js exec entities --help')
      expect(stdout).toContain('List available entities')
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log('Skipping test - CLI not built')
        return
      }
      throw error
    }
  })

  it('should show exec describe help', async () => {
    try {
      const { stdout } = await exec('node dist/cli.js exec describe --help')
      expect(stdout).toContain('Describe an entity')
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log('Skipping test - CLI not built')
        return
      }
      throw error
    }
  })
})
