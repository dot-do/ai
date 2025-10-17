/**
 * Nocrm io Errors
 *
 * Auto-generated error handling for Nocrm io Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/nocrm_io
 */

/**
 * Error type enum
 */
export enum NocrmIoErrorType {
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
 * Nocrm io Error class
 *
 * Custom error class for Nocrm io Integration operations.
 */
export class NocrmIoError extends Error {
  public readonly code: string | number
  public readonly type: NocrmIoErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: NocrmIoErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'NocrmIoError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NocrmIoError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns NocrmIoError instance
   */
  static fromError(error: any): NocrmIoError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: NocrmIoErrorType; retryable: boolean }> = {
      '401': { type: NocrmIoErrorType.Authentication, retryable: false },
      '429': { type: NocrmIoErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new NocrmIoError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = NocrmIoErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = NocrmIoErrorType.Authentication
    } else if (statusCode === 403) {
      type = NocrmIoErrorType.Authorization
    } else if (statusCode === 404) {
      type = NocrmIoErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = NocrmIoErrorType.Validation
    } else if (statusCode === 429) {
      type = NocrmIoErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = NocrmIoErrorType.Server
      retryable = true
    }

    return new NocrmIoError(message, code, type, {
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
    return this.type === NocrmIoErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === NocrmIoErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === NocrmIoErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === NocrmIoErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === NocrmIoErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === NocrmIoErrorType.Server
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
