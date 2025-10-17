/**
 * Ahrefs Errors
 *
 * Auto-generated error handling for Ahrefs Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/ahrefs
 */

/**
 * Error type enum
 */
export enum AhrefsErrorType {
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
 * Ahrefs Error class
 *
 * Custom error class for Ahrefs Integration operations.
 */
export class AhrefsError extends Error {
  public readonly code: string | number
  public readonly type: AhrefsErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: AhrefsErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'AhrefsError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AhrefsError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns AhrefsError instance
   */
  static fromError(error: any): AhrefsError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: AhrefsErrorType; retryable: boolean }> = {
      '401': { type: AhrefsErrorType.Authentication, retryable: false },
      '429': { type: AhrefsErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new AhrefsError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = AhrefsErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = AhrefsErrorType.Authentication
    } else if (statusCode === 403) {
      type = AhrefsErrorType.Authorization
    } else if (statusCode === 404) {
      type = AhrefsErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = AhrefsErrorType.Validation
    } else if (statusCode === 429) {
      type = AhrefsErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = AhrefsErrorType.Server
      retryable = true
    }

    return new AhrefsError(message, code, type, {
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
    return this.type === AhrefsErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === AhrefsErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === AhrefsErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === AhrefsErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === AhrefsErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === AhrefsErrorType.Server
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
