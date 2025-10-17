/**
 * Neutrino Errors
 *
 * Auto-generated error handling for Neutrino Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/neutrino
 */

/**
 * Error type enum
 */
export enum NeutrinoErrorType {
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
 * Neutrino Error class
 *
 * Custom error class for Neutrino Integration operations.
 */
export class NeutrinoError extends Error {
  public readonly code: string | number
  public readonly type: NeutrinoErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: NeutrinoErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'NeutrinoError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NeutrinoError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns NeutrinoError instance
   */
  static fromError(error: any): NeutrinoError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: NeutrinoErrorType; retryable: boolean }> = {
      '401': { type: NeutrinoErrorType.Authentication, retryable: false },
      '429': { type: NeutrinoErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new NeutrinoError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = NeutrinoErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = NeutrinoErrorType.Authentication
    } else if (statusCode === 403) {
      type = NeutrinoErrorType.Authorization
    } else if (statusCode === 404) {
      type = NeutrinoErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = NeutrinoErrorType.Validation
    } else if (statusCode === 429) {
      type = NeutrinoErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = NeutrinoErrorType.Server
      retryable = true
    }

    return new NeutrinoError(message, code, type, {
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
    return this.type === NeutrinoErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === NeutrinoErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === NeutrinoErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === NeutrinoErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === NeutrinoErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === NeutrinoErrorType.Server
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
