/**
 * Appcircle Errors
 *
 * Auto-generated error handling for Appcircle Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/appcircle
 */

/**
 * Error type enum
 */
export enum AppcircleErrorType {
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
 * Appcircle Error class
 *
 * Custom error class for Appcircle Integration operations.
 */
export class AppcircleError extends Error {
  public readonly code: string | number
  public readonly type: AppcircleErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: AppcircleErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'AppcircleError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppcircleError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns AppcircleError instance
   */
  static fromError(error: any): AppcircleError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: AppcircleErrorType; retryable: boolean }> = {
      '401': { type: AppcircleErrorType.Authentication, retryable: false },
      '429': { type: AppcircleErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new AppcircleError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = AppcircleErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = AppcircleErrorType.Authentication
    } else if (statusCode === 403) {
      type = AppcircleErrorType.Authorization
    } else if (statusCode === 404) {
      type = AppcircleErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = AppcircleErrorType.Validation
    } else if (statusCode === 429) {
      type = AppcircleErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = AppcircleErrorType.Server
      retryable = true
    }

    return new AppcircleError(message, code, type, {
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
    return this.type === AppcircleErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === AppcircleErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === AppcircleErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === AppcircleErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === AppcircleErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === AppcircleErrorType.Server
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
