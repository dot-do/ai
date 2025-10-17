/**
 * Needle Errors
 *
 * Auto-generated error handling for Needle Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/needle
 */

/**
 * Error type enum
 */
export enum NeedleErrorType {
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
 * Needle Error class
 *
 * Custom error class for Needle Integration operations.
 */
export class NeedleError extends Error {
  public readonly code: string | number
  public readonly type: NeedleErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: NeedleErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'NeedleError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NeedleError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns NeedleError instance
   */
  static fromError(error: any): NeedleError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: NeedleErrorType; retryable: boolean }> = {
      '401': { type: NeedleErrorType.Authentication, retryable: false },
      '429': { type: NeedleErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new NeedleError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = NeedleErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = NeedleErrorType.Authentication
    } else if (statusCode === 403) {
      type = NeedleErrorType.Authorization
    } else if (statusCode === 404) {
      type = NeedleErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = NeedleErrorType.Validation
    } else if (statusCode === 429) {
      type = NeedleErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = NeedleErrorType.Server
      retryable = true
    }

    return new NeedleError(message, code, type, {
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
    return this.type === NeedleErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === NeedleErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === NeedleErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === NeedleErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === NeedleErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === NeedleErrorType.Server
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
