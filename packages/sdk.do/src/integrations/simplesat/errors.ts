/**
 * Simplesat Errors
 *
 * Auto-generated error handling for Simplesat Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/simplesat
 */

/**
 * Error type enum
 */
export enum SimplesatErrorType {
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
 * Simplesat Error class
 *
 * Custom error class for Simplesat Integration operations.
 */
export class SimplesatError extends Error {
  public readonly code: string | number
  public readonly type: SimplesatErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: SimplesatErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'SimplesatError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SimplesatError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns SimplesatError instance
   */
  static fromError(error: any): SimplesatError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: SimplesatErrorType; retryable: boolean }> = {
      '401': { type: SimplesatErrorType.Authentication, retryable: false },
      '429': { type: SimplesatErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new SimplesatError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = SimplesatErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = SimplesatErrorType.Authentication
    } else if (statusCode === 403) {
      type = SimplesatErrorType.Authorization
    } else if (statusCode === 404) {
      type = SimplesatErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = SimplesatErrorType.Validation
    } else if (statusCode === 429) {
      type = SimplesatErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = SimplesatErrorType.Server
      retryable = true
    }

    return new SimplesatError(message, code, type, {
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
    return this.type === SimplesatErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === SimplesatErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === SimplesatErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === SimplesatErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === SimplesatErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === SimplesatErrorType.Server
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
