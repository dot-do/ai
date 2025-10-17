import fs from 'fs'
import path from 'path'
import type { DirectoryConfig } from './config-loader'

/**
 * Resolve the app directory path
 */
export function resolveAppDirectory(directoryConfig: DirectoryConfig): string {
  const cwd = process.cwd()

  if (directoryConfig.appDir && typeof directoryConfig.appDir === 'string') {
    const appDirPath = path.resolve(cwd, directoryConfig.appDir)
    if (fs.existsSync(appDirPath)) {
      return appDirPath
    }
    console.warn(`Specified appDir '${directoryConfig.appDir}' not found, falling back to default`)
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
