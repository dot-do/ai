/**
 * Venly Errors
 *
 * Auto-generated error handling for Venly Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/venly
 */

/**
 * Error type enum
 */
export enum VenlyErrorType {
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
 * Venly Error class
 *
 * Custom error class for Venly Integration operations.
 */
export class VenlyError extends Error {
  public readonly code: string | number
  public readonly type: VenlyErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: VenlyErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'VenlyError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, VenlyError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns VenlyError instance
   */
  static fromError(error: any): VenlyError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: VenlyErrorType; retryable: boolean }> = {
      '401': { type: VenlyErrorType.Authentication, retryable: false },
      '429': { type: VenlyErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new VenlyError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = VenlyErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = VenlyErrorType.Authentication
    } else if (statusCode === 403) {
      type = VenlyErrorType.Authorization
    } else if (statusCode === 404) {
      type = VenlyErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = VenlyErrorType.Validation
    } else if (statusCode === 429) {
      type = VenlyErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = VenlyErrorType.Server
      retryable = true
    }

    return new VenlyError(message, code, type, {
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
    return this.type === VenlyErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === VenlyErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === VenlyErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === VenlyErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === VenlyErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === VenlyErrorType.Server
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
