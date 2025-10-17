/**
 * Apitemplate io Errors
 *
 * Auto-generated error handling for Apitemplate io Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/apitemplate_io
 */

/**
 * Error type enum
 */
export enum ApitemplateIoErrorType {
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
 * Apitemplate io Error class
 *
 * Custom error class for Apitemplate io Integration operations.
 */
export class ApitemplateIoError extends Error {
  public readonly code: string | number
  public readonly type: ApitemplateIoErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ApitemplateIoErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ApitemplateIoError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApitemplateIoError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ApitemplateIoError instance
   */
  static fromError(error: any): ApitemplateIoError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ApitemplateIoErrorType; retryable: boolean }> = {
      '401': { type: ApitemplateIoErrorType.Authentication, retryable: false },
      '429': { type: ApitemplateIoErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ApitemplateIoError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ApitemplateIoErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ApitemplateIoErrorType.Authentication
    } else if (statusCode === 403) {
      type = ApitemplateIoErrorType.Authorization
    } else if (statusCode === 404) {
      type = ApitemplateIoErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ApitemplateIoErrorType.Validation
    } else if (statusCode === 429) {
      type = ApitemplateIoErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ApitemplateIoErrorType.Server
      retryable = true
    }

    return new ApitemplateIoError(message, code, type, {
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
    return this.type === ApitemplateIoErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ApitemplateIoErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ApitemplateIoErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ApitemplateIoErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ApitemplateIoErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ApitemplateIoErrorType.Server
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
