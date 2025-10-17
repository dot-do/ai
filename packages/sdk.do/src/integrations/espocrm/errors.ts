/**
 * Espocrm Errors
 *
 * Auto-generated error handling for Espocrm Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/espocrm
 */

/**
 * Error type enum
 */
export enum EspocrmErrorType {
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
 * Espocrm Error class
 *
 * Custom error class for Espocrm Integration operations.
 */
export class EspocrmError extends Error {
  public readonly code: string | number
  public readonly type: EspocrmErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: EspocrmErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'EspocrmError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, EspocrmError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns EspocrmError instance
   */
  static fromError(error: any): EspocrmError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: EspocrmErrorType; retryable: boolean }> = {
      '401': { type: EspocrmErrorType.Authentication, retryable: false },
      '429': { type: EspocrmErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new EspocrmError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = EspocrmErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = EspocrmErrorType.Authentication
    } else if (statusCode === 403) {
      type = EspocrmErrorType.Authorization
    } else if (statusCode === 404) {
      type = EspocrmErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = EspocrmErrorType.Validation
    } else if (statusCode === 429) {
      type = EspocrmErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = EspocrmErrorType.Server
      retryable = true
    }

    return new EspocrmError(message, code, type, {
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
    return this.type === EspocrmErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === EspocrmErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === EspocrmErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === EspocrmErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === EspocrmErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === EspocrmErrorType.Server
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
