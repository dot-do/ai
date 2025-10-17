/**
 * Imagior Errors
 *
 * Auto-generated error handling for Imagior Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/imagior
 */

/**
 * Error type enum
 */
export enum ImagiorErrorType {
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
 * Imagior Error class
 *
 * Custom error class for Imagior Integration operations.
 */
export class ImagiorError extends Error {
  public readonly code: string | number
  public readonly type: ImagiorErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ImagiorErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ImagiorError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ImagiorError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ImagiorError instance
   */
  static fromError(error: any): ImagiorError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ImagiorErrorType; retryable: boolean }> = {
      '401': { type: ImagiorErrorType.Authentication, retryable: false },
      '429': { type: ImagiorErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ImagiorError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ImagiorErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ImagiorErrorType.Authentication
    } else if (statusCode === 403) {
      type = ImagiorErrorType.Authorization
    } else if (statusCode === 404) {
      type = ImagiorErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ImagiorErrorType.Validation
    } else if (statusCode === 429) {
      type = ImagiorErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ImagiorErrorType.Server
      retryable = true
    }

    return new ImagiorError(message, code, type, {
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
    return this.type === ImagiorErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ImagiorErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ImagiorErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ImagiorErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ImagiorErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ImagiorErrorType.Server
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
