/**
 * Linkedin Errors
 *
 * Auto-generated error handling for Linkedin Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/linkedin
 */

/**
 * Error type enum
 */
export enum LinkedinErrorType {
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
 * Linkedin Error class
 *
 * Custom error class for Linkedin Integration operations.
 */
export class LinkedinError extends Error {
  public readonly code: string | number
  public readonly type: LinkedinErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: LinkedinErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'LinkedinError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, LinkedinError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns LinkedinError instance
   */
  static fromError(error: any): LinkedinError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: LinkedinErrorType; retryable: boolean }> = {
      '401': { type: LinkedinErrorType.Authentication, retryable: false },
      '429': { type: LinkedinErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new LinkedinError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = LinkedinErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = LinkedinErrorType.Authentication
    } else if (statusCode === 403) {
      type = LinkedinErrorType.Authorization
    } else if (statusCode === 404) {
      type = LinkedinErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = LinkedinErrorType.Validation
    } else if (statusCode === 429) {
      type = LinkedinErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = LinkedinErrorType.Server
      retryable = true
    }

    return new LinkedinError(message, code, type, {
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
    return this.type === LinkedinErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === LinkedinErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === LinkedinErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === LinkedinErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === LinkedinErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === LinkedinErrorType.Server
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
