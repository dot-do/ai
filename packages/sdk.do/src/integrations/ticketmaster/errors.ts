/**
 * Ticketmaster Errors
 *
 * Auto-generated error handling for Ticketmaster Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/ticketmaster
 */

/**
 * Error type enum
 */
export enum TicketmasterErrorType {
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
 * Ticketmaster Error class
 *
 * Custom error class for Ticketmaster Integration operations.
 */
export class TicketmasterError extends Error {
  public readonly code: string | number
  public readonly type: TicketmasterErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: TicketmasterErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'TicketmasterError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TicketmasterError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns TicketmasterError instance
   */
  static fromError(error: any): TicketmasterError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: TicketmasterErrorType; retryable: boolean }> = {
      '401': { type: TicketmasterErrorType.Authentication, retryable: false },
      '429': { type: TicketmasterErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new TicketmasterError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = TicketmasterErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = TicketmasterErrorType.Authentication
    } else if (statusCode === 403) {
      type = TicketmasterErrorType.Authorization
    } else if (statusCode === 404) {
      type = TicketmasterErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = TicketmasterErrorType.Validation
    } else if (statusCode === 429) {
      type = TicketmasterErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = TicketmasterErrorType.Server
      retryable = true
    }

    return new TicketmasterError(message, code, type, {
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
    return this.type === TicketmasterErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === TicketmasterErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === TicketmasterErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === TicketmasterErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === TicketmasterErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === TicketmasterErrorType.Server
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
