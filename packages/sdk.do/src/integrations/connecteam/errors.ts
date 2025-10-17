/**
 * Connecteam Errors
 *
 * Auto-generated error handling for Connecteam Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/connecteam
 */

/**
 * Error type enum
 */
export enum ConnecteamErrorType {
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
 * Connecteam Error class
 *
 * Custom error class for Connecteam Integration operations.
 */
export class ConnecteamError extends Error {
  public readonly code: string | number
  public readonly type: ConnecteamErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ConnecteamErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ConnecteamError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ConnecteamError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ConnecteamError instance
   */
  static fromError(error: any): ConnecteamError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ConnecteamErrorType; retryable: boolean }> = {
      '401': { type: ConnecteamErrorType.Authentication, retryable: false },
      '429': { type: ConnecteamErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ConnecteamError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ConnecteamErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ConnecteamErrorType.Authentication
    } else if (statusCode === 403) {
      type = ConnecteamErrorType.Authorization
    } else if (statusCode === 404) {
      type = ConnecteamErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ConnecteamErrorType.Validation
    } else if (statusCode === 429) {
      type = ConnecteamErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ConnecteamErrorType.Server
      retryable = true
    }

    return new ConnecteamError(message, code, type, {
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
    return this.type === ConnecteamErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ConnecteamErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ConnecteamErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ConnecteamErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ConnecteamErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ConnecteamErrorType.Server
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
