/**
 * Memberstack Errors
 *
 * Auto-generated error handling for Memberstack Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/memberstack
 */

/**
 * Error type enum
 */
export enum MemberstackErrorType {
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
 * Memberstack Error class
 *
 * Custom error class for Memberstack Integration operations.
 */
export class MemberstackError extends Error {
  public readonly code: string | number
  public readonly type: MemberstackErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: MemberstackErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'MemberstackError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MemberstackError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns MemberstackError instance
   */
  static fromError(error: any): MemberstackError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: MemberstackErrorType; retryable: boolean }> = {
      '401': { type: MemberstackErrorType.Authentication, retryable: false },
      '429': { type: MemberstackErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new MemberstackError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = MemberstackErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = MemberstackErrorType.Authentication
    } else if (statusCode === 403) {
      type = MemberstackErrorType.Authorization
    } else if (statusCode === 404) {
      type = MemberstackErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = MemberstackErrorType.Validation
    } else if (statusCode === 429) {
      type = MemberstackErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = MemberstackErrorType.Server
      retryable = true
    }

    return new MemberstackError(message, code, type, {
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
    return this.type === MemberstackErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === MemberstackErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === MemberstackErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === MemberstackErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === MemberstackErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === MemberstackErrorType.Server
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
