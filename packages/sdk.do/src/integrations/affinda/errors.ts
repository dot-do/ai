/**
 * Affinda Errors
 *
 * Auto-generated error handling for Affinda Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/affinda
 */

/**
 * Error type enum
 */
export enum AffindaErrorType {
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
 * Affinda Error class
 *
 * Custom error class for Affinda Integration operations.
 */
export class AffindaError extends Error {
  public readonly code: string | number
  public readonly type: AffindaErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: AffindaErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'AffindaError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AffindaError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns AffindaError instance
   */
  static fromError(error: any): AffindaError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: AffindaErrorType; retryable: boolean }> = {
      '401': { type: AffindaErrorType.Authentication, retryable: false },
      '429': { type: AffindaErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new AffindaError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = AffindaErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = AffindaErrorType.Authentication
    } else if (statusCode === 403) {
      type = AffindaErrorType.Authorization
    } else if (statusCode === 404) {
      type = AffindaErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = AffindaErrorType.Validation
    } else if (statusCode === 429) {
      type = AffindaErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = AffindaErrorType.Server
      retryable = true
    }

    return new AffindaError(message, code, type, {
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
    return this.type === AffindaErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === AffindaErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === AffindaErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === AffindaErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === AffindaErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === AffindaErrorType.Server
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
