/**
 * Woodpecker co Errors
 *
 * Auto-generated error handling for Woodpecker co Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/woodpecker_co
 */

/**
 * Error type enum
 */
export enum WoodpeckerCoErrorType {
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
 * Woodpecker co Error class
 *
 * Custom error class for Woodpecker co Integration operations.
 */
export class WoodpeckerCoError extends Error {
  public readonly code: string | number
  public readonly type: WoodpeckerCoErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: WoodpeckerCoErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'WoodpeckerCoError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, WoodpeckerCoError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns WoodpeckerCoError instance
   */
  static fromError(error: any): WoodpeckerCoError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: WoodpeckerCoErrorType; retryable: boolean }> = {
      '401': { type: WoodpeckerCoErrorType.Authentication, retryable: false },
      '429': { type: WoodpeckerCoErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new WoodpeckerCoError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = WoodpeckerCoErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = WoodpeckerCoErrorType.Authentication
    } else if (statusCode === 403) {
      type = WoodpeckerCoErrorType.Authorization
    } else if (statusCode === 404) {
      type = WoodpeckerCoErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = WoodpeckerCoErrorType.Validation
    } else if (statusCode === 429) {
      type = WoodpeckerCoErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = WoodpeckerCoErrorType.Server
      retryable = true
    }

    return new WoodpeckerCoError(message, code, type, {
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
    return this.type === WoodpeckerCoErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === WoodpeckerCoErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === WoodpeckerCoErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === WoodpeckerCoErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === WoodpeckerCoErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === WoodpeckerCoErrorType.Server
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
