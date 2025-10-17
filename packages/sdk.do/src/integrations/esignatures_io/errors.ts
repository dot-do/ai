/**
 * Esignatures io Errors
 *
 * Auto-generated error handling for Esignatures io Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/esignatures_io
 */

/**
 * Error type enum
 */
export enum EsignaturesIoErrorType {
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
 * Esignatures io Error class
 *
 * Custom error class for Esignatures io Integration operations.
 */
export class EsignaturesIoError extends Error {
  public readonly code: string | number
  public readonly type: EsignaturesIoErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: EsignaturesIoErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'EsignaturesIoError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, EsignaturesIoError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns EsignaturesIoError instance
   */
  static fromError(error: any): EsignaturesIoError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: EsignaturesIoErrorType; retryable: boolean }> = {
      '401': { type: EsignaturesIoErrorType.Authentication, retryable: false },
      '429': { type: EsignaturesIoErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new EsignaturesIoError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = EsignaturesIoErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = EsignaturesIoErrorType.Authentication
    } else if (statusCode === 403) {
      type = EsignaturesIoErrorType.Authorization
    } else if (statusCode === 404) {
      type = EsignaturesIoErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = EsignaturesIoErrorType.Validation
    } else if (statusCode === 429) {
      type = EsignaturesIoErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = EsignaturesIoErrorType.Server
      retryable = true
    }

    return new EsignaturesIoError(message, code, type, {
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
    return this.type === EsignaturesIoErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === EsignaturesIoErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === EsignaturesIoErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === EsignaturesIoErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === EsignaturesIoErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === EsignaturesIoErrorType.Server
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
