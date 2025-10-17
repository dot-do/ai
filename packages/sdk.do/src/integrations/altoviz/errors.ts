/**
 * Altoviz Errors
 *
 * Auto-generated error handling for Altoviz Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/altoviz
 */

/**
 * Error type enum
 */
export enum AltovizErrorType {
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
 * Altoviz Error class
 *
 * Custom error class for Altoviz Integration operations.
 */
export class AltovizError extends Error {
  public readonly code: string | number
  public readonly type: AltovizErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: AltovizErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'AltovizError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AltovizError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns AltovizError instance
   */
  static fromError(error: any): AltovizError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: AltovizErrorType; retryable: boolean }> = {
      '401': { type: AltovizErrorType.Authentication, retryable: false },
      '429': { type: AltovizErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new AltovizError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = AltovizErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = AltovizErrorType.Authentication
    } else if (statusCode === 403) {
      type = AltovizErrorType.Authorization
    } else if (statusCode === 404) {
      type = AltovizErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = AltovizErrorType.Validation
    } else if (statusCode === 429) {
      type = AltovizErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = AltovizErrorType.Server
      retryable = true
    }

    return new AltovizError(message, code, type, {
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
    return this.type === AltovizErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === AltovizErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === AltovizErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === AltovizErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === AltovizErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === AltovizErrorType.Server
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
