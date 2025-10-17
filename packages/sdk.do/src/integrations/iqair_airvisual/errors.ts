/**
 * Iqair airvisual Errors
 *
 * Auto-generated error handling for Iqair airvisual Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/iqair_airvisual
 */

/**
 * Error type enum
 */
export enum IqairAirvisualErrorType {
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
 * Iqair airvisual Error class
 *
 * Custom error class for Iqair airvisual Integration operations.
 */
export class IqairAirvisualError extends Error {
  public readonly code: string | number
  public readonly type: IqairAirvisualErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: IqairAirvisualErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'IqairAirvisualError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, IqairAirvisualError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns IqairAirvisualError instance
   */
  static fromError(error: any): IqairAirvisualError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: IqairAirvisualErrorType; retryable: boolean }> = {
      '401': { type: IqairAirvisualErrorType.Authentication, retryable: false },
      '429': { type: IqairAirvisualErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new IqairAirvisualError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = IqairAirvisualErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = IqairAirvisualErrorType.Authentication
    } else if (statusCode === 403) {
      type = IqairAirvisualErrorType.Authorization
    } else if (statusCode === 404) {
      type = IqairAirvisualErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = IqairAirvisualErrorType.Validation
    } else if (statusCode === 429) {
      type = IqairAirvisualErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = IqairAirvisualErrorType.Server
      retryable = true
    }

    return new IqairAirvisualError(message, code, type, {
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
    return this.type === IqairAirvisualErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === IqairAirvisualErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === IqairAirvisualErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === IqairAirvisualErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === IqairAirvisualErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === IqairAirvisualErrorType.Server
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
