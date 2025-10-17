/**
 * Skyfire Errors
 *
 * Auto-generated error handling for Skyfire Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/skyfire
 */

/**
 * Error type enum
 */
export enum SkyfireErrorType {
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
 * Skyfire Error class
 *
 * Custom error class for Skyfire Integration operations.
 */
export class SkyfireError extends Error {
  public readonly code: string | number
  public readonly type: SkyfireErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: SkyfireErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'SkyfireError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SkyfireError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns SkyfireError instance
   */
  static fromError(error: any): SkyfireError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: SkyfireErrorType; retryable: boolean }> = {
      '401': { type: SkyfireErrorType.Authentication, retryable: false },
      '429': { type: SkyfireErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new SkyfireError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = SkyfireErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = SkyfireErrorType.Authentication
    } else if (statusCode === 403) {
      type = SkyfireErrorType.Authorization
    } else if (statusCode === 404) {
      type = SkyfireErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = SkyfireErrorType.Validation
    } else if (statusCode === 429) {
      type = SkyfireErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = SkyfireErrorType.Server
      retryable = true
    }

    return new SkyfireError(message, code, type, {
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
    return this.type === SkyfireErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === SkyfireErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === SkyfireErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === SkyfireErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === SkyfireErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === SkyfireErrorType.Server
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
