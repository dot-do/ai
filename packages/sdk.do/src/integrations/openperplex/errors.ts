/**
 * Openperplex Errors
 *
 * Auto-generated error handling for Openperplex Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/openperplex
 */

/**
 * Error type enum
 */
export enum OpenperplexErrorType {
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
 * Openperplex Error class
 *
 * Custom error class for Openperplex Integration operations.
 */
export class OpenperplexError extends Error {
  public readonly code: string | number
  public readonly type: OpenperplexErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: OpenperplexErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'OpenperplexError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, OpenperplexError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns OpenperplexError instance
   */
  static fromError(error: any): OpenperplexError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: OpenperplexErrorType; retryable: boolean }> = {
      '401': { type: OpenperplexErrorType.Authentication, retryable: false },
      '429': { type: OpenperplexErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new OpenperplexError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = OpenperplexErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = OpenperplexErrorType.Authentication
    } else if (statusCode === 403) {
      type = OpenperplexErrorType.Authorization
    } else if (statusCode === 404) {
      type = OpenperplexErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = OpenperplexErrorType.Validation
    } else if (statusCode === 429) {
      type = OpenperplexErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = OpenperplexErrorType.Server
      retryable = true
    }

    return new OpenperplexError(message, code, type, {
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
    return this.type === OpenperplexErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === OpenperplexErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === OpenperplexErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === OpenperplexErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === OpenperplexErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === OpenperplexErrorType.Server
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
