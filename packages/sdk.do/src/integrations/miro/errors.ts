/**
 * Miro Errors
 *
 * Auto-generated error handling for Miro Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/miro
 */

/**
 * Error type enum
 */
export enum MiroErrorType {
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
 * Miro Error class
 *
 * Custom error class for Miro Integration operations.
 */
export class MiroError extends Error {
  public readonly code: string | number
  public readonly type: MiroErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: MiroErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'MiroError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MiroError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns MiroError instance
   */
  static fromError(error: any): MiroError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: MiroErrorType; retryable: boolean }> = {
      '401': { type: MiroErrorType.Authentication, retryable: false },
      '429': { type: MiroErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new MiroError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = MiroErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = MiroErrorType.Authentication
    } else if (statusCode === 403) {
      type = MiroErrorType.Authorization
    } else if (statusCode === 404) {
      type = MiroErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = MiroErrorType.Validation
    } else if (statusCode === 429) {
      type = MiroErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = MiroErrorType.Server
      retryable = true
    }

    return new MiroError(message, code, type, {
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
    return this.type === MiroErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === MiroErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === MiroErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === MiroErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === MiroErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === MiroErrorType.Server
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
