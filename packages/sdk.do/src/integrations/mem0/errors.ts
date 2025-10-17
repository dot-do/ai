/**
 * Mem0 Errors
 *
 * Auto-generated error handling for Mem0 Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/mem0
 */

/**
 * Error type enum
 */
export enum Mem0ErrorType {
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
 * Mem0 Error class
 *
 * Custom error class for Mem0 Integration operations.
 */
export class Mem0Error extends Error {
  public readonly code: string | number
  public readonly type: Mem0ErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: Mem0ErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'Mem0Error'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, Mem0Error)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns Mem0Error instance
   */
  static fromError(error: any): Mem0Error {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: Mem0ErrorType; retryable: boolean }> = {
      '401': { type: Mem0ErrorType.Authentication, retryable: false },
      '429': { type: Mem0ErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new Mem0Error(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = Mem0ErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = Mem0ErrorType.Authentication
    } else if (statusCode === 403) {
      type = Mem0ErrorType.Authorization
    } else if (statusCode === 404) {
      type = Mem0ErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = Mem0ErrorType.Validation
    } else if (statusCode === 429) {
      type = Mem0ErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = Mem0ErrorType.Server
      retryable = true
    }

    return new Mem0Error(message, code, type, {
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
    return this.type === Mem0ErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === Mem0ErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === Mem0ErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === Mem0ErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === Mem0ErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === Mem0ErrorType.Server
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
