/**
 * Melo Errors
 *
 * Auto-generated error handling for Melo Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/melo
 */

/**
 * Error type enum
 */
export enum MeloErrorType {
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
 * Melo Error class
 *
 * Custom error class for Melo Integration operations.
 */
export class MeloError extends Error {
  public readonly code: string | number
  public readonly type: MeloErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: MeloErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'MeloError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MeloError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns MeloError instance
   */
  static fromError(error: any): MeloError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: MeloErrorType; retryable: boolean }> = {
      '401': { type: MeloErrorType.Authentication, retryable: false },
      '429': { type: MeloErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new MeloError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = MeloErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = MeloErrorType.Authentication
    } else if (statusCode === 403) {
      type = MeloErrorType.Authorization
    } else if (statusCode === 404) {
      type = MeloErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = MeloErrorType.Validation
    } else if (statusCode === 429) {
      type = MeloErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = MeloErrorType.Server
      retryable = true
    }

    return new MeloError(message, code, type, {
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
    return this.type === MeloErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === MeloErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === MeloErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === MeloErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === MeloErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === MeloErrorType.Server
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
