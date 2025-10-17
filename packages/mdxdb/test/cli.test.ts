/**
 * E2E Tests for mdxdb CLI
 */

import { describe, it, expect } from 'vitest'
import { promisify } from 'util'

const exec = promisify(require('child_process').exec)

describe('mdxdb - CLI Help', () => {
  it('should show main help', async () => {
    try {
      const { stdout } = await exec('node dist/cli.js --help')
      expect(stdout).toContain('mdxdb')
      expect(stdout).toContain('MDX')
      expect(stdout).toContain('auth')
      expect(stdout).toContain('db')
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log('Skipping test - CLI not built')
        return
      }
      throw error
    }
  })
})

describe('mdxdb - Auth Commands', () => {
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

describe('mdxdb - Database Commands', () => {
  it('should show db help', async () => {
    try {
      const { stdout } = await exec('node dist/cli.js db --help')
      expect(stdout).toContain('MDX database')
      expect(stdout).toContain('init')
      expect(stdout).toContain('query')
      expect(stdout).toContain('create')
      expect(stdout).toContain('list')
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log('Skipping test - CLI not built')
        return
      }
      throw error
    }
  })

  it('should show init command help', async () => {
    try {
      const { stdout } = await exec('node dist/cli.js db init --help')
      expect(stdout).toContain('Initialize')
      expect(stdout).toContain('directory')
      expect(stdout).toContain('schema')
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log('Skipping test - CLI not built')
        return
      }
      throw error
    }
  })

  it('should show query command help', async () => {
    try {
      const { stdout } = await exec('node dist/cli.js db query --help')
      expect(stdout).toContain('Query documents')
      expect(stdout).toContain('filter')
      expect(stdout).toContain('limit')
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log('Skipping test - CLI not built')
        return
      }
      throw error
    }
  })
})
