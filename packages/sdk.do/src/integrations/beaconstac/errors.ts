/**
 * Beaconstac Errors
 *
 * Auto-generated error handling for Beaconstac Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/beaconstac
 */

/**
 * Error type enum
 */
export enum BeaconstacErrorType {
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
 * Beaconstac Error class
 *
 * Custom error class for Beaconstac Integration operations.
 */
export class BeaconstacError extends Error {
  public readonly code: string | number
  public readonly type: BeaconstacErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: BeaconstacErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'BeaconstacError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BeaconstacError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns BeaconstacError instance
   */
  static fromError(error: any): BeaconstacError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: BeaconstacErrorType; retryable: boolean }> = {
      '401': { type: BeaconstacErrorType.Authentication, retryable: false },
      '429': { type: BeaconstacErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new BeaconstacError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = BeaconstacErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = BeaconstacErrorType.Authentication
    } else if (statusCode === 403) {
      type = BeaconstacErrorType.Authorization
    } else if (statusCode === 404) {
      type = BeaconstacErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = BeaconstacErrorType.Validation
    } else if (statusCode === 429) {
      type = BeaconstacErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = BeaconstacErrorType.Server
      retryable = true
    }

    return new BeaconstacError(message, code, type, {
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
    return this.type === BeaconstacErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === BeaconstacErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === BeaconstacErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === BeaconstacErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === BeaconstacErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === BeaconstacErrorType.Server
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
