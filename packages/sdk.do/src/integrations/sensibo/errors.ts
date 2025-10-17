/**
 * Sensibo Errors
 *
 * Auto-generated error handling for Sensibo Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/sensibo
 */

/**
 * Error type enum
 */
export enum SensiboErrorType {
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
 * Sensibo Error class
 *
 * Custom error class for Sensibo Integration operations.
 */
export class SensiboError extends Error {
  public readonly code: string | number
  public readonly type: SensiboErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: SensiboErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'SensiboError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SensiboError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns SensiboError instance
   */
  static fromError(error: any): SensiboError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: SensiboErrorType; retryable: boolean }> = {
      '401': { type: SensiboErrorType.Authentication, retryable: false },
      '429': { type: SensiboErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new SensiboError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = SensiboErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = SensiboErrorType.Authentication
    } else if (statusCode === 403) {
      type = SensiboErrorType.Authorization
    } else if (statusCode === 404) {
      type = SensiboErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = SensiboErrorType.Validation
    } else if (statusCode === 429) {
      type = SensiboErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = SensiboErrorType.Server
      retryable = true
    }

    return new SensiboError(message, code, type, {
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
    return this.type === SensiboErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === SensiboErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === SensiboErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === SensiboErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === SensiboErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === SensiboErrorType.Server
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
