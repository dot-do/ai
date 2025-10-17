/**
 * Detrack Errors
 *
 * Auto-generated error handling for Detrack Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/detrack
 */

/**
 * Error type enum
 */
export enum DetrackErrorType {
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
 * Detrack Error class
 *
 * Custom error class for Detrack Integration operations.
 */
export class DetrackError extends Error {
  public readonly code: string | number
  public readonly type: DetrackErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: DetrackErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'DetrackError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DetrackError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns DetrackError instance
   */
  static fromError(error: any): DetrackError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: DetrackErrorType; retryable: boolean }> = {
      '401': { type: DetrackErrorType.Authentication, retryable: false },
      '429': { type: DetrackErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new DetrackError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = DetrackErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = DetrackErrorType.Authentication
    } else if (statusCode === 403) {
      type = DetrackErrorType.Authorization
    } else if (statusCode === 404) {
      type = DetrackErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = DetrackErrorType.Validation
    } else if (statusCode === 429) {
      type = DetrackErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = DetrackErrorType.Server
      retryable = true
    }

    return new DetrackError(message, code, type, {
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
    return this.type === DetrackErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === DetrackErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === DetrackErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === DetrackErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === DetrackErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === DetrackErrorType.Server
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
