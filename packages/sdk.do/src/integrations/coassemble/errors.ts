/**
 * Coassemble Errors
 *
 * Auto-generated error handling for Coassemble Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/coassemble
 */

/**
 * Error type enum
 */
export enum CoassembleErrorType {
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
 * Coassemble Error class
 *
 * Custom error class for Coassemble Integration operations.
 */
export class CoassembleError extends Error {
  public readonly code: string | number
  public readonly type: CoassembleErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: CoassembleErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'CoassembleError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CoassembleError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns CoassembleError instance
   */
  static fromError(error: any): CoassembleError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: CoassembleErrorType; retryable: boolean }> = {
      '401': { type: CoassembleErrorType.Authentication, retryable: false },
      '429': { type: CoassembleErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new CoassembleError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = CoassembleErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = CoassembleErrorType.Authentication
    } else if (statusCode === 403) {
      type = CoassembleErrorType.Authorization
    } else if (statusCode === 404) {
      type = CoassembleErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = CoassembleErrorType.Validation
    } else if (statusCode === 429) {
      type = CoassembleErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = CoassembleErrorType.Server
      retryable = true
    }

    return new CoassembleError(message, code, type, {
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
    return this.type === CoassembleErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === CoassembleErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === CoassembleErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === CoassembleErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === CoassembleErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === CoassembleErrorType.Server
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
