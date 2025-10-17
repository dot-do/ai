/**
 * Dictionary api Errors
 *
 * Auto-generated error handling for Dictionary api Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/dictionary_api
 */

/**
 * Error type enum
 */
export enum DictionaryApiErrorType {
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
 * Dictionary api Error class
 *
 * Custom error class for Dictionary api Integration operations.
 */
export class DictionaryApiError extends Error {
  public readonly code: string | number
  public readonly type: DictionaryApiErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: DictionaryApiErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'DictionaryApiError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DictionaryApiError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns DictionaryApiError instance
   */
  static fromError(error: any): DictionaryApiError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: DictionaryApiErrorType; retryable: boolean }> = {
      '401': { type: DictionaryApiErrorType.Authentication, retryable: false },
      '429': { type: DictionaryApiErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new DictionaryApiError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = DictionaryApiErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = DictionaryApiErrorType.Authentication
    } else if (statusCode === 403) {
      type = DictionaryApiErrorType.Authorization
    } else if (statusCode === 404) {
      type = DictionaryApiErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = DictionaryApiErrorType.Validation
    } else if (statusCode === 429) {
      type = DictionaryApiErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = DictionaryApiErrorType.Server
      retryable = true
    }

    return new DictionaryApiError(message, code, type, {
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
    return this.type === DictionaryApiErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === DictionaryApiErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === DictionaryApiErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === DictionaryApiErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === DictionaryApiErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === DictionaryApiErrorType.Server
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
