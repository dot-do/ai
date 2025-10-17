/**
 * Talenthr Errors
 *
 * Auto-generated error handling for Talenthr Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/talenthr
 */

/**
 * Error type enum
 */
export enum TalenthrErrorType {
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
 * Talenthr Error class
 *
 * Custom error class for Talenthr Integration operations.
 */
export class TalenthrError extends Error {
  public readonly code: string | number
  public readonly type: TalenthrErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: TalenthrErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'TalenthrError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TalenthrError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns TalenthrError instance
   */
  static fromError(error: any): TalenthrError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: TalenthrErrorType; retryable: boolean }> = {
      '401': { type: TalenthrErrorType.Authentication, retryable: false },
      '429': { type: TalenthrErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new TalenthrError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = TalenthrErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = TalenthrErrorType.Authentication
    } else if (statusCode === 403) {
      type = TalenthrErrorType.Authorization
    } else if (statusCode === 404) {
      type = TalenthrErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = TalenthrErrorType.Validation
    } else if (statusCode === 429) {
      type = TalenthrErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = TalenthrErrorType.Server
      retryable = true
    }

    return new TalenthrError(message, code, type, {
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
    return this.type === TalenthrErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === TalenthrErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === TalenthrErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === TalenthrErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === TalenthrErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === TalenthrErrorType.Server
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
