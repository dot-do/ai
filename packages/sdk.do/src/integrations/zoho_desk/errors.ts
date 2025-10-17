/**
 * Zoho desk Errors
 *
 * Auto-generated error handling for Zoho desk Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/zoho_desk
 */

/**
 * Error type enum
 */
export enum ZohoDeskErrorType {
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
 * Zoho desk Error class
 *
 * Custom error class for Zoho desk Integration operations.
 */
export class ZohoDeskError extends Error {
  public readonly code: string | number
  public readonly type: ZohoDeskErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ZohoDeskErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ZohoDeskError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ZohoDeskError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ZohoDeskError instance
   */
  static fromError(error: any): ZohoDeskError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ZohoDeskErrorType; retryable: boolean }> = {
      '401': { type: ZohoDeskErrorType.Authentication, retryable: false },
      '429': { type: ZohoDeskErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ZohoDeskError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ZohoDeskErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ZohoDeskErrorType.Authentication
    } else if (statusCode === 403) {
      type = ZohoDeskErrorType.Authorization
    } else if (statusCode === 404) {
      type = ZohoDeskErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ZohoDeskErrorType.Validation
    } else if (statusCode === 429) {
      type = ZohoDeskErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ZohoDeskErrorType.Server
      retryable = true
    }

    return new ZohoDeskError(message, code, type, {
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
    return this.type === ZohoDeskErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ZohoDeskErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ZohoDeskErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ZohoDeskErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ZohoDeskErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ZohoDeskErrorType.Server
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
