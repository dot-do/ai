import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'

export interface DirectoryItem {
  id: string
  name: string
  description?: string
  image?: string
  category?: string
  tags?: string[]
  [key: string]: any
}

export interface DirectoryCategory {
  id: string
  name: string
  description?: string
  count?: number
}

export interface DirectoryDataSource {
  database?: {
    uri?: string
    instance?: any
    collection?: string
  }
  api?: {
    endpoint?: string
    listEndpoint?: string
    detailEndpoint?: string
    searchEndpoint?: string
  }
  items?: DirectoryItem[]
  categories?: DirectoryCategory[]
}

export interface DirectoryConfig {
  name: string
  description: string
  nextConfig?: Record<string, any>
  appDir?: string
  aiFunctions?: Record<string, any>
  aiProps?: Record<string, any>

  dataSource: DirectoryDataSource

  searchFields?: string[]
  defaultSortField?: string
  defaultSortOrder?: 'asc' | 'desc'
  itemsPerPage?: number

  layoutOptions?: {
    showSearch?: boolean
    showCategories?: boolean
    showFilters?: boolean
    gridColumns?: number
    listView?: boolean
  }

  [key: string]: any
}

const DEFAULT_CONFIG: DirectoryConfig = {
  name: 'AI-Powered Directory',
  description: 'Generated with ai-directory',
  dataSource: {},
  searchFields: ['name', 'description'],
  defaultSortField: 'name',
  defaultSortOrder: 'asc',
  itemsPerPage: 10,
  layoutOptions: {
    showSearch: true,
    showCategories: true,
    showFilters: true,
    gridColumns: 3,
    listView: false,
  },
}

/**
 * Load and validate the directory configuration
 */
export async function loadDirectoryConfig(): Promise<DirectoryConfig> {
  const cwd = process.cwd()

  const tsConfigPath = path.join(cwd, 'site.config.ts')
  if (fs.existsSync(tsConfigPath)) {
    try {
      const configModule = await import(pathToFileURL(tsConfigPath).href)
      return validateConfig(configModule.default || configModule)
    } catch (error) {
      console.error('Error loading TypeScript config:', error)
    }
  }

  const jsConfigPath = path.join(cwd, 'site.config.js')
  if (fs.existsSync(jsConfigPath)) {
    try {
      const configModule = await import(pathToFileURL(jsConfigPath).href)
      return validateConfig(configModule.default || configModule)
    } catch (error) {
      console.error('Error loading JavaScript config:', error)
    }
  }

  console.warn('No site.config.{ts|js} found, using default configuration')
  return DEFAULT_CONFIG
}

/**
 * Validate the configuration and apply defaults
 */
function validateConfig(config: any): DirectoryConfig {
  if (!config || typeof config !== 'object') {
    console.warn('Invalid configuration, using default')
    return DEFAULT_CONFIG
  }

  return {
    ...DEFAULT_CONFIG,
    ...config,
  }
}
