/**
 * Constant Contact Errors
 *
 * Auto-generated error handling for Constant Contact Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/constantcontact
 */

/**
 * Error type enum
 */
export enum ConstantcontactErrorType {
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
 * Constant Contact Error class
 *
 * Custom error class for Constant Contact Integration operations.
 */
export class ConstantcontactError extends Error {
  public readonly code: string | number
  public readonly type: ConstantcontactErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ConstantcontactErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ConstantcontactError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ConstantcontactError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ConstantcontactError instance
   */
  static fromError(error: any): ConstantcontactError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ConstantcontactErrorType; retryable: boolean }> = {
      '401': { type: ConstantcontactErrorType.Authentication, retryable: false },
      '429': { type: ConstantcontactErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ConstantcontactError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ConstantcontactErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ConstantcontactErrorType.Authentication
    } else if (statusCode === 403) {
      type = ConstantcontactErrorType.Authorization
    } else if (statusCode === 404) {
      type = ConstantcontactErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ConstantcontactErrorType.Validation
    } else if (statusCode === 429) {
      type = ConstantcontactErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ConstantcontactErrorType.Server
      retryable = true
    }

    return new ConstantcontactError(message, code, type, {
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
    return this.type === ConstantcontactErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ConstantcontactErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ConstantcontactErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ConstantcontactErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ConstantcontactErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ConstantcontactErrorType.Server
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
