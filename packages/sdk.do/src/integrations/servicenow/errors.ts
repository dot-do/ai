/**
 * Servicenow Errors
 *
 * Auto-generated error handling for Servicenow Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/servicenow
 */

/**
 * Error type enum
 */
export enum ServicenowErrorType {
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
 * Servicenow Error class
 *
 * Custom error class for Servicenow Integration operations.
 */
export class ServicenowError extends Error {
  public readonly code: string | number
  public readonly type: ServicenowErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ServicenowErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ServicenowError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ServicenowError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ServicenowError instance
   */
  static fromError(error: any): ServicenowError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ServicenowErrorType; retryable: boolean }> = {
      '401': { type: ServicenowErrorType.Authentication, retryable: false },
      '429': { type: ServicenowErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ServicenowError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ServicenowErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ServicenowErrorType.Authentication
    } else if (statusCode === 403) {
      type = ServicenowErrorType.Authorization
    } else if (statusCode === 404) {
      type = ServicenowErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ServicenowErrorType.Validation
    } else if (statusCode === 429) {
      type = ServicenowErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ServicenowErrorType.Server
      retryable = true
    }

    return new ServicenowError(message, code, type, {
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
    return this.type === ServicenowErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ServicenowErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ServicenowErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ServicenowErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ServicenowErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ServicenowErrorType.Server
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
