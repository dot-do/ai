/**
 * Onesignal rest api Errors
 *
 * Auto-generated error handling for Onesignal rest api Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/onesignal_rest_api
 */

/**
 * Error type enum
 */
export enum OnesignalRestApiErrorType {
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
 * Onesignal rest api Error class
 *
 * Custom error class for Onesignal rest api Integration operations.
 */
export class OnesignalRestApiError extends Error {
  public readonly code: string | number
  public readonly type: OnesignalRestApiErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: OnesignalRestApiErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'OnesignalRestApiError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, OnesignalRestApiError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns OnesignalRestApiError instance
   */
  static fromError(error: any): OnesignalRestApiError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: OnesignalRestApiErrorType; retryable: boolean }> = {
      '401': { type: OnesignalRestApiErrorType.Authentication, retryable: false },
      '429': { type: OnesignalRestApiErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new OnesignalRestApiError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = OnesignalRestApiErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = OnesignalRestApiErrorType.Authentication
    } else if (statusCode === 403) {
      type = OnesignalRestApiErrorType.Authorization
    } else if (statusCode === 404) {
      type = OnesignalRestApiErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = OnesignalRestApiErrorType.Validation
    } else if (statusCode === 429) {
      type = OnesignalRestApiErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = OnesignalRestApiErrorType.Server
      retryable = true
    }

    return new OnesignalRestApiError(message, code, type, {
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
    return this.type === OnesignalRestApiErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === OnesignalRestApiErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === OnesignalRestApiErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === OnesignalRestApiErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === OnesignalRestApiErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === OnesignalRestApiErrorType.Server
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
