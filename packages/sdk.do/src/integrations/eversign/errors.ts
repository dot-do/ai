/**
 * Eversign Errors
 *
 * Auto-generated error handling for Eversign Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/eversign
 */

/**
 * Error type enum
 */
export enum EversignErrorType {
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
 * Eversign Error class
 *
 * Custom error class for Eversign Integration operations.
 */
export class EversignError extends Error {
  public readonly code: string | number
  public readonly type: EversignErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: EversignErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'EversignError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, EversignError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns EversignError instance
   */
  static fromError(error: any): EversignError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: EversignErrorType; retryable: boolean }> = {
      '401': { type: EversignErrorType.Authentication, retryable: false },
      '429': { type: EversignErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new EversignError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = EversignErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = EversignErrorType.Authentication
    } else if (statusCode === 403) {
      type = EversignErrorType.Authorization
    } else if (statusCode === 404) {
      type = EversignErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = EversignErrorType.Validation
    } else if (statusCode === 429) {
      type = EversignErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = EversignErrorType.Server
      retryable = true
    }

    return new EversignError(message, code, type, {
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
    return this.type === EversignErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === EversignErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === EversignErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === EversignErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === EversignErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === EversignErrorType.Server
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
