/**
 * Epic games Errors
 *
 * Auto-generated error handling for Epic games Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/epic_games
 */

/**
 * Error type enum
 */
export enum EpicGamesErrorType {
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
 * Epic games Error class
 *
 * Custom error class for Epic games Integration operations.
 */
export class EpicGamesError extends Error {
  public readonly code: string | number
  public readonly type: EpicGamesErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: EpicGamesErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'EpicGamesError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, EpicGamesError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns EpicGamesError instance
   */
  static fromError(error: any): EpicGamesError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: EpicGamesErrorType; retryable: boolean }> = {
      '401': { type: EpicGamesErrorType.Authentication, retryable: false },
      '429': { type: EpicGamesErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new EpicGamesError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = EpicGamesErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = EpicGamesErrorType.Authentication
    } else if (statusCode === 403) {
      type = EpicGamesErrorType.Authorization
    } else if (statusCode === 404) {
      type = EpicGamesErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = EpicGamesErrorType.Validation
    } else if (statusCode === 429) {
      type = EpicGamesErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = EpicGamesErrorType.Server
      retryable = true
    }

    return new EpicGamesError(message, code, type, {
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
    return this.type === EpicGamesErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === EpicGamesErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === EpicGamesErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === EpicGamesErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === EpicGamesErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === EpicGamesErrorType.Server
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
