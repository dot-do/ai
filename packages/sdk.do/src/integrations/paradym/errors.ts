/**
 * Paradym Errors
 *
 * Auto-generated error handling for Paradym Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/paradym
 */

/**
 * Error type enum
 */
export enum ParadymErrorType {
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
 * Paradym Error class
 *
 * Custom error class for Paradym Integration operations.
 */
export class ParadymError extends Error {
  public readonly code: string | number
  public readonly type: ParadymErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ParadymErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ParadymError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ParadymError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ParadymError instance
   */
  static fromError(error: any): ParadymError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ParadymErrorType; retryable: boolean }> = {
      '401': { type: ParadymErrorType.Authentication, retryable: false },
      '429': { type: ParadymErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ParadymError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ParadymErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ParadymErrorType.Authentication
    } else if (statusCode === 403) {
      type = ParadymErrorType.Authorization
    } else if (statusCode === 404) {
      type = ParadymErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ParadymErrorType.Validation
    } else if (statusCode === 429) {
      type = ParadymErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ParadymErrorType.Server
      retryable = true
    }

    return new ParadymError(message, code, type, {
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
    return this.type === ParadymErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ParadymErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ParadymErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ParadymErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ParadymErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ParadymErrorType.Server
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
