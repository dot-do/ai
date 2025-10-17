/**
 * Pushbullet Errors
 *
 * Auto-generated error handling for Pushbullet Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/pushbullet
 */

/**
 * Error type enum
 */
export enum PushbulletErrorType {
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
 * Pushbullet Error class
 *
 * Custom error class for Pushbullet Integration operations.
 */
export class PushbulletError extends Error {
  public readonly code: string | number
  public readonly type: PushbulletErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: PushbulletErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'PushbulletError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PushbulletError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns PushbulletError instance
   */
  static fromError(error: any): PushbulletError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: PushbulletErrorType; retryable: boolean }> = {
      '401': { type: PushbulletErrorType.Authentication, retryable: false },
      '429': { type: PushbulletErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new PushbulletError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = PushbulletErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = PushbulletErrorType.Authentication
    } else if (statusCode === 403) {
      type = PushbulletErrorType.Authorization
    } else if (statusCode === 404) {
      type = PushbulletErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = PushbulletErrorType.Validation
    } else if (statusCode === 429) {
      type = PushbulletErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = PushbulletErrorType.Server
      retryable = true
    }

    return new PushbulletError(message, code, type, {
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
    return this.type === PushbulletErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === PushbulletErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === PushbulletErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === PushbulletErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === PushbulletErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === PushbulletErrorType.Server
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
