/**
 * Seqera Errors
 *
 * Auto-generated error handling for Seqera Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/seqera
 */

/**
 * Error type enum
 */
export enum SeqeraErrorType {
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
 * Seqera Error class
 *
 * Custom error class for Seqera Integration operations.
 */
export class SeqeraError extends Error {
  public readonly code: string | number
  public readonly type: SeqeraErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: SeqeraErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'SeqeraError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SeqeraError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns SeqeraError instance
   */
  static fromError(error: any): SeqeraError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: SeqeraErrorType; retryable: boolean }> = {
      '401': { type: SeqeraErrorType.Authentication, retryable: false },
      '429': { type: SeqeraErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new SeqeraError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = SeqeraErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = SeqeraErrorType.Authentication
    } else if (statusCode === 403) {
      type = SeqeraErrorType.Authorization
    } else if (statusCode === 404) {
      type = SeqeraErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = SeqeraErrorType.Validation
    } else if (statusCode === 429) {
      type = SeqeraErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = SeqeraErrorType.Server
      retryable = true
    }

    return new SeqeraError(message, code, type, {
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
    return this.type === SeqeraErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === SeqeraErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === SeqeraErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === SeqeraErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === SeqeraErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === SeqeraErrorType.Server
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
