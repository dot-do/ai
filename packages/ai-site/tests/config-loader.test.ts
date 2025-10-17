import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { loadSiteConfig, SiteConfig } from '../src/config-loader'
import path from 'path'
import fs from 'fs'

const mockCwd = vi.spyOn(process, 'cwd')
const mockExistsSync = vi.spyOn(fs, 'existsSync')

describe('config-loader', () => {
  beforeEach(() => {
    mockCwd.mockReset()
    mockExistsSync.mockReset()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('loadSiteConfig', () => {
    it('should load configuration from site.config.js', async () => {
      mockCwd.mockReturnValue(path.join(__dirname, 'examples'))
      mockExistsSync.mockImplementation((filePath) => {
        return filePath.toString().endsWith('site.config.js')
      })

      const config = await loadSiteConfig()

      expect(config).toHaveProperty('name', 'Test Site')
      expect(config).toHaveProperty('description', 'A test site for ai-site')
      expect(config).toHaveProperty('nextConfig')
      expect(config).toHaveProperty('appDir', './custom-app')
      expect(config).toHaveProperty('aiFunctions')
      expect(config).toHaveProperty('aiProps')
    })

    it('should use default configuration when no config file exists', async () => {
      mockCwd.mockReturnValue('/non-existent-directory')
      mockExistsSync.mockReturnValue(false)

      const config = await loadSiteConfig()

      expect(config).toHaveProperty('name', 'AI-Powered Site')
      expect(config).toHaveProperty('description', 'Generated with ai-site')
    })
  })
})
