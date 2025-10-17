/**
 * Ncscale Errors
 *
 * Auto-generated error handling for Ncscale Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/ncscale
 */

/**
 * Error type enum
 */
export enum NcscaleErrorType {
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
 * Ncscale Error class
 *
 * Custom error class for Ncscale Integration operations.
 */
export class NcscaleError extends Error {
  public readonly code: string | number
  public readonly type: NcscaleErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: NcscaleErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'NcscaleError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NcscaleError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns NcscaleError instance
   */
  static fromError(error: any): NcscaleError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: NcscaleErrorType; retryable: boolean }> = {
      '401': { type: NcscaleErrorType.Authentication, retryable: false },
      '429': { type: NcscaleErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new NcscaleError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = NcscaleErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = NcscaleErrorType.Authentication
    } else if (statusCode === 403) {
      type = NcscaleErrorType.Authorization
    } else if (statusCode === 404) {
      type = NcscaleErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = NcscaleErrorType.Validation
    } else if (statusCode === 429) {
      type = NcscaleErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = NcscaleErrorType.Server
      retryable = true
    }

    return new NcscaleError(message, code, type, {
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
    return this.type === NcscaleErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === NcscaleErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === NcscaleErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === NcscaleErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === NcscaleErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === NcscaleErrorType.Server
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
