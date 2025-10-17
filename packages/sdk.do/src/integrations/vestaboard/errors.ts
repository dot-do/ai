/**
 * Vestaboard Errors
 *
 * Auto-generated error handling for Vestaboard Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/vestaboard
 */

/**
 * Error type enum
 */
export enum VestaboardErrorType {
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
 * Vestaboard Error class
 *
 * Custom error class for Vestaboard Integration operations.
 */
export class VestaboardError extends Error {
  public readonly code: string | number
  public readonly type: VestaboardErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: VestaboardErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'VestaboardError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, VestaboardError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns VestaboardError instance
   */
  static fromError(error: any): VestaboardError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: VestaboardErrorType; retryable: boolean }> = {
      '401': { type: VestaboardErrorType.Authentication, retryable: false },
      '429': { type: VestaboardErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new VestaboardError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = VestaboardErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = VestaboardErrorType.Authentication
    } else if (statusCode === 403) {
      type = VestaboardErrorType.Authorization
    } else if (statusCode === 404) {
      type = VestaboardErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = VestaboardErrorType.Validation
    } else if (statusCode === 429) {
      type = VestaboardErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = VestaboardErrorType.Server
      retryable = true
    }

    return new VestaboardError(message, code, type, {
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
    return this.type === VestaboardErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === VestaboardErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === VestaboardErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === VestaboardErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === VestaboardErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === VestaboardErrorType.Server
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
