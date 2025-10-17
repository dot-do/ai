/**
 * HTTP Client for making authenticated requests through the .do API gateway
 *
 * Provides a generic HTTP client with automatic retries, error handling,
 * and authentication for making REST API calls.
 *
 * @example
 * ```typescript
 * import { $ } from 'sdk.do'
 *
 * // GET request
 * const users = await $.api.get('/v1/users')
 *
 * // POST request
 * const user = await $.api.post('/v1/users', {
 *   name: 'John Doe',
 *   email: 'john@example.com'
 * })
 *
 * // PUT request
 * await $.api.put('/v1/users/123', { name: 'Jane Doe' })
 *
 * // DELETE request
 * await $.api.delete('/v1/users/123')
 *
 * // With query parameters and options
 * const data = await $.api.get('/v1/users', {
 *   params: { limit: 10, offset: 0 },
 *   headers: { 'X-Custom': 'value' },
 *   timeout: 5000
 * })
 * ```
 */

// ============================================================================
// TYPES
// ============================================================================

export interface HTTPRequestOptions {
  /** Query parameters */
  params?: Record<string, string | number | boolean | undefined>
  /** Request headers */
  headers?: Record<string, string>
  /** Request timeout in milliseconds */
  timeout?: number
  /** Abort signal */
  signal?: AbortSignal
  /** Retry configuration */
  retry?: {
    maxAttempts?: number
    initialDelay?: number
    maxDelay?: number
    backoff?: number
  }
}

export interface HTTPResponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: Headers
}

// ============================================================================
// HTTP CLIENT
// ============================================================================

export class HTTPClient {
  private baseUrl: string
  private apiKey?: string
  private defaultHeaders: Record<string, string>

  constructor(baseUrl = 'https://apis.do', apiKey?: string) {
    this.baseUrl = baseUrl
    this.apiKey = apiKey
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    }

    if (apiKey) {
      this.defaultHeaders['Authorization'] = `Bearer ${apiKey}`
    }
  }

  /**
   * Build full URL with query parameters
   */
  private buildURL(path: string, params?: Record<string, string | number | boolean | undefined>): string {
    const url = new URL(path.startsWith('http') ? path : `${this.baseUrl}${path}`)

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value))
        }
      })
    }

    return url.toString()
  }

  /**
   * Make HTTP request with automatic retries
   */
  private async request<T = any>(method: string, path: string, body?: any, options: HTTPRequestOptions = {}): Promise<HTTPResponse<T>> {
    const { params, headers, timeout, signal, retry } = options
    const url = this.buildURL(path, params)

    // Retry configuration
    const maxAttempts = retry?.maxAttempts ?? 3
    const initialDelay = retry?.initialDelay ?? 1000
    const maxDelay = retry?.maxDelay ?? 10000
    const backoff = retry?.backoff ?? 2
    const retryOn = [408, 429, 500, 502, 503, 504]

    let lastError: Error | undefined

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        // Setup timeout
        const controller = new AbortController()
        const timeoutId = timeout ? setTimeout(() => controller.abort(), timeout) : undefined
        const abortSignal = signal || controller.signal

        // Make request
        const response = await fetch(url, {
          method,
          headers: {
            ...this.defaultHeaders,
            ...headers,
          },
          body: body ? JSON.stringify(body) : undefined,
          signal: abortSignal,
        })

        if (timeoutId) clearTimeout(timeoutId)

        // Check if we should retry
        if (!response.ok && retryOn.includes(response.status) && attempt < maxAttempts - 1) {
          const delay = Math.min(initialDelay * Math.pow(backoff, attempt), maxDelay)
          // Add jitter
          const jitter = delay * 0.25 * Math.random()
          await new Promise((resolve) => setTimeout(resolve, delay + jitter))
          continue
        }

        // Parse response
        let data: T
        const contentType = response.headers.get('content-type')
        if (contentType?.includes('application/json')) {
          data = (await response.json()) as T
        } else {
          data = (await response.text()) as any
        }

        // Throw on error
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        return {
          data,
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          throw new Error('Request timeout')
        }

        lastError = error as Error
        if (attempt < maxAttempts - 1) {
          const delay = Math.min(initialDelay * Math.pow(backoff, attempt), maxDelay)
          const jitter = delay * 0.25 * Math.random()
          await new Promise((resolve) => setTimeout(resolve, delay + jitter))
          continue
        }
      }
    }

    throw lastError || new Error('Request failed after all retries')
  }

  /**
   * Make a GET request
   */
  async get<T = any>(path: string, options?: HTTPRequestOptions): Promise<T> {
    const response = await this.request<T>('GET', path, undefined, options)
    return response.data
  }

  /**
   * Make a POST request
   */
  async post<T = any>(path: string, body?: any, options?: HTTPRequestOptions): Promise<T> {
    const response = await this.request<T>('POST', path, body, options)
    return response.data
  }

  /**
   * Make a PUT request
   */
  async put<T = any>(path: string, body?: any, options?: HTTPRequestOptions): Promise<T> {
    const response = await this.request<T>('PUT', path, body, options)
    return response.data
  }

  /**
   * Make a PATCH request
   */
  async patch<T = any>(path: string, body?: any, options?: HTTPRequestOptions): Promise<T> {
    const response = await this.request<T>('PATCH', path, body, options)
    return response.data
  }

  /**
   * Make a DELETE request
   */
  async delete<T = any>(path: string, options?: HTTPRequestOptions): Promise<T> {
    const response = await this.request<T>('DELETE', path, undefined, options)
    return response.data
  }

  /**
   * Make a HEAD request
   */
  async head(path: string, options?: HTTPRequestOptions): Promise<Headers> {
    const response = await this.request('HEAD', path, undefined, options)
    return response.headers
  }

  /**
   * Make an OPTIONS request
   */
  async options<T = any>(path: string, options?: HTTPRequestOptions): Promise<T> {
    const response = await this.request<T>('OPTIONS', path, undefined, options)
    return response.data
  }
}

/**
 * Create HTTP client instance
 */
export function createHTTPClient(baseUrl?: string, apiKey?: string): HTTPClient {
  return new HTTPClient(baseUrl, apiKey)
}

/**
 * Default HTTP client instance
 */
export const http = createHTTPClient()
