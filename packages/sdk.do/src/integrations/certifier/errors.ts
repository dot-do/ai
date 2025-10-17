/**
 * Certifier Errors
 *
 * Auto-generated error handling for Certifier Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/certifier
 */

/**
 * Error type enum
 */
export enum CertifierErrorType {
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
 * Certifier Error class
 *
 * Custom error class for Certifier Integration operations.
 */
export class CertifierError extends Error {
  public readonly code: string | number
  public readonly type: CertifierErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: CertifierErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'CertifierError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CertifierError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns CertifierError instance
   */
  static fromError(error: any): CertifierError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: CertifierErrorType; retryable: boolean }> = {
      '401': { type: CertifierErrorType.Authentication, retryable: false },
      '429': { type: CertifierErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new CertifierError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = CertifierErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = CertifierErrorType.Authentication
    } else if (statusCode === 403) {
      type = CertifierErrorType.Authorization
    } else if (statusCode === 404) {
      type = CertifierErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = CertifierErrorType.Validation
    } else if (statusCode === 429) {
      type = CertifierErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = CertifierErrorType.Server
      retryable = true
    }

    return new CertifierError(message, code, type, {
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
    return this.type === CertifierErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === CertifierErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === CertifierErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === CertifierErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === CertifierErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === CertifierErrorType.Server
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
