/**
 * Composio client implementation using direct API calls
 */

import type {
  ComposioConfig,
  ComposioApp,
  ComposioAction,
  ComposioTrigger,
  ComposioConnectedAccount,
  ListResponse,
  ListFilters,
  ExecuteActionOptions,
  SetupTriggerOptions,
  InitiateConnectionOptions,
  ConnectionResult,
} from './types.js'
import { mapError } from './errors.js'
import { retry, validateApiKey, buildQueryString, createTimeoutController } from './utils.js'

/**
 * ComposioClient - Direct API implementation with retry logic and error handling
 */
export class ComposioClient {
  private config: Required<ComposioConfig>

  constructor(config: ComposioConfig = {}) {
    // Validate and set API key
    const apiKey = validateApiKey(config.apiKey)

    // Set defaults
    this.config = {
      apiKey,
      baseUrl: config.baseUrl || 'https://backend.composio.dev/api/v3',
      maxRetries: config.maxRetries ?? 3,
      retryDelay: config.retryDelay ?? 1000,
      timeout: config.timeout ?? 30000,
    }
  }

  /**
   * Make an authenticated request to Composio API
   */
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const controller = createTimeoutController(this.config.timeout)

    const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'X-API-Key': this.config.apiKey,
        'Content-Type': 'application/json',
        ...options.headers,
      },
      signal: controller.signal,
    })

    if (!response.ok) {
      const error: any = new Error(`HTTP ${response.status}: ${response.statusText}`)
      error.status = response.status
      error.statusText = response.statusText
      try {
        error.body = await response.json()
      } catch {
        error.body = await response.text()
      }
      throw error
    }

    return response.json() as Promise<T>
  }

  /**
   * List all available apps/integrations
   */
  async listApps(filters: ListFilters = {}): Promise<ListResponse<ComposioApp>> {
    return retry(
      async () => {
        try {
          const query = buildQueryString({
            page: filters.page,
            page_size: filters.pageSize,
            search: filters.search,
          })

          const data = await this.request<any>(`/apps${query}`)

          return {
            items: data.items || data || [],
            pageInfo: {
              total: data.page_info?.total || data.items?.length || 0,
              page: data.page_info?.page || filters.page || 1,
              pageSize: data.page_info?.page_size || filters.pageSize || 10,
              hasNext: data.page_info?.has_next || false,
              hasPrevious: data.page_info?.has_previous || false,
            },
          }
        } catch (error) {
          throw mapError(error)
        }
      },
      {
        maxRetries: this.config.maxRetries,
        baseDelay: this.config.retryDelay,
      }
    )
  }

  /**
   * Get a specific app by key
   */
  async getApp(appKey: string): Promise<ComposioApp> {
    return retry(
      async () => {
        try {
          return await this.request<ComposioApp>(`/apps/${appKey}`)
        } catch (error) {
          throw mapError(error)
        }
      },
      {
        maxRetries: this.config.maxRetries,
        baseDelay: this.config.retryDelay,
      }
    )
  }

  /**
   * List available actions/tools
   */
  async listActions(filters: ListFilters & { appName?: string } = {}): Promise<ComposioAction[]> {
    return retry(
      async () => {
        try {
          const query = buildQueryString({
            app_name: filters.appName,
            search: filters.search,
          })

          const data = await this.request<any>(`/actions${query}`)
          return data.items || data || []
        } catch (error) {
          throw mapError(error)
        }
      },
      {
        maxRetries: this.config.maxRetries,
        baseDelay: this.config.retryDelay,
      }
    )
  }

  /**
   * Get a specific action
   */
  async getAction(actionName: string): Promise<ComposioAction> {
    return retry(
      async () => {
        try {
          return await this.request<ComposioAction>(`/actions/${actionName}`)
        } catch (error) {
          throw mapError(error)
        }
      },
      {
        maxRetries: this.config.maxRetries,
        baseDelay: this.config.retryDelay,
      }
    )
  }

  /**
   * Execute an action
   */
  async executeAction<T = any>(options: ExecuteActionOptions): Promise<T> {
    return retry(
      async () => {
        try {
          const body: any = {
            appName: options.actionName.split('_')[0].toLowerCase(),
            input: options.params,
          }

          if (options.userId) {
            body.entityId = options.userId
          }

          if (options.connectedAccountId) {
            body.connectedAccountId = options.connectedAccountId
          }

          if (options.auth) {
            body.auth = options.auth
          }

          return await this.request<T>(`/actions/${options.actionName}/execute`, {
            method: 'POST',
            body: JSON.stringify(body),
          })
        } catch (error) {
          throw mapError(error)
        }
      },
      {
        maxRetries: this.config.maxRetries,
        baseDelay: this.config.retryDelay,
      }
    )
  }

  /**
   * List available triggers
   */
  async listTriggers(filters: ListFilters & { appName?: string } = {}): Promise<ComposioTrigger[]> {
    return retry(
      async () => {
        try {
          const query = buildQueryString({
            app_name: filters.appName,
            search: filters.search,
          })

          const data = await this.request<any>(`/triggers${query}`)
          return data.items || data || []
        } catch (error) {
          throw mapError(error)
        }
      },
      {
        maxRetries: this.config.maxRetries,
        baseDelay: this.config.retryDelay,
      }
    )
  }

  /**
   * Setup a trigger
   */
  async setupTrigger(options: SetupTriggerOptions): Promise<ComposioTrigger> {
    return retry(
      async () => {
        try {
          return await this.request<ComposioTrigger>('/triggers', {
            method: 'POST',
            body: JSON.stringify({
              entityId: options.userId,
              triggerName: options.triggerName,
              config: options.config,
            }),
          })
        } catch (error) {
          throw mapError(error)
        }
      },
      {
        maxRetries: this.config.maxRetries,
        baseDelay: this.config.retryDelay,
      }
    )
  }

  /**
   * List connected accounts for a user
   */
  async listConnections(filters: { userId?: string; appName?: string } = {}): Promise<ComposioConnectedAccount[]> {
    return retry(
      async () => {
        try {
          const query = buildQueryString({
            user_uuid: filters.userId,
            integration_id: filters.appName,
          })

          const data = await this.request<any>(`/connectedAccounts${query}`)
          return data.items || data || []
        } catch (error) {
          throw mapError(error)
        }
      },
      {
        maxRetries: this.config.maxRetries,
        baseDelay: this.config.retryDelay,
      }
    )
  }

  /**
   * Initiate a new connection (OAuth flow)
   */
  async initiateConnection(options: InitiateConnectionOptions): Promise<ConnectionResult> {
    return retry(
      async () => {
        try {
          const data = await this.request<any>('/connectedAccounts', {
            method: 'POST',
            body: JSON.stringify({
              integrationId: options.authConfigId,
              userUuid: options.userId,
              redirectUri: options.redirectUrl,
              labels: options.allowMultiple ? ['allow_multiple'] : undefined,
            }),
          })

          return {
            redirectUrl: data.redirectUrl || data.redirect_url || '',
            connectionId: data.connectionId || data.id || '',
          }
        } catch (error) {
          throw mapError(error)
        }
      },
      {
        maxRetries: this.config.maxRetries,
        baseDelay: this.config.retryDelay,
      }
    )
  }

  /**
   * Get a connected account
   */
  async getConnection(connectionId: string): Promise<ComposioConnectedAccount> {
    return retry(
      async () => {
        try {
          return await this.request<ComposioConnectedAccount>(`/connectedAccounts/${connectionId}`)
        } catch (error) {
          throw mapError(error)
        }
      },
      {
        maxRetries: this.config.maxRetries,
        baseDelay: this.config.retryDelay,
      }
    )
  }

  /**
   * Delete a connected account
   */
  async deleteConnection(connectionId: string): Promise<void> {
    return retry(
      async () => {
        try {
          await this.request<void>(`/connectedAccounts/${connectionId}`, {
            method: 'DELETE',
          })
        } catch (error) {
          throw mapError(error)
        }
      },
      {
        maxRetries: this.config.maxRetries,
        baseDelay: this.config.retryDelay,
      }
    )
  }
}
