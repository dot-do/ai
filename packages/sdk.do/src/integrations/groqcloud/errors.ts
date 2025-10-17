/**
 * Groqcloud Errors
 *
 * Auto-generated error handling for Groqcloud Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/groqcloud
 */

/**
 * Error type enum
 */
export enum GroqcloudErrorType {
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
 * Groqcloud Error class
 *
 * Custom error class for Groqcloud Integration operations.
 */
export class GroqcloudError extends Error {
  public readonly code: string | number
  public readonly type: GroqcloudErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: GroqcloudErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'GroqcloudError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GroqcloudError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns GroqcloudError instance
   */
  static fromError(error: any): GroqcloudError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: GroqcloudErrorType; retryable: boolean }> = {
      '401': { type: GroqcloudErrorType.Authentication, retryable: false },
      '429': { type: GroqcloudErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new GroqcloudError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = GroqcloudErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = GroqcloudErrorType.Authentication
    } else if (statusCode === 403) {
      type = GroqcloudErrorType.Authorization
    } else if (statusCode === 404) {
      type = GroqcloudErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = GroqcloudErrorType.Validation
    } else if (statusCode === 429) {
      type = GroqcloudErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = GroqcloudErrorType.Server
      retryable = true
    }

    return new GroqcloudError(message, code, type, {
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
    return this.type === GroqcloudErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === GroqcloudErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === GroqcloudErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === GroqcloudErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === GroqcloudErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === GroqcloudErrorType.Server
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
