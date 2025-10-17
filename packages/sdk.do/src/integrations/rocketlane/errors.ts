/**
 * Rocketlane Errors
 *
 * Auto-generated error handling for Rocketlane Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/rocketlane
 */

/**
 * Error type enum
 */
export enum RocketlaneErrorType {
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
 * Rocketlane Error class
 *
 * Custom error class for Rocketlane Integration operations.
 */
export class RocketlaneError extends Error {
  public readonly code: string | number
  public readonly type: RocketlaneErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: RocketlaneErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'RocketlaneError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RocketlaneError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns RocketlaneError instance
   */
  static fromError(error: any): RocketlaneError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: RocketlaneErrorType; retryable: boolean }> = {
      '401': { type: RocketlaneErrorType.Authentication, retryable: false },
      '429': { type: RocketlaneErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new RocketlaneError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = RocketlaneErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = RocketlaneErrorType.Authentication
    } else if (statusCode === 403) {
      type = RocketlaneErrorType.Authorization
    } else if (statusCode === 404) {
      type = RocketlaneErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = RocketlaneErrorType.Validation
    } else if (statusCode === 429) {
      type = RocketlaneErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = RocketlaneErrorType.Server
      retryable = true
    }

    return new RocketlaneError(message, code, type, {
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
    return this.type === RocketlaneErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === RocketlaneErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === RocketlaneErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === RocketlaneErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === RocketlaneErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === RocketlaneErrorType.Server
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
