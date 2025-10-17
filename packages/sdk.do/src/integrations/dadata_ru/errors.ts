/**
 * Dadata ru Errors
 *
 * Auto-generated error handling for Dadata ru Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/dadata_ru
 */

/**
 * Error type enum
 */
export enum DadataRuErrorType {
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
 * Dadata ru Error class
 *
 * Custom error class for Dadata ru Integration operations.
 */
export class DadataRuError extends Error {
  public readonly code: string | number
  public readonly type: DadataRuErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: DadataRuErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'DadataRuError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DadataRuError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns DadataRuError instance
   */
  static fromError(error: any): DadataRuError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: DadataRuErrorType; retryable: boolean }> = {
      '401': { type: DadataRuErrorType.Authentication, retryable: false },
      '429': { type: DadataRuErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new DadataRuError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = DadataRuErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = DadataRuErrorType.Authentication
    } else if (statusCode === 403) {
      type = DadataRuErrorType.Authorization
    } else if (statusCode === 404) {
      type = DadataRuErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = DadataRuErrorType.Validation
    } else if (statusCode === 429) {
      type = DadataRuErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = DadataRuErrorType.Server
      retryable = true
    }

    return new DadataRuError(message, code, type, {
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
    return this.type === DadataRuErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === DadataRuErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === DadataRuErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === DadataRuErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === DadataRuErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === DadataRuErrorType.Server
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
