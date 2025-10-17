/**
 * Dungeon fighter online Errors
 *
 * Auto-generated error handling for Dungeon fighter online Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/dungeon_fighter_online
 */

/**
 * Error type enum
 */
export enum DungeonFighterOnlineErrorType {
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
 * Dungeon fighter online Error class
 *
 * Custom error class for Dungeon fighter online Integration operations.
 */
export class DungeonFighterOnlineError extends Error {
  public readonly code: string | number
  public readonly type: DungeonFighterOnlineErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: DungeonFighterOnlineErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'DungeonFighterOnlineError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DungeonFighterOnlineError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns DungeonFighterOnlineError instance
   */
  static fromError(error: any): DungeonFighterOnlineError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: DungeonFighterOnlineErrorType; retryable: boolean }> = {
      '401': { type: DungeonFighterOnlineErrorType.Authentication, retryable: false },
      '429': { type: DungeonFighterOnlineErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new DungeonFighterOnlineError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = DungeonFighterOnlineErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = DungeonFighterOnlineErrorType.Authentication
    } else if (statusCode === 403) {
      type = DungeonFighterOnlineErrorType.Authorization
    } else if (statusCode === 404) {
      type = DungeonFighterOnlineErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = DungeonFighterOnlineErrorType.Validation
    } else if (statusCode === 429) {
      type = DungeonFighterOnlineErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = DungeonFighterOnlineErrorType.Server
      retryable = true
    }

    return new DungeonFighterOnlineError(message, code, type, {
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
    return this.type === DungeonFighterOnlineErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === DungeonFighterOnlineErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === DungeonFighterOnlineErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === DungeonFighterOnlineErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === DungeonFighterOnlineErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === DungeonFighterOnlineErrorType.Server
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
