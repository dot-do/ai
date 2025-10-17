/**
 * Dropbox sign Errors
 *
 * Auto-generated error handling for Dropbox sign Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/dropbox_sign
 */

/**
 * Error type enum
 */
export enum DropboxSignErrorType {
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
 * Dropbox sign Error class
 *
 * Custom error class for Dropbox sign Integration operations.
 */
export class DropboxSignError extends Error {
  public readonly code: string | number
  public readonly type: DropboxSignErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: DropboxSignErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'DropboxSignError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DropboxSignError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns DropboxSignError instance
   */
  static fromError(error: any): DropboxSignError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: DropboxSignErrorType; retryable: boolean }> = {
      '401': { type: DropboxSignErrorType.Authentication, retryable: false },
      '429': { type: DropboxSignErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new DropboxSignError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = DropboxSignErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = DropboxSignErrorType.Authentication
    } else if (statusCode === 403) {
      type = DropboxSignErrorType.Authorization
    } else if (statusCode === 404) {
      type = DropboxSignErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = DropboxSignErrorType.Validation
    } else if (statusCode === 429) {
      type = DropboxSignErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = DropboxSignErrorType.Server
      retryable = true
    }

    return new DropboxSignError(message, code, type, {
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
    return this.type === DropboxSignErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === DropboxSignErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === DropboxSignErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === DropboxSignErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === DropboxSignErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === DropboxSignErrorType.Server
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
