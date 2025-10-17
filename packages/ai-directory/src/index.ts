import { loadDirectoryConfig } from './config-loader'
import { resolveNextConfig } from './next-config'
import { resolveAppDirectory } from './app-directory'

/**
 * Initialize the directory with configurations
 */
export async function initDirectory() {
  const directoryConfig = await loadDirectoryConfig()
  const nextConfig = resolveNextConfig(directoryConfig)
  const appDir = resolveAppDirectory(directoryConfig)

  return {
    directoryConfig,
    nextConfig,
    appDir,
  }
}

export { loadDirectoryConfig } from './config-loader'
export type { DirectoryConfig, DirectoryDataSource, DirectoryItem, DirectoryCategory } from './config-loader'
export { resolveNextConfig } from './next-config'
export { resolveAppDirectory } from './app-directory'
export { directorySchema } from './schemas/directory'
