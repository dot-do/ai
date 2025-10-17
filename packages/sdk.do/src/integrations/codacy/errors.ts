/**
 * Codacy Errors
 *
 * Auto-generated error handling for Codacy Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/codacy
 */

/**
 * Error type enum
 */
export enum CodacyErrorType {
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
 * Codacy Error class
 *
 * Custom error class for Codacy Integration operations.
 */
export class CodacyError extends Error {
  public readonly code: string | number
  public readonly type: CodacyErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: CodacyErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'CodacyError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CodacyError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns CodacyError instance
   */
  static fromError(error: any): CodacyError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: CodacyErrorType; retryable: boolean }> = {
      '401': { type: CodacyErrorType.Authentication, retryable: false },
      '429': { type: CodacyErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new CodacyError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = CodacyErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = CodacyErrorType.Authentication
    } else if (statusCode === 403) {
      type = CodacyErrorType.Authorization
    } else if (statusCode === 404) {
      type = CodacyErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = CodacyErrorType.Validation
    } else if (statusCode === 429) {
      type = CodacyErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = CodacyErrorType.Server
      retryable = true
    }

    return new CodacyError(message, code, type, {
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
    return this.type === CodacyErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === CodacyErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === CodacyErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === CodacyErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === CodacyErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === CodacyErrorType.Server
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
