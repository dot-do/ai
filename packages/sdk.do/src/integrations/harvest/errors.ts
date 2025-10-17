/**
 * Harvest Errors
 *
 * Auto-generated error handling for Harvest Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/harvest
 */

/**
 * Error type enum
 */
export enum HarvestErrorType {
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
 * Harvest Error class
 *
 * Custom error class for Harvest Integration operations.
 */
export class HarvestError extends Error {
  public readonly code: string | number
  public readonly type: HarvestErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: HarvestErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'HarvestError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HarvestError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns HarvestError instance
   */
  static fromError(error: any): HarvestError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: HarvestErrorType; retryable: boolean }> = {
      '401': { type: HarvestErrorType.Authentication, retryable: false },
      '429': { type: HarvestErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new HarvestError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = HarvestErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = HarvestErrorType.Authentication
    } else if (statusCode === 403) {
      type = HarvestErrorType.Authorization
    } else if (statusCode === 404) {
      type = HarvestErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = HarvestErrorType.Validation
    } else if (statusCode === 429) {
      type = HarvestErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = HarvestErrorType.Server
      retryable = true
    }

    return new HarvestError(message, code, type, {
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
    return this.type === HarvestErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === HarvestErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === HarvestErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === HarvestErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === HarvestErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === HarvestErrorType.Server
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
