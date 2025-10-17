/**
 * Sslmate cert spotter api Errors
 *
 * Auto-generated error handling for Sslmate cert spotter api Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/sslmate_cert_spotter_api
 */

/**
 * Error type enum
 */
export enum SslmateCertSpotterApiErrorType {
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
 * Sslmate cert spotter api Error class
 *
 * Custom error class for Sslmate cert spotter api Integration operations.
 */
export class SslmateCertSpotterApiError extends Error {
  public readonly code: string | number
  public readonly type: SslmateCertSpotterApiErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: SslmateCertSpotterApiErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'SslmateCertSpotterApiError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SslmateCertSpotterApiError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns SslmateCertSpotterApiError instance
   */
  static fromError(error: any): SslmateCertSpotterApiError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: SslmateCertSpotterApiErrorType; retryable: boolean }> = {
      '401': { type: SslmateCertSpotterApiErrorType.Authentication, retryable: false },
      '429': { type: SslmateCertSpotterApiErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new SslmateCertSpotterApiError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = SslmateCertSpotterApiErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = SslmateCertSpotterApiErrorType.Authentication
    } else if (statusCode === 403) {
      type = SslmateCertSpotterApiErrorType.Authorization
    } else if (statusCode === 404) {
      type = SslmateCertSpotterApiErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = SslmateCertSpotterApiErrorType.Validation
    } else if (statusCode === 429) {
      type = SslmateCertSpotterApiErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = SslmateCertSpotterApiErrorType.Server
      retryable = true
    }

    return new SslmateCertSpotterApiError(message, code, type, {
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
    return this.type === SslmateCertSpotterApiErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === SslmateCertSpotterApiErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === SslmateCertSpotterApiErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === SslmateCertSpotterApiErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === SslmateCertSpotterApiErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === SslmateCertSpotterApiErrorType.Server
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
