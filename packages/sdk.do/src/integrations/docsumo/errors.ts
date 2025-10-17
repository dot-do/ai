/**
 * Docsumo Errors
 *
 * Auto-generated error handling for Docsumo Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/docsumo
 */

/**
 * Error type enum
 */
export enum DocsumoErrorType {
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
 * Docsumo Error class
 *
 * Custom error class for Docsumo Integration operations.
 */
export class DocsumoError extends Error {
  public readonly code: string | number
  public readonly type: DocsumoErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: DocsumoErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'DocsumoError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DocsumoError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns DocsumoError instance
   */
  static fromError(error: any): DocsumoError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: DocsumoErrorType; retryable: boolean }> = {
      '401': { type: DocsumoErrorType.Authentication, retryable: false },
      '429': { type: DocsumoErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new DocsumoError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = DocsumoErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = DocsumoErrorType.Authentication
    } else if (statusCode === 403) {
      type = DocsumoErrorType.Authorization
    } else if (statusCode === 404) {
      type = DocsumoErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = DocsumoErrorType.Validation
    } else if (statusCode === 429) {
      type = DocsumoErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = DocsumoErrorType.Server
      retryable = true
    }

    return new DocsumoError(message, code, type, {
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
    return this.type === DocsumoErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === DocsumoErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === DocsumoErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === DocsumoErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === DocsumoErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === DocsumoErrorType.Server
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
