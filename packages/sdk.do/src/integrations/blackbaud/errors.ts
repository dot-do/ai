/**
 * Blackbaud Errors
 *
 * Auto-generated error handling for Blackbaud Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/blackbaud
 */

/**
 * Error type enum
 */
export enum BlackbaudErrorType {
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
 * Blackbaud Error class
 *
 * Custom error class for Blackbaud Integration operations.
 */
export class BlackbaudError extends Error {
  public readonly code: string | number
  public readonly type: BlackbaudErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: BlackbaudErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'BlackbaudError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BlackbaudError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns BlackbaudError instance
   */
  static fromError(error: any): BlackbaudError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: BlackbaudErrorType; retryable: boolean }> = {
      '401': { type: BlackbaudErrorType.Authentication, retryable: false },
      '429': { type: BlackbaudErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new BlackbaudError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = BlackbaudErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = BlackbaudErrorType.Authentication
    } else if (statusCode === 403) {
      type = BlackbaudErrorType.Authorization
    } else if (statusCode === 404) {
      type = BlackbaudErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = BlackbaudErrorType.Validation
    } else if (statusCode === 429) {
      type = BlackbaudErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = BlackbaudErrorType.Server
      retryable = true
    }

    return new BlackbaudError(message, code, type, {
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
    return this.type === BlackbaudErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === BlackbaudErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === BlackbaudErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === BlackbaudErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === BlackbaudErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === BlackbaudErrorType.Server
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
