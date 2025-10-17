/**
 * Brilliant directories Errors
 *
 * Auto-generated error handling for Brilliant directories Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/brilliant_directories
 */

/**
 * Error type enum
 */
export enum BrilliantDirectoriesErrorType {
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
 * Brilliant directories Error class
 *
 * Custom error class for Brilliant directories Integration operations.
 */
export class BrilliantDirectoriesError extends Error {
  public readonly code: string | number
  public readonly type: BrilliantDirectoriesErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: BrilliantDirectoriesErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'BrilliantDirectoriesError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BrilliantDirectoriesError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns BrilliantDirectoriesError instance
   */
  static fromError(error: any): BrilliantDirectoriesError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: BrilliantDirectoriesErrorType; retryable: boolean }> = {
      '401': { type: BrilliantDirectoriesErrorType.Authentication, retryable: false },
      '429': { type: BrilliantDirectoriesErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new BrilliantDirectoriesError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = BrilliantDirectoriesErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = BrilliantDirectoriesErrorType.Authentication
    } else if (statusCode === 403) {
      type = BrilliantDirectoriesErrorType.Authorization
    } else if (statusCode === 404) {
      type = BrilliantDirectoriesErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = BrilliantDirectoriesErrorType.Validation
    } else if (statusCode === 429) {
      type = BrilliantDirectoriesErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = BrilliantDirectoriesErrorType.Server
      retryable = true
    }

    return new BrilliantDirectoriesError(message, code, type, {
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
    return this.type === BrilliantDirectoriesErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === BrilliantDirectoriesErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === BrilliantDirectoriesErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === BrilliantDirectoriesErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === BrilliantDirectoriesErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === BrilliantDirectoriesErrorType.Server
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
