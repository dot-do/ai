/**
 * Cloudflare browser rendering Errors
 *
 * Auto-generated error handling for Cloudflare browser rendering Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/cloudflare_browser_rendering
 */

/**
 * Error type enum
 */
export enum CloudflareBrowserRenderingErrorType {
  Authentication = 'authentication',
  Authorization = 'authorization',
  Validation = 'validation',
  NotFound = 'not_found',
  RateLimit = 'rate_limit',
  Server = 'server',
  Network = 'network',
  Unknown = 'unknown',
}

/**
 * Cloudflare browser rendering Error class
 *
 * Custom error class for Cloudflare browser rendering Integration operations.
 */
export class CloudflareBrowserRenderingError extends Error {
  public readonly code: string | number
  public readonly type: CloudflareBrowserRenderingErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: CloudflareBrowserRenderingErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'CloudflareBrowserRenderingError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CloudflareBrowserRenderingError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns CloudflareBrowserRenderingError instance
   */
  static fromError(error: any): CloudflareBrowserRenderingError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: CloudflareBrowserRenderingErrorType; retryable: boolean }> = {
      '401': { type: CloudflareBrowserRenderingErrorType.Authentication, retryable: false },
      '429': { type: CloudflareBrowserRenderingErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new CloudflareBrowserRenderingError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = CloudflareBrowserRenderingErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = CloudflareBrowserRenderingErrorType.Authentication
    } else if (statusCode === 403) {
      type = CloudflareBrowserRenderingErrorType.Authorization
    } else if (statusCode === 404) {
      type = CloudflareBrowserRenderingErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = CloudflareBrowserRenderingErrorType.Validation
    } else if (statusCode === 429) {
      type = CloudflareBrowserRenderingErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = CloudflareBrowserRenderingErrorType.Server
      retryable = true
    }

    return new CloudflareBrowserRenderingError(message, code, type, {
      statusCode,
      retryable,
      originalError: error,
    })
  }

  /** Check if error is retryable */
  isRetriable(): boolean {
    return this.retryable
  }

  /** Check if error is authentication error */
  isAuthenticationError(): boolean {
    return this.type === CloudflareBrowserRenderingErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === CloudflareBrowserRenderingErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === CloudflareBrowserRenderingErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === CloudflareBrowserRenderingErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === CloudflareBrowserRenderingErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === CloudflareBrowserRenderingErrorType.Server
  }

  /** Get error details as object */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      type: this.type,
      statusCode: this.statusCode,
      retryable: this.retryable,
    }
  }
}
