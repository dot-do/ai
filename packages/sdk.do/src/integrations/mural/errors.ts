/**
 * Mural Errors
 *
 * Auto-generated error handling for Mural Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/mural
 */

/**
 * Error type enum
 */
export enum MuralErrorType {
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
 * Mural Error class
 *
 * Custom error class for Mural Integration operations.
 */
export class MuralError extends Error {
  public readonly code: string | number
  public readonly type: MuralErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: MuralErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'MuralError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MuralError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns MuralError instance
   */
  static fromError(error: any): MuralError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: MuralErrorType; retryable: boolean }> = {
      '401': { type: MuralErrorType.Authentication, retryable: false },
      '429': { type: MuralErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new MuralError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = MuralErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = MuralErrorType.Authentication
    } else if (statusCode === 403) {
      type = MuralErrorType.Authorization
    } else if (statusCode === 404) {
      type = MuralErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = MuralErrorType.Validation
    } else if (statusCode === 429) {
      type = MuralErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = MuralErrorType.Server
      retryable = true
    }

    return new MuralError(message, code, type, {
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
    return this.type === MuralErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === MuralErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === MuralErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === MuralErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === MuralErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === MuralErrorType.Server
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
