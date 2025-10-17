/**
 * Ko fi Errors
 *
 * Auto-generated error handling for Ko fi Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/ko_fi
 */

/**
 * Error type enum
 */
export enum KoFiErrorType {
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
 * Ko fi Error class
 *
 * Custom error class for Ko fi Integration operations.
 */
export class KoFiError extends Error {
  public readonly code: string | number
  public readonly type: KoFiErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: KoFiErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'KoFiError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, KoFiError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns KoFiError instance
   */
  static fromError(error: any): KoFiError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: KoFiErrorType; retryable: boolean }> = {
      '401': { type: KoFiErrorType.Authentication, retryable: false },
      '429': { type: KoFiErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new KoFiError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = KoFiErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = KoFiErrorType.Authentication
    } else if (statusCode === 403) {
      type = KoFiErrorType.Authorization
    } else if (statusCode === 404) {
      type = KoFiErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = KoFiErrorType.Validation
    } else if (statusCode === 429) {
      type = KoFiErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = KoFiErrorType.Server
      retryable = true
    }

    return new KoFiError(message, code, type, {
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
    return this.type === KoFiErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === KoFiErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === KoFiErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === KoFiErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === KoFiErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === KoFiErrorType.Server
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
