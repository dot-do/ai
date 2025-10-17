/**
 * Dungeon fighter online Client
 *
 * Auto-generated Integration client for Dungeon fighter online.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/dungeon_fighter_online
 */

import { ActionExecuteParams } from './types.js'
import { DungeonFighterOnlineError } from './errors.js'

/**
 * Dungeon fighter online client options
 */
export interface DungeonFighterOnlineClientOptions {
  /** API key for authentication */
  apiKey: string
  /** Base URL override */
  baseUrl?: string
  /** Request timeout in ms */
  timeout?: number
  /** Retry attempts */
  retryAttempts?: number
}

/**
 * Dungeon fighter online Client
 *
 * Dungeon Fighter Online (DFO) is an arcade-style, side-scrolling action game with RPG elements, offering players a dynamic combat experience.
 */
export class DungeonFighterOnlineClient {
  private options: DungeonFighterOnlineClientOptions

  /**
   * Action resource
   * Execute Dungeon fighter online actions
   */
  public action: {
    /** undefined Action */
    execute: (params: ActionExecuteParams) => Promise<object>
  }

  constructor(options: DungeonFighterOnlineClientOptions) {
    this.options = {
      baseUrl: 'https://api.dungeon_fighter_online.com',
      timeout: 30000,
      retryAttempts: 3,
      ...options,
    }

    // Initialize resource namespaces
    this.action = {
      execute: this.actionExecute.bind(this),
    }
  }

  /**
   * undefined Action
   * @param params - Operation parameters
   * @returns object
   */
  private async actionExecute(params: ActionExecuteParams): Promise<object> {
    try {
      const response = await this.request('POST', '/', params)
      return response as object
    } catch (error) {
      throw DungeonFighterOnlineError.fromError(error)
    }
  }

  /**
   * Make HTTP request
   * @param method - HTTP method
   * @param path - Request path
   * @param data - Request data
   * @returns Response data
   */
  private async request(method: string, path: string, data?: any): Promise<any> {
    const url = `${this.options.baseUrl}${path}`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.options.apiKey,
    }

    const config: RequestInit = {
      method,
      headers,
      signal: AbortSignal.timeout(this.options.timeout || 30000),
    }

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      config.body = JSON.stringify(data)
    }

    const response = await fetch(url, config)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return response.json()
  }
}
