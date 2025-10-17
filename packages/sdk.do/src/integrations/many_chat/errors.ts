/**
 * Many chat Errors
 *
 * Auto-generated error handling for Many chat Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/many_chat
 */

/**
 * Error type enum
 */
export enum ManyChatErrorType {
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
 * Many chat Error class
 *
 * Custom error class for Many chat Integration operations.
 */
export class ManyChatError extends Error {
  public readonly code: string | number
  public readonly type: ManyChatErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ManyChatErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ManyChatError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ManyChatError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ManyChatError instance
   */
  static fromError(error: any): ManyChatError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ManyChatErrorType; retryable: boolean }> = {
      '401': { type: ManyChatErrorType.Authentication, retryable: false },
      '429': { type: ManyChatErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ManyChatError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ManyChatErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ManyChatErrorType.Authentication
    } else if (statusCode === 403) {
      type = ManyChatErrorType.Authorization
    } else if (statusCode === 404) {
      type = ManyChatErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ManyChatErrorType.Validation
    } else if (statusCode === 429) {
      type = ManyChatErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ManyChatErrorType.Server
      retryable = true
    }

    return new ManyChatError(message, code, type, {
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
    return this.type === ManyChatErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ManyChatErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ManyChatErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ManyChatErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ManyChatErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ManyChatErrorType.Server
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
