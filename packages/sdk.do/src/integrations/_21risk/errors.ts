/**
 * 21risk Errors
 *
 * Auto-generated error handling for 21risk Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/_21risk
 */

/**
 * Error type enum
 */
export enum _21riskErrorType {
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
 * 21risk Error class
 *
 * Custom error class for 21risk Integration operations.
 */
export class _21riskError extends Error {
  public readonly code: string | number
  public readonly type: _21riskErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: _21riskErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = '_21riskError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, _21riskError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns _21riskError instance
   */
  static fromError(error: any): _21riskError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: _21riskErrorType; retryable: boolean }> = {
      '401': { type: _21riskErrorType.Authentication, retryable: false },
      '429': { type: _21riskErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new _21riskError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = _21riskErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = _21riskErrorType.Authentication
    } else if (statusCode === 403) {
      type = _21riskErrorType.Authorization
    } else if (statusCode === 404) {
      type = _21riskErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = _21riskErrorType.Validation
    } else if (statusCode === 429) {
      type = _21riskErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = _21riskErrorType.Server
      retryable = true
    }

    return new _21riskError(message, code, type, {
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
    return this.type === _21riskErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === _21riskErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === _21riskErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === _21riskErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === _21riskErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === _21riskErrorType.Server
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
