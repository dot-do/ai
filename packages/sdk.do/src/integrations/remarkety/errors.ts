/**
 * Remarkety Errors
 *
 * Auto-generated error handling for Remarkety Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/remarkety
 */

/**
 * Error type enum
 */
export enum RemarketyErrorType {
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
 * Remarkety Error class
 *
 * Custom error class for Remarkety Integration operations.
 */
export class RemarketyError extends Error {
  public readonly code: string | number
  public readonly type: RemarketyErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: RemarketyErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'RemarketyError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RemarketyError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns RemarketyError instance
   */
  static fromError(error: any): RemarketyError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: RemarketyErrorType; retryable: boolean }> = {
      '401': { type: RemarketyErrorType.Authentication, retryable: false },
      '429': { type: RemarketyErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new RemarketyError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = RemarketyErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = RemarketyErrorType.Authentication
    } else if (statusCode === 403) {
      type = RemarketyErrorType.Authorization
    } else if (statusCode === 404) {
      type = RemarketyErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = RemarketyErrorType.Validation
    } else if (statusCode === 429) {
      type = RemarketyErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = RemarketyErrorType.Server
      retryable = true
    }

    return new RemarketyError(message, code, type, {
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
    return this.type === RemarketyErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === RemarketyErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === RemarketyErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === RemarketyErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === RemarketyErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === RemarketyErrorType.Server
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
