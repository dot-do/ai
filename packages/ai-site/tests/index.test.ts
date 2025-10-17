import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { initSite, loadSiteConfig, resolveNextConfig, resolveAppDirectory } from '../src'
import path from 'path'

const mockCwd = vi.spyOn(process, 'cwd')

describe('ai-site', () => {
  beforeEach(() => {
    mockCwd.mockReturnValue(path.join(__dirname, 'examples'))
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('initSite', () => {
    it('should initialize a site with configuration', async () => {
      const result = await initSite()

      expect(result).toHaveProperty('siteConfig')
      expect(result).toHaveProperty('nextConfig')
      expect(result).toHaveProperty('appDir')

      expect(result.siteConfig.name).toBe('Test Site')
      expect(result.siteConfig.description).toBe('A test site for ai-site')
    })
  })

  describe('loadSiteConfig', () => {
    it('should load site configuration from file', async () => {
      const config = await loadSiteConfig()

      expect(config).toHaveProperty('name', 'Test Site')
      expect(config).toHaveProperty('description', 'A test site for ai-site')
      expect(config).toHaveProperty('nextConfig')
      expect(config).toHaveProperty('appDir', './custom-app')
      expect(config).toHaveProperty('aiFunctions')
      expect(config).toHaveProperty('aiProps')
    })
  })

  describe('resolveNextConfig', () => {
    it('should resolve Next.js configuration', async () => {
      const config = await loadSiteConfig()
      const nextConfig = await resolveNextConfig(config)

      expect(nextConfig).toHaveProperty('reactStrictMode', true)
      expect(nextConfig).toHaveProperty('experimental')
      expect(nextConfig.experimental).toHaveProperty('appDir', true)
    })
  })

  describe('resolveAppDirectory', () => {
    it('should resolve app directory from config', async () => {
      const config = await loadSiteConfig()
      const appDir = resolveAppDirectory(config)

      expect(appDir).toContain('templates/app')
    })
  })
})
