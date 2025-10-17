/**
 * Everhour Errors
 *
 * Auto-generated error handling for Everhour Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/everhour
 */

/**
 * Error type enum
 */
export enum EverhourErrorType {
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
 * Everhour Error class
 *
 * Custom error class for Everhour Integration operations.
 */
export class EverhourError extends Error {
  public readonly code: string | number
  public readonly type: EverhourErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: EverhourErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'EverhourError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, EverhourError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns EverhourError instance
   */
  static fromError(error: any): EverhourError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: EverhourErrorType; retryable: boolean }> = {
      '401': { type: EverhourErrorType.Authentication, retryable: false },
      '429': { type: EverhourErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new EverhourError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = EverhourErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = EverhourErrorType.Authentication
    } else if (statusCode === 403) {
      type = EverhourErrorType.Authorization
    } else if (statusCode === 404) {
      type = EverhourErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = EverhourErrorType.Validation
    } else if (statusCode === 429) {
      type = EverhourErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = EverhourErrorType.Server
      retryable = true
    }

    return new EverhourError(message, code, type, {
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
    return this.type === EverhourErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === EverhourErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === EverhourErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === EverhourErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === EverhourErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === EverhourErrorType.Server
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
