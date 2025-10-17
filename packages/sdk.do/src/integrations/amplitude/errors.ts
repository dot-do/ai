/**
 * Amplitude Errors
 *
 * Auto-generated error handling for Amplitude Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/amplitude
 */

/**
 * Error type enum
 */
export enum AmplitudeErrorType {
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
 * Amplitude Error class
 *
 * Custom error class for Amplitude Integration operations.
 */
export class AmplitudeError extends Error {
  public readonly code: string | number
  public readonly type: AmplitudeErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: AmplitudeErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'AmplitudeError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AmplitudeError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns AmplitudeError instance
   */
  static fromError(error: any): AmplitudeError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: AmplitudeErrorType; retryable: boolean }> = {
      '401': { type: AmplitudeErrorType.Authentication, retryable: false },
      '429': { type: AmplitudeErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new AmplitudeError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = AmplitudeErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = AmplitudeErrorType.Authentication
    } else if (statusCode === 403) {
      type = AmplitudeErrorType.Authorization
    } else if (statusCode === 404) {
      type = AmplitudeErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = AmplitudeErrorType.Validation
    } else if (statusCode === 429) {
      type = AmplitudeErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = AmplitudeErrorType.Server
      retryable = true
    }

    return new AmplitudeError(message, code, type, {
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
    return this.type === AmplitudeErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === AmplitudeErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === AmplitudeErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === AmplitudeErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === AmplitudeErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === AmplitudeErrorType.Server
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
