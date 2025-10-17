/**
 * Castingwords Errors
 *
 * Auto-generated error handling for Castingwords Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/castingwords
 */

/**
 * Error type enum
 */
export enum CastingwordsErrorType {
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
 * Castingwords Error class
 *
 * Custom error class for Castingwords Integration operations.
 */
export class CastingwordsError extends Error {
  public readonly code: string | number
  public readonly type: CastingwordsErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: CastingwordsErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'CastingwordsError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CastingwordsError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns CastingwordsError instance
   */
  static fromError(error: any): CastingwordsError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: CastingwordsErrorType; retryable: boolean }> = {
      '401': { type: CastingwordsErrorType.Authentication, retryable: false },
      '429': { type: CastingwordsErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new CastingwordsError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = CastingwordsErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = CastingwordsErrorType.Authentication
    } else if (statusCode === 403) {
      type = CastingwordsErrorType.Authorization
    } else if (statusCode === 404) {
      type = CastingwordsErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = CastingwordsErrorType.Validation
    } else if (statusCode === 429) {
      type = CastingwordsErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = CastingwordsErrorType.Server
      retryable = true
    }

    return new CastingwordsError(message, code, type, {
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
    return this.type === CastingwordsErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === CastingwordsErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === CastingwordsErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === CastingwordsErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === CastingwordsErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === CastingwordsErrorType.Server
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
