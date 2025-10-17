/**
 * Convertapi Errors
 *
 * Auto-generated error handling for Convertapi Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/convertapi
 */

/**
 * Error type enum
 */
export enum ConvertapiErrorType {
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
 * Convertapi Error class
 *
 * Custom error class for Convertapi Integration operations.
 */
export class ConvertapiError extends Error {
  public readonly code: string | number
  public readonly type: ConvertapiErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ConvertapiErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ConvertapiError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ConvertapiError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ConvertapiError instance
   */
  static fromError(error: any): ConvertapiError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ConvertapiErrorType; retryable: boolean }> = {
      '401': { type: ConvertapiErrorType.Authentication, retryable: false },
      '429': { type: ConvertapiErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ConvertapiError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ConvertapiErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ConvertapiErrorType.Authentication
    } else if (statusCode === 403) {
      type = ConvertapiErrorType.Authorization
    } else if (statusCode === 404) {
      type = ConvertapiErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ConvertapiErrorType.Validation
    } else if (statusCode === 429) {
      type = ConvertapiErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ConvertapiErrorType.Server
      retryable = true
    }

    return new ConvertapiError(message, code, type, {
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
    return this.type === ConvertapiErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ConvertapiErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ConvertapiErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ConvertapiErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ConvertapiErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ConvertapiErrorType.Server
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
