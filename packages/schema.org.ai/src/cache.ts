/**
 * Local cache management for Schema.org vocabulary
 */

import { existsSync } from 'node:fs'
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import type { SchemaOrgVocabulary } from './types'
import { SchemaOrgFetcher } from './fetcher'

export class SchemaOrgCache {
  private cachePath: string
  private maxAge: number // milliseconds

  constructor(
    cachePath: string = join(process.cwd(), 'cache', 'schema-org-vocabulary.json'),
    maxAge: number = 7 * 24 * 60 * 60 * 1000 // 7 days
  ) {
    this.cachePath = cachePath
    this.maxAge = maxAge
  }

  /**
   * Ensure cache exists and is fresh
   */
  async ensureCached(): Promise<void> {
    if ((await this.cacheExists()) && (await this.cacheIsFresh())) {
      console.log('Schema.org cache is fresh')
      return
    }

    console.log('Fetching fresh Schema.org vocabulary...')
    const vocabulary = await new SchemaOrgFetcher().fetchVocabulary()
    await this.writeCache(vocabulary)
  }

  /**
   * Load vocabulary from cache
   */
  async load(): Promise<SchemaOrgVocabulary> {
    await this.ensureCached()

    const content = await readFile(this.cachePath, 'utf-8')
    return JSON.parse(content)
  }

  /**
   * Check if cache file exists
   */
  private async cacheExists(): Promise<boolean> {
    return existsSync(this.cachePath)
  }

  /**
   * Check if cache is fresh (within maxAge)
   */
  private async cacheIsFresh(): Promise<boolean> {
    if (!(await this.cacheExists())) {
      return false
    }

    const stats = await stat(this.cachePath)
    const age = Date.now() - stats.mtimeMs
    return age < this.maxAge
  }

  /**
   * Write vocabulary to cache
   */
  private async writeCache(vocabulary: SchemaOrgVocabulary): Promise<void> {
    // Ensure directory exists
    await mkdir(dirname(this.cachePath), { recursive: true })

    // Write cache file
    await writeFile(this.cachePath, JSON.stringify(vocabulary, null, 2), 'utf-8')

    console.log(`Cached Schema.org vocabulary at ${this.cachePath}`)
  }

  /**
   * Clear cache
   */
  async clear(): Promise<void> {
    if (await this.cacheExists()) {
      const fs = await import('node:fs/promises')
      await fs.unlink(this.cachePath)
      console.log('Cache cleared')
    }
  }
}
