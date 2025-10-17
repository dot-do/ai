/**
 * Supadata Errors
 *
 * Auto-generated error handling for Supadata Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/supadata
 */

/**
 * Error type enum
 */
export enum SupadataErrorType {
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
 * Supadata Error class
 *
 * Custom error class for Supadata Integration operations.
 */
export class SupadataError extends Error {
  public readonly code: string | number
  public readonly type: SupadataErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: SupadataErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'SupadataError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SupadataError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns SupadataError instance
   */
  static fromError(error: any): SupadataError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: SupadataErrorType; retryable: boolean }> = {
      '401': { type: SupadataErrorType.Authentication, retryable: false },
      '429': { type: SupadataErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new SupadataError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = SupadataErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = SupadataErrorType.Authentication
    } else if (statusCode === 403) {
      type = SupadataErrorType.Authorization
    } else if (statusCode === 404) {
      type = SupadataErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = SupadataErrorType.Validation
    } else if (statusCode === 429) {
      type = SupadataErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = SupadataErrorType.Server
      retryable = true
    }

    return new SupadataError(message, code, type, {
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
    return this.type === SupadataErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === SupadataErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === SupadataErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === SupadataErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === SupadataErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === SupadataErrorType.Server
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
