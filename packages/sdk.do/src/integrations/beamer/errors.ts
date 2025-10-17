/**
 * Beamer Errors
 *
 * Auto-generated error handling for Beamer Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/beamer
 */

/**
 * Error type enum
 */
export enum BeamerErrorType {
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
 * Beamer Error class
 *
 * Custom error class for Beamer Integration operations.
 */
export class BeamerError extends Error {
  public readonly code: string | number
  public readonly type: BeamerErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: BeamerErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'BeamerError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BeamerError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns BeamerError instance
   */
  static fromError(error: any): BeamerError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: BeamerErrorType; retryable: boolean }> = {
      '401': { type: BeamerErrorType.Authentication, retryable: false },
      '429': { type: BeamerErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new BeamerError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = BeamerErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = BeamerErrorType.Authentication
    } else if (statusCode === 403) {
      type = BeamerErrorType.Authorization
    } else if (statusCode === 404) {
      type = BeamerErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = BeamerErrorType.Validation
    } else if (statusCode === 429) {
      type = BeamerErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = BeamerErrorType.Server
      retryable = true
    }

    return new BeamerError(message, code, type, {
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
    return this.type === BeamerErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === BeamerErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === BeamerErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === BeamerErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === BeamerErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === BeamerErrorType.Server
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
