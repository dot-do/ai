import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { loadDirectoryConfig } from '../src/config-loader'
import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'

vi.mock('fs')
vi.mock('path')
vi.mock('url')

const createUrlMock = (url: string) =>
  ({
    href: `file://${url}`,
    toString: () => `file://${url}`,
    toJSON: () => `file://${url}`,
    hash: '',
    host: '',
    hostname: '',
    origin: 'file://',
    pathname: url,
    protocol: 'file:',
    search: '',
    searchParams: new URLSearchParams(),
  }) as URL

describe('config-loader', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    vi.spyOn(process, 'cwd').mockReturnValue('/test')
    vi.mocked(path.join).mockImplementation((...args) => args.join('/'))
    vi.mocked(path.resolve).mockImplementation((...args) => args.join('/'))
    vi.mocked(pathToFileURL).mockImplementation(createUrlMock)
  })

  afterEach(() => {
    vi.resetModules()
  })

  it('should return default config when no config file exists', async () => {
    vi.mocked(fs.existsSync).mockReturnValue(false)

    const config = await loadDirectoryConfig()

    expect(config).toMatchObject({
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
    })
  })

  it('should load TypeScript config when it exists', async () => {
    vi.mocked(fs.existsSync).mockImplementation((file) => {
      return file === '/test/site.config.ts'
    })

    const mockModule = {
      default: {
        name: 'Test Directory',
        description: 'Test Description',
        dataSource: {
          items: [{ id: '1', name: 'Test Item' }],
        },
      },
    }

    vi.doMock('file:///test/site.config.ts', () => mockModule)

    vi.resetModules()

    const { loadDirectoryConfig: freshLoadConfig } = await import('../src/config-loader')
    const config = await freshLoadConfig()

    expect(config).toMatchObject({
      name: 'Test Directory',
      description: 'Test Description',
      dataSource: {
        items: [{ id: '1', name: 'Test Item' }],
      },
    })
  })

  it('should load JavaScript config when it exists and TypeScript config does not', async () => {
    vi.mocked(fs.existsSync).mockImplementation((file) => {
      return file === '/test/site.config.js'
    })

    const mockModule = {
      default: {
        name: 'JS Directory',
        description: 'JS Description',
        dataSource: {
          api: {
            endpoint: 'https://api.example.com',
          },
        },
      },
    }

    vi.doMock('file:///test/site.config.js', () => mockModule)

    vi.resetModules()

    const { loadDirectoryConfig: freshLoadConfig } = await import('../src/config-loader')
    const config = await freshLoadConfig()

    expect(config).toMatchObject({
      name: 'JS Directory',
      description: 'JS Description',
      dataSource: {
        api: {
          endpoint: 'https://api.example.com',
        },
      },
    })
  })

  it('should merge custom config with default config', async () => {
    vi.mocked(fs.existsSync).mockImplementation((file) => {
      return file === '/test/site.config.ts'
    })

    const mockModule = {
      default: {
        name: 'Custom Directory',
        dataSource: {
          database: {
            uri: 'mongodb://localhost:27017',
          },
        },
      },
    }

    vi.doMock('file:///test/site.config.ts', () => mockModule)

    vi.resetModules()

    const { loadDirectoryConfig: freshLoadConfig } = await import('../src/config-loader')
    const config = await freshLoadConfig()

    expect(config.name).toBe('Custom Directory')
    expect(config.dataSource.database?.uri).toBe('mongodb://localhost:27017')
    expect(config.description).toBe('Generated with ai-directory')
    expect(config.searchFields).toEqual(['name', 'description'])
  })
})
