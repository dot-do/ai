/**
 * Gorgias Errors
 *
 * Auto-generated error handling for Gorgias Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/gorgias
 */

/**
 * Error type enum
 */
export enum GorgiasErrorType {
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
 * Gorgias Error class
 *
 * Custom error class for Gorgias Integration operations.
 */
export class GorgiasError extends Error {
  public readonly code: string | number
  public readonly type: GorgiasErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: GorgiasErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'GorgiasError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GorgiasError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns GorgiasError instance
   */
  static fromError(error: any): GorgiasError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: GorgiasErrorType; retryable: boolean }> = {
      '401': { type: GorgiasErrorType.Authentication, retryable: false },
      '429': { type: GorgiasErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new GorgiasError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = GorgiasErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = GorgiasErrorType.Authentication
    } else if (statusCode === 403) {
      type = GorgiasErrorType.Authorization
    } else if (statusCode === 404) {
      type = GorgiasErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = GorgiasErrorType.Validation
    } else if (statusCode === 429) {
      type = GorgiasErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = GorgiasErrorType.Server
      retryable = true
    }

    return new GorgiasError(message, code, type, {
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
    return this.type === GorgiasErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === GorgiasErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === GorgiasErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === GorgiasErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === GorgiasErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === GorgiasErrorType.Server
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
