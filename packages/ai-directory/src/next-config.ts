import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'
import type { DirectoryConfig } from './config-loader'

/**
 * Resolve the Next.js configuration
 */
export async function resolveNextConfig(directoryConfig: DirectoryConfig): Promise<Record<string, any>> {
  const cwd = process.cwd()

  if (directoryConfig.nextConfig && typeof directoryConfig.nextConfig === 'object') {
    return directoryConfig.nextConfig
  }

  const jsConfigPath = path.join(cwd, 'next.config.js')
  if (fs.existsSync(jsConfigPath)) {
    try {
      const configModule = await import(pathToFileURL(jsConfigPath).href)
      return configModule.default || configModule
    } catch (error) {
      console.error('Error loading next.config.js:', error)
    }
  }

  const mjsConfigPath = path.join(cwd, 'next.config.mjs')
  if (fs.existsSync(mjsConfigPath)) {
    try {
      const configModule = await import(pathToFileURL(mjsConfigPath).href)
      return configModule.default || configModule
    } catch (error) {
      console.error('Error loading next.config.mjs:', error)
    }
  }

  return getDefaultNextConfig()
}

/**
 * Get the default Next.js configuration
 */
function getDefaultNextConfig(): Record<string, any> {
  return {
    reactStrictMode: true,
    swcMinify: true,
  }
}
