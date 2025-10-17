/**
 * Trello Errors
 *
 * Auto-generated error handling for Trello Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/trello
 */

/**
 * Error type enum
 */
export enum TrelloErrorType {
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
 * Trello Error class
 *
 * Custom error class for Trello Integration operations.
 */
export class TrelloError extends Error {
  public readonly code: string | number
  public readonly type: TrelloErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: TrelloErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'TrelloError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TrelloError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns TrelloError instance
   */
  static fromError(error: any): TrelloError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: TrelloErrorType; retryable: boolean }> = {
      '401': { type: TrelloErrorType.Authentication, retryable: false },
      '429': { type: TrelloErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new TrelloError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = TrelloErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = TrelloErrorType.Authentication
    } else if (statusCode === 403) {
      type = TrelloErrorType.Authorization
    } else if (statusCode === 404) {
      type = TrelloErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = TrelloErrorType.Validation
    } else if (statusCode === 429) {
      type = TrelloErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = TrelloErrorType.Server
      retryable = true
    }

    return new TrelloError(message, code, type, {
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
    return this.type === TrelloErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === TrelloErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === TrelloErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === TrelloErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === TrelloErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === TrelloErrorType.Server
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
