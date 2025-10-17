/**
 * Printnode Errors
 *
 * Auto-generated error handling for Printnode Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/printnode
 */

/**
 * Error type enum
 */
export enum PrintnodeErrorType {
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
 * Printnode Error class
 *
 * Custom error class for Printnode Integration operations.
 */
export class PrintnodeError extends Error {
  public readonly code: string | number
  public readonly type: PrintnodeErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: PrintnodeErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'PrintnodeError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PrintnodeError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns PrintnodeError instance
   */
  static fromError(error: any): PrintnodeError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: PrintnodeErrorType; retryable: boolean }> = {
      '401': { type: PrintnodeErrorType.Authentication, retryable: false },
      '429': { type: PrintnodeErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new PrintnodeError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = PrintnodeErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = PrintnodeErrorType.Authentication
    } else if (statusCode === 403) {
      type = PrintnodeErrorType.Authorization
    } else if (statusCode === 404) {
      type = PrintnodeErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = PrintnodeErrorType.Validation
    } else if (statusCode === 429) {
      type = PrintnodeErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = PrintnodeErrorType.Server
      retryable = true
    }

    return new PrintnodeError(message, code, type, {
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
    return this.type === PrintnodeErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === PrintnodeErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === PrintnodeErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === PrintnodeErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === PrintnodeErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === PrintnodeErrorType.Server
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
