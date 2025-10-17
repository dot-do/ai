/**
 * Peopledatalabs Errors
 *
 * Auto-generated error handling for Peopledatalabs Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/peopledatalabs
 */

/**
 * Error type enum
 */
export enum PeopledatalabsErrorType {
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
 * Peopledatalabs Error class
 *
 * Custom error class for Peopledatalabs Integration operations.
 */
export class PeopledatalabsError extends Error {
  public readonly code: string | number
  public readonly type: PeopledatalabsErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: PeopledatalabsErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'PeopledatalabsError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PeopledatalabsError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns PeopledatalabsError instance
   */
  static fromError(error: any): PeopledatalabsError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: PeopledatalabsErrorType; retryable: boolean }> = {
      '401': { type: PeopledatalabsErrorType.Authentication, retryable: false },
      '429': { type: PeopledatalabsErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new PeopledatalabsError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = PeopledatalabsErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = PeopledatalabsErrorType.Authentication
    } else if (statusCode === 403) {
      type = PeopledatalabsErrorType.Authorization
    } else if (statusCode === 404) {
      type = PeopledatalabsErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = PeopledatalabsErrorType.Validation
    } else if (statusCode === 429) {
      type = PeopledatalabsErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = PeopledatalabsErrorType.Server
      retryable = true
    }

    return new PeopledatalabsError(message, code, type, {
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
    return this.type === PeopledatalabsErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === PeopledatalabsErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === PeopledatalabsErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === PeopledatalabsErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === PeopledatalabsErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === PeopledatalabsErrorType.Server
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
