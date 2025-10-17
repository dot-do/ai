/**
 * Ngrok Errors
 *
 * Auto-generated error handling for Ngrok Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/ngrok
 */

/**
 * Error type enum
 */
export enum NgrokErrorType {
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
 * Ngrok Error class
 *
 * Custom error class for Ngrok Integration operations.
 */
export class NgrokError extends Error {
  public readonly code: string | number
  public readonly type: NgrokErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: NgrokErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'NgrokError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NgrokError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns NgrokError instance
   */
  static fromError(error: any): NgrokError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: NgrokErrorType; retryable: boolean }> = {
      '401': { type: NgrokErrorType.Authentication, retryable: false },
      '429': { type: NgrokErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new NgrokError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = NgrokErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = NgrokErrorType.Authentication
    } else if (statusCode === 403) {
      type = NgrokErrorType.Authorization
    } else if (statusCode === 404) {
      type = NgrokErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = NgrokErrorType.Validation
    } else if (statusCode === 429) {
      type = NgrokErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = NgrokErrorType.Server
      retryable = true
    }

    return new NgrokError(message, code, type, {
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
    return this.type === NgrokErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === NgrokErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === NgrokErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === NgrokErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === NgrokErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === NgrokErrorType.Server
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
