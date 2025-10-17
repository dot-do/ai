/**
 * Leadoku Errors
 *
 * Auto-generated error handling for Leadoku Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/leadoku
 */

/**
 * Error type enum
 */
export enum LeadokuErrorType {
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
 * Leadoku Error class
 *
 * Custom error class for Leadoku Integration operations.
 */
export class LeadokuError extends Error {
  public readonly code: string | number
  public readonly type: LeadokuErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: LeadokuErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'LeadokuError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, LeadokuError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns LeadokuError instance
   */
  static fromError(error: any): LeadokuError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: LeadokuErrorType; retryable: boolean }> = {
      '401': { type: LeadokuErrorType.Authentication, retryable: false },
      '429': { type: LeadokuErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new LeadokuError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = LeadokuErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = LeadokuErrorType.Authentication
    } else if (statusCode === 403) {
      type = LeadokuErrorType.Authorization
    } else if (statusCode === 404) {
      type = LeadokuErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = LeadokuErrorType.Validation
    } else if (statusCode === 429) {
      type = LeadokuErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = LeadokuErrorType.Server
      retryable = true
    }

    return new LeadokuError(message, code, type, {
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
    return this.type === LeadokuErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === LeadokuErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === LeadokuErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === LeadokuErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === LeadokuErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === LeadokuErrorType.Server
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
