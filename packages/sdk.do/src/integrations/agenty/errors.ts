/**
 * Agenty Errors
 *
 * Auto-generated error handling for Agenty Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/agenty
 */

/**
 * Error type enum
 */
export enum AgentyErrorType {
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
 * Agenty Error class
 *
 * Custom error class for Agenty Integration operations.
 */
export class AgentyError extends Error {
  public readonly code: string | number
  public readonly type: AgentyErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: AgentyErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'AgentyError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AgentyError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns AgentyError instance
   */
  static fromError(error: any): AgentyError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: AgentyErrorType; retryable: boolean }> = {
      '401': { type: AgentyErrorType.Authentication, retryable: false },
      '429': { type: AgentyErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new AgentyError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = AgentyErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = AgentyErrorType.Authentication
    } else if (statusCode === 403) {
      type = AgentyErrorType.Authorization
    } else if (statusCode === 404) {
      type = AgentyErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = AgentyErrorType.Validation
    } else if (statusCode === 429) {
      type = AgentyErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = AgentyErrorType.Server
      retryable = true
    }

    return new AgentyError(message, code, type, {
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
    return this.type === AgentyErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === AgentyErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === AgentyErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === AgentyErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === AgentyErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === AgentyErrorType.Server
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
