/**
 * Outlook Errors
 *
 * Auto-generated error handling for Outlook Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/outlook
 */

/**
 * Error type enum
 */
export enum OutlookErrorType {
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
 * Outlook Error class
 *
 * Custom error class for Outlook Integration operations.
 */
export class OutlookError extends Error {
  public readonly code: string | number
  public readonly type: OutlookErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: OutlookErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'OutlookError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, OutlookError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns OutlookError instance
   */
  static fromError(error: any): OutlookError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: OutlookErrorType; retryable: boolean }> = {
      '401': { type: OutlookErrorType.Authentication, retryable: false },
      '429': { type: OutlookErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new OutlookError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = OutlookErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = OutlookErrorType.Authentication
    } else if (statusCode === 403) {
      type = OutlookErrorType.Authorization
    } else if (statusCode === 404) {
      type = OutlookErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = OutlookErrorType.Validation
    } else if (statusCode === 429) {
      type = OutlookErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = OutlookErrorType.Server
      retryable = true
    }

    return new OutlookError(message, code, type, {
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
    return this.type === OutlookErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === OutlookErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === OutlookErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === OutlookErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === OutlookErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === OutlookErrorType.Server
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
