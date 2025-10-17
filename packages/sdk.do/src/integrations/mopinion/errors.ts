/**
 * Mopinion Errors
 *
 * Auto-generated error handling for Mopinion Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/mopinion
 */

/**
 * Error type enum
 */
export enum MopinionErrorType {
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
 * Mopinion Error class
 *
 * Custom error class for Mopinion Integration operations.
 */
export class MopinionError extends Error {
  public readonly code: string | number
  public readonly type: MopinionErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: MopinionErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'MopinionError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MopinionError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns MopinionError instance
   */
  static fromError(error: any): MopinionError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: MopinionErrorType; retryable: boolean }> = {
      '401': { type: MopinionErrorType.Authentication, retryable: false },
      '429': { type: MopinionErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new MopinionError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = MopinionErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = MopinionErrorType.Authentication
    } else if (statusCode === 403) {
      type = MopinionErrorType.Authorization
    } else if (statusCode === 404) {
      type = MopinionErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = MopinionErrorType.Validation
    } else if (statusCode === 429) {
      type = MopinionErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = MopinionErrorType.Server
      retryable = true
    }

    return new MopinionError(message, code, type, {
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
    return this.type === MopinionErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === MopinionErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === MopinionErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === MopinionErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === MopinionErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === MopinionErrorType.Server
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
