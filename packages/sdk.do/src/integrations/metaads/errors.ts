/**
 * Metaads Errors
 *
 * Auto-generated error handling for Metaads Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/metaads
 */

/**
 * Error type enum
 */
export enum MetaadsErrorType {
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
 * Metaads Error class
 *
 * Custom error class for Metaads Integration operations.
 */
export class MetaadsError extends Error {
  public readonly code: string | number
  public readonly type: MetaadsErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: MetaadsErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'MetaadsError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MetaadsError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns MetaadsError instance
   */
  static fromError(error: any): MetaadsError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: MetaadsErrorType; retryable: boolean }> = {
      '401': { type: MetaadsErrorType.Authentication, retryable: false },
      '429': { type: MetaadsErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new MetaadsError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = MetaadsErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = MetaadsErrorType.Authentication
    } else if (statusCode === 403) {
      type = MetaadsErrorType.Authorization
    } else if (statusCode === 404) {
      type = MetaadsErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = MetaadsErrorType.Validation
    } else if (statusCode === 429) {
      type = MetaadsErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = MetaadsErrorType.Server
      retryable = true
    }

    return new MetaadsError(message, code, type, {
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
    return this.type === MetaadsErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === MetaadsErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === MetaadsErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === MetaadsErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === MetaadsErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === MetaadsErrorType.Server
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
