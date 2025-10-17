/**
 * Wiz Errors
 *
 * Auto-generated error handling for Wiz Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/wiz
 */

/**
 * Error type enum
 */
export enum WizErrorType {
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
 * Wiz Error class
 *
 * Custom error class for Wiz Integration operations.
 */
export class WizError extends Error {
  public readonly code: string | number
  public readonly type: WizErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: WizErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'WizError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, WizError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns WizError instance
   */
  static fromError(error: any): WizError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: WizErrorType; retryable: boolean }> = {
      '401': { type: WizErrorType.Authentication, retryable: false },
      '429': { type: WizErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new WizError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = WizErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = WizErrorType.Authentication
    } else if (statusCode === 403) {
      type = WizErrorType.Authorization
    } else if (statusCode === 404) {
      type = WizErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = WizErrorType.Validation
    } else if (statusCode === 429) {
      type = WizErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = WizErrorType.Server
      retryable = true
    }

    return new WizError(message, code, type, {
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
    return this.type === WizErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === WizErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === WizErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === WizErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === WizErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === WizErrorType.Server
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
