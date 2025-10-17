/**
 * Asana Errors
 *
 * Auto-generated error handling for Asana Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/asana
 */

/**
 * Error type enum
 */
export enum AsanaErrorType {
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
 * Asana Error class
 *
 * Custom error class for Asana Integration operations.
 */
export class AsanaError extends Error {
  public readonly code: string | number
  public readonly type: AsanaErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: AsanaErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'AsanaError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AsanaError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns AsanaError instance
   */
  static fromError(error: any): AsanaError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: AsanaErrorType; retryable: boolean }> = {
      '401': { type: AsanaErrorType.Authentication, retryable: false },
      '429': { type: AsanaErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new AsanaError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = AsanaErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = AsanaErrorType.Authentication
    } else if (statusCode === 403) {
      type = AsanaErrorType.Authorization
    } else if (statusCode === 404) {
      type = AsanaErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = AsanaErrorType.Validation
    } else if (statusCode === 429) {
      type = AsanaErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = AsanaErrorType.Server
      retryable = true
    }

    return new AsanaError(message, code, type, {
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
    return this.type === AsanaErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === AsanaErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === AsanaErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === AsanaErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === AsanaErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === AsanaErrorType.Server
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
