/**
 * Lodgify Errors
 *
 * Auto-generated error handling for Lodgify Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/lodgify
 */

/**
 * Error type enum
 */
export enum LodgifyErrorType {
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
 * Lodgify Error class
 *
 * Custom error class for Lodgify Integration operations.
 */
export class LodgifyError extends Error {
  public readonly code: string | number
  public readonly type: LodgifyErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: LodgifyErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'LodgifyError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, LodgifyError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns LodgifyError instance
   */
  static fromError(error: any): LodgifyError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: LodgifyErrorType; retryable: boolean }> = {
      '401': { type: LodgifyErrorType.Authentication, retryable: false },
      '429': { type: LodgifyErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new LodgifyError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = LodgifyErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = LodgifyErrorType.Authentication
    } else if (statusCode === 403) {
      type = LodgifyErrorType.Authorization
    } else if (statusCode === 404) {
      type = LodgifyErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = LodgifyErrorType.Validation
    } else if (statusCode === 429) {
      type = LodgifyErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = LodgifyErrorType.Server
      retryable = true
    }

    return new LodgifyError(message, code, type, {
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
    return this.type === LodgifyErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === LodgifyErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === LodgifyErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === LodgifyErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === LodgifyErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === LodgifyErrorType.Server
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
