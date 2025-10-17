/**
 * Dropcontact Errors
 *
 * Auto-generated error handling for Dropcontact Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/dropcontact
 */

/**
 * Error type enum
 */
export enum DropcontactErrorType {
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
 * Dropcontact Error class
 *
 * Custom error class for Dropcontact Integration operations.
 */
export class DropcontactError extends Error {
  public readonly code: string | number
  public readonly type: DropcontactErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: DropcontactErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'DropcontactError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DropcontactError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns DropcontactError instance
   */
  static fromError(error: any): DropcontactError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: DropcontactErrorType; retryable: boolean }> = {
      '401': { type: DropcontactErrorType.Authentication, retryable: false },
      '429': { type: DropcontactErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new DropcontactError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = DropcontactErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = DropcontactErrorType.Authentication
    } else if (statusCode === 403) {
      type = DropcontactErrorType.Authorization
    } else if (statusCode === 404) {
      type = DropcontactErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = DropcontactErrorType.Validation
    } else if (statusCode === 429) {
      type = DropcontactErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = DropcontactErrorType.Server
      retryable = true
    }

    return new DropcontactError(message, code, type, {
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
    return this.type === DropcontactErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === DropcontactErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === DropcontactErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === DropcontactErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === DropcontactErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === DropcontactErrorType.Server
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
