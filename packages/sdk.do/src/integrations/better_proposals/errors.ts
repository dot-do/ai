/**
 * Better proposals Errors
 *
 * Auto-generated error handling for Better proposals Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/better_proposals
 */

/**
 * Error type enum
 */
export enum BetterProposalsErrorType {
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
 * Better proposals Error class
 *
 * Custom error class for Better proposals Integration operations.
 */
export class BetterProposalsError extends Error {
  public readonly code: string | number
  public readonly type: BetterProposalsErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: BetterProposalsErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'BetterProposalsError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BetterProposalsError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns BetterProposalsError instance
   */
  static fromError(error: any): BetterProposalsError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: BetterProposalsErrorType; retryable: boolean }> = {
      '401': { type: BetterProposalsErrorType.Authentication, retryable: false },
      '429': { type: BetterProposalsErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new BetterProposalsError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = BetterProposalsErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = BetterProposalsErrorType.Authentication
    } else if (statusCode === 403) {
      type = BetterProposalsErrorType.Authorization
    } else if (statusCode === 404) {
      type = BetterProposalsErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = BetterProposalsErrorType.Validation
    } else if (statusCode === 429) {
      type = BetterProposalsErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = BetterProposalsErrorType.Server
      retryable = true
    }

    return new BetterProposalsError(message, code, type, {
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
    return this.type === BetterProposalsErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === BetterProposalsErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === BetterProposalsErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === BetterProposalsErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === BetterProposalsErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === BetterProposalsErrorType.Server
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
