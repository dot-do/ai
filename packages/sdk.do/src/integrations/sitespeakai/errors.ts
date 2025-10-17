/**
 * Sitespeakai Errors
 *
 * Auto-generated error handling for Sitespeakai Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/sitespeakai
 */

/**
 * Error type enum
 */
export enum SitespeakaiErrorType {
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
 * Sitespeakai Error class
 *
 * Custom error class for Sitespeakai Integration operations.
 */
export class SitespeakaiError extends Error {
  public readonly code: string | number
  public readonly type: SitespeakaiErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: SitespeakaiErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'SitespeakaiError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SitespeakaiError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns SitespeakaiError instance
   */
  static fromError(error: any): SitespeakaiError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: SitespeakaiErrorType; retryable: boolean }> = {
      '401': { type: SitespeakaiErrorType.Authentication, retryable: false },
      '429': { type: SitespeakaiErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new SitespeakaiError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = SitespeakaiErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = SitespeakaiErrorType.Authentication
    } else if (statusCode === 403) {
      type = SitespeakaiErrorType.Authorization
    } else if (statusCode === 404) {
      type = SitespeakaiErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = SitespeakaiErrorType.Validation
    } else if (statusCode === 429) {
      type = SitespeakaiErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = SitespeakaiErrorType.Server
      retryable = true
    }

    return new SitespeakaiError(message, code, type, {
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
    return this.type === SitespeakaiErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === SitespeakaiErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === SitespeakaiErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === SitespeakaiErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === SitespeakaiErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === SitespeakaiErrorType.Server
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
