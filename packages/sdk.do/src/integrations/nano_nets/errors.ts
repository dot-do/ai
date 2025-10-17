/**
 * Nano nets Errors
 *
 * Auto-generated error handling for Nano nets Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/nano_nets
 */

/**
 * Error type enum
 */
export enum NanoNetsErrorType {
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
 * Nano nets Error class
 *
 * Custom error class for Nano nets Integration operations.
 */
export class NanoNetsError extends Error {
  public readonly code: string | number
  public readonly type: NanoNetsErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: NanoNetsErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'NanoNetsError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NanoNetsError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns NanoNetsError instance
   */
  static fromError(error: any): NanoNetsError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: NanoNetsErrorType; retryable: boolean }> = {
      '401': { type: NanoNetsErrorType.Authentication, retryable: false },
      '429': { type: NanoNetsErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new NanoNetsError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = NanoNetsErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = NanoNetsErrorType.Authentication
    } else if (statusCode === 403) {
      type = NanoNetsErrorType.Authorization
    } else if (statusCode === 404) {
      type = NanoNetsErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = NanoNetsErrorType.Validation
    } else if (statusCode === 429) {
      type = NanoNetsErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = NanoNetsErrorType.Server
      retryable = true
    }

    return new NanoNetsError(message, code, type, {
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
    return this.type === NanoNetsErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === NanoNetsErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === NanoNetsErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === NanoNetsErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === NanoNetsErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === NanoNetsErrorType.Server
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
