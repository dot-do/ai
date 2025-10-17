/**
 * Starton Errors
 *
 * Auto-generated error handling for Starton Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/starton
 */

/**
 * Error type enum
 */
export enum StartonErrorType {
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
 * Starton Error class
 *
 * Custom error class for Starton Integration operations.
 */
export class StartonError extends Error {
  public readonly code: string | number
  public readonly type: StartonErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: StartonErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'StartonError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, StartonError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns StartonError instance
   */
  static fromError(error: any): StartonError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: StartonErrorType; retryable: boolean }> = {
      '401': { type: StartonErrorType.Authentication, retryable: false },
      '429': { type: StartonErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new StartonError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = StartonErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = StartonErrorType.Authentication
    } else if (statusCode === 403) {
      type = StartonErrorType.Authorization
    } else if (statusCode === 404) {
      type = StartonErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = StartonErrorType.Validation
    } else if (statusCode === 429) {
      type = StartonErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = StartonErrorType.Server
      retryable = true
    }

    return new StartonError(message, code, type, {
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
    return this.type === StartonErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === StartonErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === StartonErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === StartonErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === StartonErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === StartonErrorType.Server
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
