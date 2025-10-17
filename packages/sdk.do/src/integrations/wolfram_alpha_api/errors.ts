/**
 * Wolfram alpha api Errors
 *
 * Auto-generated error handling for Wolfram alpha api Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/wolfram_alpha_api
 */

/**
 * Error type enum
 */
export enum WolframAlphaApiErrorType {
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
 * Wolfram alpha api Error class
 *
 * Custom error class for Wolfram alpha api Integration operations.
 */
export class WolframAlphaApiError extends Error {
  public readonly code: string | number
  public readonly type: WolframAlphaApiErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: WolframAlphaApiErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'WolframAlphaApiError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, WolframAlphaApiError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns WolframAlphaApiError instance
   */
  static fromError(error: any): WolframAlphaApiError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: WolframAlphaApiErrorType; retryable: boolean }> = {
      '401': { type: WolframAlphaApiErrorType.Authentication, retryable: false },
      '429': { type: WolframAlphaApiErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new WolframAlphaApiError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = WolframAlphaApiErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = WolframAlphaApiErrorType.Authentication
    } else if (statusCode === 403) {
      type = WolframAlphaApiErrorType.Authorization
    } else if (statusCode === 404) {
      type = WolframAlphaApiErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = WolframAlphaApiErrorType.Validation
    } else if (statusCode === 429) {
      type = WolframAlphaApiErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = WolframAlphaApiErrorType.Server
      retryable = true
    }

    return new WolframAlphaApiError(message, code, type, {
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
    return this.type === WolframAlphaApiErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === WolframAlphaApiErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === WolframAlphaApiErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === WolframAlphaApiErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === WolframAlphaApiErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === WolframAlphaApiErrorType.Server
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
