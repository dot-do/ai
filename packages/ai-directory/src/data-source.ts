import type { DirectoryConfig, DirectoryItem, DirectoryCategory } from './config-loader'

export interface DirectoryQuery {
  search?: string
  category?: string
  tags?: string[]
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  [key: string]: any
}

export interface DirectoryDataResult {
  items: DirectoryItem[]
  total: number
  page: number
  limit: number
  categories?: DirectoryCategory[]
  [key: string]: any
}

/**
 * Directory data source abstraction
 */
export class DirectoryDataSource {
  private config: DirectoryConfig
  private dbInstance: any = null

  constructor(config: DirectoryConfig) {
    this.config = config
  }

  /**
   * Initialize the data source
   */
  async initialize(): Promise<void> {
    const { dataSource } = this.config

    if (dataSource.database?.uri) {
      this.dbInstance = await this.connectToDatabaseUri(dataSource.database.uri)
    } else if (dataSource.database?.instance) {
      this.dbInstance = dataSource.database.instance
    }
  }

  /**
   * Get all directory items with optional filtering
   */
  async getItems(query: DirectoryQuery = {}): Promise<DirectoryDataResult> {
    const { dataSource } = this.config
    const { search, category, tags, page = 1, limit = this.config.itemsPerPage || 10 } = query
    const sortBy = query.sortBy || this.config.defaultSortField || 'name'
    const sortOrder = query.sortOrder || this.config.defaultSortOrder || 'asc'

    if (dataSource.items && Array.isArray(dataSource.items)) {
      return this.getLocalItems(dataSource.items, { search, category, tags, page, limit, sortBy, sortOrder })
    }

    if (this.dbInstance) {
      return this.getDatabaseItems({ search, category, tags, page, limit, sortBy, sortOrder })
    }

    if (dataSource.api?.endpoint || dataSource.api?.listEndpoint) {
      return this.getApiItems({ search, category, tags, page, limit, sortBy, sortOrder })
    }

    return {
      items: [],
      total: 0,
      page,
      limit,
    }
  }

  /**
   * Get a single directory item by ID
   */
  async getItem(id: string): Promise<DirectoryItem | null> {
    const { dataSource } = this.config

    if (dataSource.items && Array.isArray(dataSource.items)) {
      return dataSource.items.find((item) => item.id === id) || null
    }

    if (this.dbInstance) {
      return this.getDatabaseItem(id)
    }

    if (dataSource.api?.endpoint || dataSource.api?.detailEndpoint) {
      return this.getApiItem(id)
    }

    return null
  }

  /**
   * Get all categories
   */
  async getCategories(): Promise<DirectoryCategory[]> {
    const { dataSource } = this.config

    if (dataSource.categories && Array.isArray(dataSource.categories)) {
      return dataSource.categories
    }

    if (dataSource.items && Array.isArray(dataSource.items)) {
      return this.getCategoriesFromItems(dataSource.items)
    }

    if (this.dbInstance) {
      return this.getDatabaseCategories()
    }

    if (dataSource.api?.endpoint) {
      return this.getApiCategories()
    }

    return []
  }

  /**
   * Connect to database using URI
   */
  private async connectToDatabaseUri(uri: string): Promise<any> {
    console.log(`Connecting to database: ${uri}`)
    return null
  }

  /**
   * Get items from local data source
   */
  private getLocalItems(
    items: DirectoryItem[],
    query: { search?: string; category?: string; tags?: string[]; page: number; limit: number; sortBy: string; sortOrder: 'asc' | 'desc' }
  ): DirectoryDataResult {
    const { search, category, tags, page, limit, sortBy, sortOrder } = query
    let filteredItems = [...items]

    if (category) {
      filteredItems = filteredItems.filter((item) => item.category === category)
    }

    if (tags && tags.length > 0) {
      filteredItems = filteredItems.filter((item) => {
        if (!item.tags) return false
        return tags.some((tag) => item.tags!.includes(tag))
      })
    }

    if (search && this.config.searchFields) {
      const searchFields = this.config.searchFields
      const searchLower = search.toLowerCase()

      filteredItems = filteredItems.filter((item) => {
        return searchFields.some((field) => {
          const value = item[field]
          if (typeof value === 'string') {
            return value.toLowerCase().includes(searchLower)
          }
          return false
        })
      })
    }

    filteredItems.sort((a, b) => {
      const aValue = a[sortBy]
      const bValue = b[sortBy]

      if (aValue === bValue) return 0

      const comparison = aValue < bValue ? -1 : 1
      return sortOrder === 'asc' ? comparison : -comparison
    })

    const startIndex = (page - 1) * limit
    const paginatedItems = filteredItems.slice(startIndex, startIndex + limit)

    return {
      items: paginatedItems,
      total: filteredItems.length,
      page,
      limit,
    }
  }

  /**
   * Get items from database
   */
  private async getDatabaseItems(query: DirectoryQuery): Promise<DirectoryDataResult> {
    return {
      items: [],
      total: 0,
      page: query.page || 1,
      limit: query.limit || 10,
    }
  }

  /**
   * Get items from API
   */
  private async getApiItems(query: DirectoryQuery): Promise<DirectoryDataResult> {
    const { dataSource } = this.config
    const endpoint = dataSource.api?.listEndpoint || dataSource.api?.endpoint

    if (!endpoint) {
      return {
        items: [],
        total: 0,
        page: query.page || 1,
        limit: query.limit || 10,
      }
    }

    try {
      const queryParams = new URLSearchParams()

      if (query.search) queryParams.append('search', query.search)
      if (query.category) queryParams.append('category', query.category)
      if (query.page) queryParams.append('page', String(query.page))
      if (query.limit) queryParams.append('limit', String(query.limit))
      if (query.sortBy) queryParams.append('sortBy', query.sortBy)
      if (query.sortOrder) queryParams.append('sortOrder', query.sortOrder)

      if (query.tags && query.tags.length > 0) {
        queryParams.append('tags', query.tags.join(','))
      }

      const url = `${endpoint}?${queryParams.toString()}`
      const response = await fetch(url)
      const data = await response.json()

      return {
        items: data.items || [],
        total: data.total || 0,
        page: data.page || query.page || 1,
        limit: data.limit || query.limit || 10,
        categories: data.categories,
      }
    } catch (error) {
      console.error('Error fetching directory items from API:', error)
      return {
        items: [],
        total: 0,
        page: query.page || 1,
        limit: query.limit || 10,
      }
    }
  }

  /**
   * Get a single item from database
   */
  private async getDatabaseItem(id: string): Promise<DirectoryItem | null> {
    return null
  }

  /**
   * Get a single item from API
   */
  private async getApiItem(id: string): Promise<DirectoryItem | null> {
    const { dataSource } = this.config
    let endpoint = dataSource.api?.detailEndpoint || dataSource.api?.endpoint

    if (!endpoint) {
      return null
    }

    endpoint = endpoint.replace(':id', id)

    if (!endpoint.includes(id)) {
      endpoint = `${endpoint}/${id}`
    }

    try {
      const response = await fetch(endpoint)
      if (!response.ok) {
        return null
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching directory item from API:', error)
      return null
    }
  }

  /**
   * Get categories from database
   */
  private async getDatabaseCategories(): Promise<DirectoryCategory[]> {
    return []
  }

  /**
   * Get categories from API
   */
  private async getApiCategories(): Promise<DirectoryCategory[]> {
    const { dataSource } = this.config
    const endpoint = `${dataSource.api?.endpoint}/categories`

    try {
      const response = await fetch(endpoint)
      if (!response.ok) {
        return []
      }
      const data = await response.json()
      return data.categories || []
    } catch (error) {
      console.error('Error fetching directory categories from API:', error)
      return []
    }
  }

  /**
   * Derive categories from items
   */
  private getCategoriesFromItems(items: DirectoryItem[]): DirectoryCategory[] {
    const categoryMap = new Map<string, { id: string; name: string; count: number }>()

    items.forEach((item) => {
      if (item.category) {
        if (categoryMap.has(item.category)) {
          const category = categoryMap.get(item.category)!
          category.count++
        } else {
          categoryMap.set(item.category, {
            id: item.category,
            name: item.category,
            count: 1,
          })
        }
      }
    })

    return Array.from(categoryMap.values())
  }
}
