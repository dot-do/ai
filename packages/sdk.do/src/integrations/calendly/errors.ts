/**
 * Calendly Errors
 *
 * Auto-generated error handling for Calendly Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/calendly
 */

/**
 * Error type enum
 */
export enum CalendlyErrorType {
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
 * Calendly Error class
 *
 * Custom error class for Calendly Integration operations.
 */
export class CalendlyError extends Error {
  public readonly code: string | number
  public readonly type: CalendlyErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: CalendlyErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'CalendlyError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CalendlyError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns CalendlyError instance
   */
  static fromError(error: any): CalendlyError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: CalendlyErrorType; retryable: boolean }> = {
      '401': { type: CalendlyErrorType.Authentication, retryable: false },
      '429': { type: CalendlyErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new CalendlyError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = CalendlyErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = CalendlyErrorType.Authentication
    } else if (statusCode === 403) {
      type = CalendlyErrorType.Authorization
    } else if (statusCode === 404) {
      type = CalendlyErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = CalendlyErrorType.Validation
    } else if (statusCode === 429) {
      type = CalendlyErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = CalendlyErrorType.Server
      retryable = true
    }

    return new CalendlyError(message, code, type, {
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
    return this.type === CalendlyErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === CalendlyErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === CalendlyErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === CalendlyErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === CalendlyErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === CalendlyErrorType.Server
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
