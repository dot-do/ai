/**
 * Circleci Errors
 *
 * Auto-generated error handling for Circleci Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/circleci
 */

/**
 * Error type enum
 */
export enum CircleciErrorType {
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
 * Circleci Error class
 *
 * Custom error class for Circleci Integration operations.
 */
export class CircleciError extends Error {
  public readonly code: string | number
  public readonly type: CircleciErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: CircleciErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'CircleciError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CircleciError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns CircleciError instance
   */
  static fromError(error: any): CircleciError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: CircleciErrorType; retryable: boolean }> = {
      '401': { type: CircleciErrorType.Authentication, retryable: false },
      '429': { type: CircleciErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new CircleciError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = CircleciErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = CircleciErrorType.Authentication
    } else if (statusCode === 403) {
      type = CircleciErrorType.Authorization
    } else if (statusCode === 404) {
      type = CircleciErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = CircleciErrorType.Validation
    } else if (statusCode === 429) {
      type = CircleciErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = CircleciErrorType.Server
      retryable = true
    }

    return new CircleciError(message, code, type, {
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
    return this.type === CircleciErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === CircleciErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === CircleciErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === CircleciErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === CircleciErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === CircleciErrorType.Server
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
