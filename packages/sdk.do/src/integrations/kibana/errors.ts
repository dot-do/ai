/**
 * Kibana Errors
 *
 * Auto-generated error handling for Kibana Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/kibana
 */

/**
 * Error type enum
 */
export enum KibanaErrorType {
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
 * Kibana Error class
 *
 * Custom error class for Kibana Integration operations.
 */
export class KibanaError extends Error {
  public readonly code: string | number
  public readonly type: KibanaErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: KibanaErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'KibanaError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, KibanaError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns KibanaError instance
   */
  static fromError(error: any): KibanaError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: KibanaErrorType; retryable: boolean }> = {
      '401': { type: KibanaErrorType.Authentication, retryable: false },
      '429': { type: KibanaErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new KibanaError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = KibanaErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = KibanaErrorType.Authentication
    } else if (statusCode === 403) {
      type = KibanaErrorType.Authorization
    } else if (statusCode === 404) {
      type = KibanaErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = KibanaErrorType.Validation
    } else if (statusCode === 429) {
      type = KibanaErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = KibanaErrorType.Server
      retryable = true
    }

    return new KibanaError(message, code, type, {
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
    return this.type === KibanaErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === KibanaErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === KibanaErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === KibanaErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === KibanaErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === KibanaErrorType.Server
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
