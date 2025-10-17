/**
 * Geokeo Errors
 *
 * Auto-generated error handling for Geokeo Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/geokeo
 */

/**
 * Error type enum
 */
export enum GeokeoErrorType {
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
 * Geokeo Error class
 *
 * Custom error class for Geokeo Integration operations.
 */
export class GeokeoError extends Error {
  public readonly code: string | number
  public readonly type: GeokeoErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: GeokeoErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'GeokeoError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GeokeoError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns GeokeoError instance
   */
  static fromError(error: any): GeokeoError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: GeokeoErrorType; retryable: boolean }> = {
      '401': { type: GeokeoErrorType.Authentication, retryable: false },
      '429': { type: GeokeoErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new GeokeoError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = GeokeoErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = GeokeoErrorType.Authentication
    } else if (statusCode === 403) {
      type = GeokeoErrorType.Authorization
    } else if (statusCode === 404) {
      type = GeokeoErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = GeokeoErrorType.Validation
    } else if (statusCode === 429) {
      type = GeokeoErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = GeokeoErrorType.Server
      retryable = true
    }

    return new GeokeoError(message, code, type, {
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
    return this.type === GeokeoErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === GeokeoErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === GeokeoErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === GeokeoErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === GeokeoErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === GeokeoErrorType.Server
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
