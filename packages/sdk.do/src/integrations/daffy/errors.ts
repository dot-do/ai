/**
 * Daffy Errors
 *
 * Auto-generated error handling for Daffy Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/daffy
 */

/**
 * Error type enum
 */
export enum DaffyErrorType {
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
 * Daffy Error class
 *
 * Custom error class for Daffy Integration operations.
 */
export class DaffyError extends Error {
  public readonly code: string | number
  public readonly type: DaffyErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: DaffyErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'DaffyError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DaffyError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns DaffyError instance
   */
  static fromError(error: any): DaffyError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: DaffyErrorType; retryable: boolean }> = {
      '401': { type: DaffyErrorType.Authentication, retryable: false },
      '429': { type: DaffyErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new DaffyError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = DaffyErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = DaffyErrorType.Authentication
    } else if (statusCode === 403) {
      type = DaffyErrorType.Authorization
    } else if (statusCode === 404) {
      type = DaffyErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = DaffyErrorType.Validation
    } else if (statusCode === 429) {
      type = DaffyErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = DaffyErrorType.Server
      retryable = true
    }

    return new DaffyError(message, code, type, {
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
    return this.type === DaffyErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === DaffyErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === DaffyErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === DaffyErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === DaffyErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === DaffyErrorType.Server
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
