/**
 * Zylvie Errors
 *
 * Auto-generated error handling for Zylvie Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/zylvie
 */

/**
 * Error type enum
 */
export enum ZylvieErrorType {
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
 * Zylvie Error class
 *
 * Custom error class for Zylvie Integration operations.
 */
export class ZylvieError extends Error {
  public readonly code: string | number
  public readonly type: ZylvieErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ZylvieErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ZylvieError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ZylvieError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ZylvieError instance
   */
  static fromError(error: any): ZylvieError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ZylvieErrorType; retryable: boolean }> = {
      '401': { type: ZylvieErrorType.Authentication, retryable: false },
      '429': { type: ZylvieErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ZylvieError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ZylvieErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ZylvieErrorType.Authentication
    } else if (statusCode === 403) {
      type = ZylvieErrorType.Authorization
    } else if (statusCode === 404) {
      type = ZylvieErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ZylvieErrorType.Validation
    } else if (statusCode === 429) {
      type = ZylvieErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ZylvieErrorType.Server
      retryable = true
    }

    return new ZylvieError(message, code, type, {
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
    return this.type === ZylvieErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ZylvieErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ZylvieErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ZylvieErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ZylvieErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ZylvieErrorType.Server
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
