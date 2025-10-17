/**
 * Maintainx Errors
 *
 * Auto-generated error handling for Maintainx Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/maintainx
 */

/**
 * Error type enum
 */
export enum MaintainxErrorType {
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
 * Maintainx Error class
 *
 * Custom error class for Maintainx Integration operations.
 */
export class MaintainxError extends Error {
  public readonly code: string | number
  public readonly type: MaintainxErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: MaintainxErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'MaintainxError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MaintainxError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns MaintainxError instance
   */
  static fromError(error: any): MaintainxError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: MaintainxErrorType; retryable: boolean }> = {
      '401': { type: MaintainxErrorType.Authentication, retryable: false },
      '429': { type: MaintainxErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new MaintainxError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = MaintainxErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = MaintainxErrorType.Authentication
    } else if (statusCode === 403) {
      type = MaintainxErrorType.Authorization
    } else if (statusCode === 404) {
      type = MaintainxErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = MaintainxErrorType.Validation
    } else if (statusCode === 429) {
      type = MaintainxErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = MaintainxErrorType.Server
      retryable = true
    }

    return new MaintainxError(message, code, type, {
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
    return this.type === MaintainxErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === MaintainxErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === MaintainxErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === MaintainxErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === MaintainxErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === MaintainxErrorType.Server
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
