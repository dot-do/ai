/**
 * Evenium Errors
 *
 * Auto-generated error handling for Evenium Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/evenium
 */

/**
 * Error type enum
 */
export enum EveniumErrorType {
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
 * Evenium Error class
 *
 * Custom error class for Evenium Integration operations.
 */
export class EveniumError extends Error {
  public readonly code: string | number
  public readonly type: EveniumErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: EveniumErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'EveniumError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, EveniumError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns EveniumError instance
   */
  static fromError(error: any): EveniumError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: EveniumErrorType; retryable: boolean }> = {
      '401': { type: EveniumErrorType.Authentication, retryable: false },
      '429': { type: EveniumErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new EveniumError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = EveniumErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = EveniumErrorType.Authentication
    } else if (statusCode === 403) {
      type = EveniumErrorType.Authorization
    } else if (statusCode === 404) {
      type = EveniumErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = EveniumErrorType.Validation
    } else if (statusCode === 429) {
      type = EveniumErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = EveniumErrorType.Server
      retryable = true
    }

    return new EveniumError(message, code, type, {
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
    return this.type === EveniumErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === EveniumErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === EveniumErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === EveniumErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === EveniumErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === EveniumErrorType.Server
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
