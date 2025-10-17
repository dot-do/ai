/**
 * Draftable Errors
 *
 * Auto-generated error handling for Draftable Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/draftable
 */

/**
 * Error type enum
 */
export enum DraftableErrorType {
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
 * Draftable Error class
 *
 * Custom error class for Draftable Integration operations.
 */
export class DraftableError extends Error {
  public readonly code: string | number
  public readonly type: DraftableErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: DraftableErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'DraftableError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DraftableError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns DraftableError instance
   */
  static fromError(error: any): DraftableError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: DraftableErrorType; retryable: boolean }> = {
      '401': { type: DraftableErrorType.Authentication, retryable: false },
      '429': { type: DraftableErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new DraftableError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = DraftableErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = DraftableErrorType.Authentication
    } else if (statusCode === 403) {
      type = DraftableErrorType.Authorization
    } else if (statusCode === 404) {
      type = DraftableErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = DraftableErrorType.Validation
    } else if (statusCode === 429) {
      type = DraftableErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = DraftableErrorType.Server
      retryable = true
    }

    return new DraftableError(message, code, type, {
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
    return this.type === DraftableErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === DraftableErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === DraftableErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === DraftableErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === DraftableErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === DraftableErrorType.Server
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
