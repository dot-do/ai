/**
 * Accredible certificates Errors
 *
 * Auto-generated error handling for Accredible certificates Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/accredible_certificates
 */

/**
 * Error type enum
 */
export enum AccredibleCertificatesErrorType {
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
 * Accredible certificates Error class
 *
 * Custom error class for Accredible certificates Integration operations.
 */
export class AccredibleCertificatesError extends Error {
  public readonly code: string | number
  public readonly type: AccredibleCertificatesErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: AccredibleCertificatesErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'AccredibleCertificatesError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AccredibleCertificatesError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns AccredibleCertificatesError instance
   */
  static fromError(error: any): AccredibleCertificatesError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: AccredibleCertificatesErrorType; retryable: boolean }> = {
      '401': { type: AccredibleCertificatesErrorType.Authentication, retryable: false },
      '429': { type: AccredibleCertificatesErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new AccredibleCertificatesError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = AccredibleCertificatesErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = AccredibleCertificatesErrorType.Authentication
    } else if (statusCode === 403) {
      type = AccredibleCertificatesErrorType.Authorization
    } else if (statusCode === 404) {
      type = AccredibleCertificatesErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = AccredibleCertificatesErrorType.Validation
    } else if (statusCode === 429) {
      type = AccredibleCertificatesErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = AccredibleCertificatesErrorType.Server
      retryable = true
    }

    return new AccredibleCertificatesError(message, code, type, {
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
    return this.type === AccredibleCertificatesErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === AccredibleCertificatesErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === AccredibleCertificatesErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === AccredibleCertificatesErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === AccredibleCertificatesErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === AccredibleCertificatesErrorType.Server
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
