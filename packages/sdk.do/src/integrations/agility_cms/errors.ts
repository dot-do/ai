/**
 * Agility cms Errors
 *
 * Auto-generated error handling for Agility cms Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/agility_cms
 */

/**
 * Error type enum
 */
export enum AgilityCmsErrorType {
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
 * Agility cms Error class
 *
 * Custom error class for Agility cms Integration operations.
 */
export class AgilityCmsError extends Error {
  public readonly code: string | number
  public readonly type: AgilityCmsErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: AgilityCmsErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'AgilityCmsError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AgilityCmsError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns AgilityCmsError instance
   */
  static fromError(error: any): AgilityCmsError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: AgilityCmsErrorType; retryable: boolean }> = {
      '401': { type: AgilityCmsErrorType.Authentication, retryable: false },
      '429': { type: AgilityCmsErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new AgilityCmsError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = AgilityCmsErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = AgilityCmsErrorType.Authentication
    } else if (statusCode === 403) {
      type = AgilityCmsErrorType.Authorization
    } else if (statusCode === 404) {
      type = AgilityCmsErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = AgilityCmsErrorType.Validation
    } else if (statusCode === 429) {
      type = AgilityCmsErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = AgilityCmsErrorType.Server
      retryable = true
    }

    return new AgilityCmsError(message, code, type, {
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
    return this.type === AgilityCmsErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === AgilityCmsErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === AgilityCmsErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === AgilityCmsErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === AgilityCmsErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === AgilityCmsErrorType.Server
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
