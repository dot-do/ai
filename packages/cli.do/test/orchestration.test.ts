/**
 * E2E Tests for cli.do orchestration commands
 */

import { describe, it, expect } from 'vitest'
import { spawn } from 'child_process'
import { promisify } from 'util'

const exec = promisify(require('child_process').exec)

describe('cli.do - Orchestration', () => {
  it('should show orchestration help', async () => {
    try {
      const { stdout } = await exec('node dist/index.js orchestrate --help')
      expect(stdout).toContain('Orchestrate multiple .do CLIs')
      expect(stdout).toContain('mcp')
      expect(stdout).toContain('apis')
      expect(stdout).toContain('sdk')
    } catch (error: any) {
      // If command not found, skip test
      if (error.code === 'ENOENT') {
        console.log('Skipping test - CLI not built')
        return
      }
      throw error
    }
  })

  it('should list available CLIs', async () => {
    try {
      const { stdout } = await exec('node dist/index.js orchestrate list')
      expect(stdout).toContain('mcp')
      expect(stdout).toContain('apis')
      expect(stdout).toContain('sdk')
      expect(stdout).toContain('Model Context Protocol')
      expect(stdout).toContain('APIs.do platform')
      expect(stdout).toContain('SDK.do platform')
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log('Skipping test - CLI not built')
        return
      }
      throw error
    }
  })
})

describe('cli.do - Authentication', () => {
  it('should show auth help', async () => {
    try {
      const { stdout } = await exec('node dist/index.js auth --help')
      expect(stdout).toContain('Manage')
      expect(stdout).toContain('authentication')
      expect(stdout).toContain('login')
      expect(stdout).toContain('logout')
      expect(stdout).toContain('status')
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
      // This should fail with exit code 1 when not authenticated
      await exec('node dist/index.js auth status')
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

describe('cli.do - Database Commands', () => {
  it('should show db help', async () => {
    try {
      const { stdout } = await exec('node dist/index.js db --help')
      expect(stdout).toContain('Database operations')
      expect(stdout).toContain('list')
      expect(stdout).toContain('get')
      expect(stdout).toContain('create')
      expect(stdout).toContain('update')
      expect(stdout).toContain('delete')
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log('Skipping test - CLI not built')
        return
      }
      throw error
    }
  })
})

describe('cli.do - AI Commands', () => {
  it('should show ai help', async () => {
    try {
      const { stdout } = await exec('node dist/index.js ai --help')
      expect(stdout).toContain('AI generation')
      expect(stdout).toContain('generate')
      expect(stdout).toContain('embed')
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log('Skipping test - CLI not built')
        return
      }
      throw error
    }
  })
})

describe('cli.do - Functions Commands', () => {
  it('should show functions help', async () => {
    try {
      const { stdout } = await exec('node dist/index.js functions --help')
      expect(stdout).toContain('Execute functions')
      expect(stdout).toContain('execute')
      expect(stdout).toContain('list')
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log('Skipping test - CLI not built')
        return
      }
      throw error
    }
  })
})

describe('cli.do - Config Commands', () => {
  it('should show config help', async () => {
    try {
      const { stdout } = await exec('node dist/index.js config --help')
      expect(stdout).toContain('configuration')
      expect(stdout).toContain('set')
      expect(stdout).toContain('get')
      expect(stdout).toContain('list')
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log('Skipping test - CLI not built')
        return
      }
      throw error
    }
  })

  it('should list config', async () => {
    try {
      const { stdout } = await exec('node dist/index.js config list')
      expect(stdout).toContain('Environment Configuration')
      expect(stdout).toContain('DO_API_KEY')
      expect(stdout).toContain('DO_BASE_URL')
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        console.log('Skipping test - CLI not built')
        return
      }
      throw error
    }
  })
})
