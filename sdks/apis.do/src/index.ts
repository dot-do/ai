/**
 * apis.do - TypeScript SDK for the .do API platform
 * https://apis.do
 */

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string,
    public body?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export interface ApiClientConfig {
  baseUrl?: string
  apiKey?: string
  timeout?: number
}

export interface ApiMetadata {
  name: string
  version: string
  status: 'healthy' | 'degraded' | 'unhealthy'
  environment: string
  protocol: string
  host: string
}

export interface UserInfo {
  authenticated: boolean
  ip: string
  asn: string | number
  country: string
  colo: string
  timestamp: number
  latency: number
  login?: string
  profile?: string
  [key: string]: unknown
}

export interface ApiRootResponse {
  $context: string
  $type: string
  $id: string
  api: ApiMetadata
  endpoints: Record<string, string>
  user: UserInfo
}

export interface WebhookPayload {
  [key: string]: unknown
}

export interface AIGenerateRequest {
  prompt: string
  provider?: string
  model?: string
  maxTokens?: number
  temperature?: number
}

export interface AIGenerateResponse {
  text: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

export class ApiClient {
  private baseUrl: string
  private apiKey?: string
  private timeout: number

  constructor(config: ApiClientConfig = {}) {
    this.baseUrl = config.baseUrl || 'https://apis.do'
    this.apiKey = config.apiKey
    this.timeout = config.timeout || 30000
  }

  /**
   * Make a request to the API
   */
  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${path}`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      })

      // Clear timeout immediately after fetch completes
      clearTimeout(timeoutId)

      if (!response.ok) {
        // Try to extract error body for better error messages
        let errorBody: unknown
        try {
          errorBody = await response.json()
        } catch {
          // If response isn't JSON, ignore
        }

        throw new ApiError(`API request failed: ${response.status} ${response.statusText}`, response.status, response.statusText, errorBody)
      }

      return (await response.json()) as T
    } catch (error) {
      // Clear timeout for better resource management in all error paths
      clearTimeout(timeoutId)

      // Handle timeout: AbortError is thrown when the timeout fires
      if (error instanceof Error && error.name === 'AbortError') {
        throw new ApiError('Request timeout', 408, 'Request Timeout')
      }

      // Re-throw ApiError as-is
      if (error instanceof ApiError) {
        throw error
      }

      // Handle other errors (network errors, JSON parse errors, etc.)
      // Note: timeout already cleared if fetch succeeded
      throw new ApiError(error instanceof Error ? error.message : 'Unknown error', 0, 'Network Error')
    }
  }

  /**
   * Get API health and metadata
   */
  async health(): Promise<ApiRootResponse> {
    return this.request<ApiRootResponse>('/')
  }

  /**
   * Get user information and request metadata
   */
  async user(): Promise<UserInfo> {
    return this.request<UserInfo>('/user')
  }

  /**
   * Send a webhook
   */
  async sendWebhook(provider: string, payload: WebhookPayload, headers?: Record<string, string>): Promise<unknown> {
    return this.request(`/webhooks/${provider}`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers,
    })
  }

  /**
   * Generate AI text
   */
  async generateText(request: AIGenerateRequest): Promise<AIGenerateResponse> {
    return this.request<AIGenerateResponse>('/ai/generate', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  }

  /**
   * Get admin API metadata
   */
  async adminApi(): Promise<unknown> {
    return this.request('/admin/api')
  }

  /**
   * Get repository information
   */
  async getRepo(owner: string, repo: string): Promise<unknown> {
    return this.request(`/api/repos/${owner}/${repo}`)
  }

  /**
   * Check if API is healthy
   * @param options.throwOnError - If true, throw errors instead of returning false (useful for debugging)
   */
  async isHealthy(options?: { throwOnError?: boolean }): Promise<boolean> {
    try {
      const health = await this.health()
      return health.api.status === 'healthy'
    } catch (error) {
      if (options?.throwOnError) {
        throw error
      }
      return false
    }
  }

  /**
   * Get API endpoints
   */
  async getEndpoints(): Promise<Record<string, string>> {
    const health = await this.health()
    if (!health.endpoints) {
      throw new ApiError('API response missing endpoints', 500, 'Invalid Response')
    }
    return health.endpoints
  }
}

/**
 * Type guard to check if an error is an ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

/**
 * Type guard to check if a response indicates a healthy API
 */
export function isHealthyResponse(response: ApiRootResponse): boolean {
  return response.api.status === 'healthy'
}

/**
 * Create a new API client
 */
export function createClient(config?: ApiClientConfig): ApiClient {
  return new ApiClient(config)
}

// Export default client instance for convenience
export const api = new ApiClient()
