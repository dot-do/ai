/**
 * Route4me Errors
 *
 * Auto-generated error handling for Route4me Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/route4me
 */

/**
 * Error type enum
 */
export enum Route4meErrorType {
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
 * Route4me Error class
 *
 * Custom error class for Route4me Integration operations.
 */
export class Route4meError extends Error {
  public readonly code: string | number
  public readonly type: Route4meErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: Route4meErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'Route4meError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, Route4meError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns Route4meError instance
   */
  static fromError(error: any): Route4meError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: Route4meErrorType; retryable: boolean }> = {
      '401': { type: Route4meErrorType.Authentication, retryable: false },
      '429': { type: Route4meErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new Route4meError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = Route4meErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = Route4meErrorType.Authentication
    } else if (statusCode === 403) {
      type = Route4meErrorType.Authorization
    } else if (statusCode === 404) {
      type = Route4meErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = Route4meErrorType.Validation
    } else if (statusCode === 429) {
      type = Route4meErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = Route4meErrorType.Server
      retryable = true
    }

    return new Route4meError(message, code, type, {
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
    return this.type === Route4meErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === Route4meErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === Route4meErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === Route4meErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === Route4meErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === Route4meErrorType.Server
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
