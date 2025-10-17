/**
 * Pexels Errors
 *
 * Auto-generated error handling for Pexels Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/pexels
 */

/**
 * Error type enum
 */
export enum PexelsErrorType {
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
 * Pexels Error class
 *
 * Custom error class for Pexels Integration operations.
 */
export class PexelsError extends Error {
  public readonly code: string | number
  public readonly type: PexelsErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: PexelsErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'PexelsError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PexelsError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns PexelsError instance
   */
  static fromError(error: any): PexelsError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: PexelsErrorType; retryable: boolean }> = {
      '401': { type: PexelsErrorType.Authentication, retryable: false },
      '429': { type: PexelsErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new PexelsError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = PexelsErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = PexelsErrorType.Authentication
    } else if (statusCode === 403) {
      type = PexelsErrorType.Authorization
    } else if (statusCode === 404) {
      type = PexelsErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = PexelsErrorType.Validation
    } else if (statusCode === 429) {
      type = PexelsErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = PexelsErrorType.Server
      retryable = true
    }

    return new PexelsError(message, code, type, {
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
    return this.type === PexelsErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === PexelsErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === PexelsErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === PexelsErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === PexelsErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === PexelsErrorType.Server
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
