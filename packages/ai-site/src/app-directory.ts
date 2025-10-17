import fs from 'fs'
import path from 'path'
import type { SiteConfig } from './config-loader'

/**
 * Resolve the app directory path
 */
export function resolveAppDirectory(siteConfig: SiteConfig): string {
  const cwd = process.cwd()

  if (siteConfig.appDir && typeof siteConfig.appDir === 'string') {
    const appDirPath = path.resolve(cwd, siteConfig.appDir)
    if (fs.existsSync(appDirPath)) {
      return appDirPath
    }
    console.warn(`Specified appDir '${siteConfig.appDir}' not found, falling back to default`)
  }

  const rootAppDir = path.join(cwd, 'app')
  if (fs.existsSync(rootAppDir)) {
    return rootAppDir
  }

  return getDefaultAppDirectory()
}

/**
 * Get the default app directory path from the package
 */
function getDefaultAppDirectory(): string {
  return path.resolve(__dirname, '../templates/app')
}
