/**
 * Datadog Errors
 *
 * Auto-generated error handling for Datadog Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/datadog
 */

/**
 * Error type enum
 */
export enum DatadogErrorType {
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
 * Datadog Error class
 *
 * Custom error class for Datadog Integration operations.
 */
export class DatadogError extends Error {
  public readonly code: string | number
  public readonly type: DatadogErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: DatadogErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'DatadogError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DatadogError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns DatadogError instance
   */
  static fromError(error: any): DatadogError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: DatadogErrorType; retryable: boolean }> = {
      '401': { type: DatadogErrorType.Authentication, retryable: false },
      '403': { type: DatadogErrorType.Authorization, retryable: false },
      '404': { type: DatadogErrorType.NotFound, retryable: false },
      '400': { type: DatadogErrorType.Validation, retryable: false },
      '429': { type: DatadogErrorType.RateLimit, retryable: true },
      '500': { type: DatadogErrorType.Server, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new DatadogError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = DatadogErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = DatadogErrorType.Authentication
    } else if (statusCode === 403) {
      type = DatadogErrorType.Authorization
    } else if (statusCode === 404) {
      type = DatadogErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = DatadogErrorType.Validation
    } else if (statusCode === 429) {
      type = DatadogErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = DatadogErrorType.Server
      retryable = true
    }

    return new DatadogError(message, code, type, {
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
    return this.type === DatadogErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === DatadogErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === DatadogErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === DatadogErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === DatadogErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === DatadogErrorType.Server
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
