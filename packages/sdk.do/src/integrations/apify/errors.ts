/**
 * Apify Errors
 *
 * Auto-generated error handling for Apify Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/apify
 */

/**
 * Error type enum
 */
export enum ApifyErrorType {
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
 * Apify Error class
 *
 * Custom error class for Apify Integration operations.
 */
export class ApifyError extends Error {
  public readonly code: string | number
  public readonly type: ApifyErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ApifyErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ApifyError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApifyError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ApifyError instance
   */
  static fromError(error: any): ApifyError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ApifyErrorType; retryable: boolean }> = {
      '401': { type: ApifyErrorType.Authentication, retryable: false },
      '429': { type: ApifyErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ApifyError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ApifyErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ApifyErrorType.Authentication
    } else if (statusCode === 403) {
      type = ApifyErrorType.Authorization
    } else if (statusCode === 404) {
      type = ApifyErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ApifyErrorType.Validation
    } else if (statusCode === 429) {
      type = ApifyErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ApifyErrorType.Server
      retryable = true
    }

    return new ApifyError(message, code, type, {
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
    return this.type === ApifyErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ApifyErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ApifyErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ApifyErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ApifyErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ApifyErrorType.Server
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
