/**
 * Fillout forms Errors
 *
 * Auto-generated error handling for Fillout forms Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/fillout_forms
 */

/**
 * Error type enum
 */
export enum FilloutFormsErrorType {
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
 * Fillout forms Error class
 *
 * Custom error class for Fillout forms Integration operations.
 */
export class FilloutFormsError extends Error {
  public readonly code: string | number
  public readonly type: FilloutFormsErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: FilloutFormsErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'FilloutFormsError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FilloutFormsError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns FilloutFormsError instance
   */
  static fromError(error: any): FilloutFormsError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: FilloutFormsErrorType; retryable: boolean }> = {
      '401': { type: FilloutFormsErrorType.Authentication, retryable: false },
      '429': { type: FilloutFormsErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new FilloutFormsError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = FilloutFormsErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = FilloutFormsErrorType.Authentication
    } else if (statusCode === 403) {
      type = FilloutFormsErrorType.Authorization
    } else if (statusCode === 404) {
      type = FilloutFormsErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = FilloutFormsErrorType.Validation
    } else if (statusCode === 429) {
      type = FilloutFormsErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = FilloutFormsErrorType.Server
      retryable = true
    }

    return new FilloutFormsError(message, code, type, {
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
    return this.type === FilloutFormsErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === FilloutFormsErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === FilloutFormsErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === FilloutFormsErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === FilloutFormsErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === FilloutFormsErrorType.Server
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
