/**
 * Leadfeeder Errors
 *
 * Auto-generated error handling for Leadfeeder Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/leadfeeder
 */

/**
 * Error type enum
 */
export enum LeadfeederErrorType {
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
 * Leadfeeder Error class
 *
 * Custom error class for Leadfeeder Integration operations.
 */
export class LeadfeederError extends Error {
  public readonly code: string | number
  public readonly type: LeadfeederErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: LeadfeederErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'LeadfeederError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, LeadfeederError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns LeadfeederError instance
   */
  static fromError(error: any): LeadfeederError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: LeadfeederErrorType; retryable: boolean }> = {
      '401': { type: LeadfeederErrorType.Authentication, retryable: false },
      '429': { type: LeadfeederErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new LeadfeederError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = LeadfeederErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = LeadfeederErrorType.Authentication
    } else if (statusCode === 403) {
      type = LeadfeederErrorType.Authorization
    } else if (statusCode === 404) {
      type = LeadfeederErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = LeadfeederErrorType.Validation
    } else if (statusCode === 429) {
      type = LeadfeederErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = LeadfeederErrorType.Server
      retryable = true
    }

    return new LeadfeederError(message, code, type, {
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
    return this.type === LeadfeederErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === LeadfeederErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === LeadfeederErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === LeadfeederErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === LeadfeederErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === LeadfeederErrorType.Server
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
