/**
 * Dropbox Errors
 *
 * Auto-generated error handling for Dropbox Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/dropbox
 */

/**
 * Error type enum
 */
export enum DropboxErrorType {
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
 * Dropbox Error class
 *
 * Custom error class for Dropbox Integration operations.
 */
export class DropboxError extends Error {
  public readonly code: string | number
  public readonly type: DropboxErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: DropboxErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'DropboxError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DropboxError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns DropboxError instance
   */
  static fromError(error: any): DropboxError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: DropboxErrorType; retryable: boolean }> = {
      '401': { type: DropboxErrorType.Authentication, retryable: false },
      '429': { type: DropboxErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new DropboxError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = DropboxErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = DropboxErrorType.Authentication
    } else if (statusCode === 403) {
      type = DropboxErrorType.Authorization
    } else if (statusCode === 404) {
      type = DropboxErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = DropboxErrorType.Validation
    } else if (statusCode === 429) {
      type = DropboxErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = DropboxErrorType.Server
      retryable = true
    }

    return new DropboxError(message, code, type, {
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
    return this.type === DropboxErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === DropboxErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === DropboxErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === DropboxErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === DropboxErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === DropboxErrorType.Server
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
