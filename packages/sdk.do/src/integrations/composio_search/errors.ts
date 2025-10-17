/**
 * Composio search Errors
 *
 * Auto-generated error handling for Composio search Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/composio_search
 */

/**
 * Error type enum
 */
export enum ComposioSearchErrorType {
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
 * Composio search Error class
 *
 * Custom error class for Composio search Integration operations.
 */
export class ComposioSearchError extends Error {
  public readonly code: string | number
  public readonly type: ComposioSearchErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ComposioSearchErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ComposioSearchError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ComposioSearchError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ComposioSearchError instance
   */
  static fromError(error: any): ComposioSearchError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ComposioSearchErrorType; retryable: boolean }> = {
      '401': { type: ComposioSearchErrorType.Authentication, retryable: false },
      '429': { type: ComposioSearchErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ComposioSearchError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ComposioSearchErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ComposioSearchErrorType.Authentication
    } else if (statusCode === 403) {
      type = ComposioSearchErrorType.Authorization
    } else if (statusCode === 404) {
      type = ComposioSearchErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ComposioSearchErrorType.Validation
    } else if (statusCode === 429) {
      type = ComposioSearchErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ComposioSearchErrorType.Server
      retryable = true
    }

    return new ComposioSearchError(message, code, type, {
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
    return this.type === ComposioSearchErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ComposioSearchErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ComposioSearchErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ComposioSearchErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ComposioSearchErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ComposioSearchErrorType.Server
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
