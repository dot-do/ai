/**
 * Npm Errors
 *
 * Auto-generated error handling for Npm Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/npm
 */

/**
 * Error type enum
 */
export enum NpmErrorType {
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
 * Npm Error class
 *
 * Custom error class for Npm Integration operations.
 */
export class NpmError extends Error {
  public readonly code: string | number
  public readonly type: NpmErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: NpmErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'NpmError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NpmError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns NpmError instance
   */
  static fromError(error: any): NpmError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: NpmErrorType; retryable: boolean }> = {
      '401': { type: NpmErrorType.Authentication, retryable: false },
      '429': { type: NpmErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new NpmError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = NpmErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = NpmErrorType.Authentication
    } else if (statusCode === 403) {
      type = NpmErrorType.Authorization
    } else if (statusCode === 404) {
      type = NpmErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = NpmErrorType.Validation
    } else if (statusCode === 429) {
      type = NpmErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = NpmErrorType.Server
      retryable = true
    }

    return new NpmError(message, code, type, {
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
    return this.type === NpmErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === NpmErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === NpmErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === NpmErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === NpmErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === NpmErrorType.Server
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
