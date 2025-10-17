/**
 * Mboum Errors
 *
 * Auto-generated error handling for Mboum Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/mboum
 */

/**
 * Error type enum
 */
export enum MboumErrorType {
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
 * Mboum Error class
 *
 * Custom error class for Mboum Integration operations.
 */
export class MboumError extends Error {
  public readonly code: string | number
  public readonly type: MboumErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: MboumErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'MboumError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MboumError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns MboumError instance
   */
  static fromError(error: any): MboumError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: MboumErrorType; retryable: boolean }> = {
      '401': { type: MboumErrorType.Authentication, retryable: false },
      '429': { type: MboumErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new MboumError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = MboumErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = MboumErrorType.Authentication
    } else if (statusCode === 403) {
      type = MboumErrorType.Authorization
    } else if (statusCode === 404) {
      type = MboumErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = MboumErrorType.Validation
    } else if (statusCode === 429) {
      type = MboumErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = MboumErrorType.Server
      retryable = true
    }

    return new MboumError(message, code, type, {
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
    return this.type === MboumErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === MboumErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === MboumErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === MboumErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === MboumErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === MboumErrorType.Server
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
