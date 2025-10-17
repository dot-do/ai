/**
 * Visme Errors
 *
 * Auto-generated error handling for Visme Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/visme
 */

/**
 * Error type enum
 */
export enum VismeErrorType {
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
 * Visme Error class
 *
 * Custom error class for Visme Integration operations.
 */
export class VismeError extends Error {
  public readonly code: string | number
  public readonly type: VismeErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: VismeErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'VismeError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, VismeError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns VismeError instance
   */
  static fromError(error: any): VismeError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: VismeErrorType; retryable: boolean }> = {
      '401': { type: VismeErrorType.Authentication, retryable: false },
      '429': { type: VismeErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new VismeError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = VismeErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = VismeErrorType.Authentication
    } else if (statusCode === 403) {
      type = VismeErrorType.Authorization
    } else if (statusCode === 404) {
      type = VismeErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = VismeErrorType.Validation
    } else if (statusCode === 429) {
      type = VismeErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = VismeErrorType.Server
      retryable = true
    }

    return new VismeError(message, code, type, {
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
    return this.type === VismeErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === VismeErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === VismeErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === VismeErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === VismeErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === VismeErrorType.Server
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
