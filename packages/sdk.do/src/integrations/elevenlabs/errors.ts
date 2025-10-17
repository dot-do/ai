/**
 * Elevenlabs Errors
 *
 * Auto-generated error handling for Elevenlabs Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/elevenlabs
 */

/**
 * Error type enum
 */
export enum ElevenlabsErrorType {
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
 * Elevenlabs Error class
 *
 * Custom error class for Elevenlabs Integration operations.
 */
export class ElevenlabsError extends Error {
  public readonly code: string | number
  public readonly type: ElevenlabsErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ElevenlabsErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ElevenlabsError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ElevenlabsError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ElevenlabsError instance
   */
  static fromError(error: any): ElevenlabsError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ElevenlabsErrorType; retryable: boolean }> = {
      '401': { type: ElevenlabsErrorType.Authentication, retryable: false },
      '429': { type: ElevenlabsErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ElevenlabsError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ElevenlabsErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ElevenlabsErrorType.Authentication
    } else if (statusCode === 403) {
      type = ElevenlabsErrorType.Authorization
    } else if (statusCode === 404) {
      type = ElevenlabsErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ElevenlabsErrorType.Validation
    } else if (statusCode === 429) {
      type = ElevenlabsErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ElevenlabsErrorType.Server
      retryable = true
    }

    return new ElevenlabsError(message, code, type, {
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
    return this.type === ElevenlabsErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ElevenlabsErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ElevenlabsErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ElevenlabsErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ElevenlabsErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ElevenlabsErrorType.Server
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
