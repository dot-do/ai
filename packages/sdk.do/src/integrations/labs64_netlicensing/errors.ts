/**
 * Labs64 netlicensing Errors
 *
 * Auto-generated error handling for Labs64 netlicensing Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/labs64_netlicensing
 */

/**
 * Error type enum
 */
export enum Labs64NetlicensingErrorType {
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
 * Labs64 netlicensing Error class
 *
 * Custom error class for Labs64 netlicensing Integration operations.
 */
export class Labs64NetlicensingError extends Error {
  public readonly code: string | number
  public readonly type: Labs64NetlicensingErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: Labs64NetlicensingErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'Labs64NetlicensingError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, Labs64NetlicensingError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns Labs64NetlicensingError instance
   */
  static fromError(error: any): Labs64NetlicensingError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: Labs64NetlicensingErrorType; retryable: boolean }> = {
      '401': { type: Labs64NetlicensingErrorType.Authentication, retryable: false },
      '429': { type: Labs64NetlicensingErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new Labs64NetlicensingError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = Labs64NetlicensingErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = Labs64NetlicensingErrorType.Authentication
    } else if (statusCode === 403) {
      type = Labs64NetlicensingErrorType.Authorization
    } else if (statusCode === 404) {
      type = Labs64NetlicensingErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = Labs64NetlicensingErrorType.Validation
    } else if (statusCode === 429) {
      type = Labs64NetlicensingErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = Labs64NetlicensingErrorType.Server
      retryable = true
    }

    return new Labs64NetlicensingError(message, code, type, {
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
    return this.type === Labs64NetlicensingErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === Labs64NetlicensingErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === Labs64NetlicensingErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === Labs64NetlicensingErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === Labs64NetlicensingErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === Labs64NetlicensingErrorType.Server
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
