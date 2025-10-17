/**
 * Plasmic Errors
 *
 * Auto-generated error handling for Plasmic Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/plasmic
 */

/**
 * Error type enum
 */
export enum PlasmicErrorType {
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
 * Plasmic Error class
 *
 * Custom error class for Plasmic Integration operations.
 */
export class PlasmicError extends Error {
  public readonly code: string | number
  public readonly type: PlasmicErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: PlasmicErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'PlasmicError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PlasmicError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns PlasmicError instance
   */
  static fromError(error: any): PlasmicError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: PlasmicErrorType; retryable: boolean }> = {
      '401': { type: PlasmicErrorType.Authentication, retryable: false },
      '429': { type: PlasmicErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new PlasmicError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = PlasmicErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = PlasmicErrorType.Authentication
    } else if (statusCode === 403) {
      type = PlasmicErrorType.Authorization
    } else if (statusCode === 404) {
      type = PlasmicErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = PlasmicErrorType.Validation
    } else if (statusCode === 429) {
      type = PlasmicErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = PlasmicErrorType.Server
      retryable = true
    }

    return new PlasmicError(message, code, type, {
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
    return this.type === PlasmicErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === PlasmicErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === PlasmicErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === PlasmicErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === PlasmicErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === PlasmicErrorType.Server
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
