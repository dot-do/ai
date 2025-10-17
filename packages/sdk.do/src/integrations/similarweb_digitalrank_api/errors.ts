/**
 * Similarweb digitalrank api Errors
 *
 * Auto-generated error handling for Similarweb digitalrank api Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/similarweb_digitalrank_api
 */

/**
 * Error type enum
 */
export enum SimilarwebDigitalrankApiErrorType {
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
 * Similarweb digitalrank api Error class
 *
 * Custom error class for Similarweb digitalrank api Integration operations.
 */
export class SimilarwebDigitalrankApiError extends Error {
  public readonly code: string | number
  public readonly type: SimilarwebDigitalrankApiErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: SimilarwebDigitalrankApiErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'SimilarwebDigitalrankApiError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SimilarwebDigitalrankApiError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns SimilarwebDigitalrankApiError instance
   */
  static fromError(error: any): SimilarwebDigitalrankApiError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: SimilarwebDigitalrankApiErrorType; retryable: boolean }> = {
      '401': { type: SimilarwebDigitalrankApiErrorType.Authentication, retryable: false },
      '429': { type: SimilarwebDigitalrankApiErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new SimilarwebDigitalrankApiError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = SimilarwebDigitalrankApiErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = SimilarwebDigitalrankApiErrorType.Authentication
    } else if (statusCode === 403) {
      type = SimilarwebDigitalrankApiErrorType.Authorization
    } else if (statusCode === 404) {
      type = SimilarwebDigitalrankApiErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = SimilarwebDigitalrankApiErrorType.Validation
    } else if (statusCode === 429) {
      type = SimilarwebDigitalrankApiErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = SimilarwebDigitalrankApiErrorType.Server
      retryable = true
    }

    return new SimilarwebDigitalrankApiError(message, code, type, {
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
    return this.type === SimilarwebDigitalrankApiErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === SimilarwebDigitalrankApiErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === SimilarwebDigitalrankApiErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === SimilarwebDigitalrankApiErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === SimilarwebDigitalrankApiErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === SimilarwebDigitalrankApiErrorType.Server
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
