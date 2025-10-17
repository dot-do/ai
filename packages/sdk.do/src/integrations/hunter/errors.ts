/**
 * Hunter Errors
 *
 * Auto-generated error handling for Hunter Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/hunter
 */

/**
 * Error type enum
 */
export enum HunterErrorType {
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
 * Hunter Error class
 *
 * Custom error class for Hunter Integration operations.
 */
export class HunterError extends Error {
  public readonly code: string | number
  public readonly type: HunterErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: HunterErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'HunterError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HunterError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns HunterError instance
   */
  static fromError(error: any): HunterError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: HunterErrorType; retryable: boolean }> = {
      '401': { type: HunterErrorType.Authentication, retryable: false },
      '429': { type: HunterErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new HunterError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = HunterErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = HunterErrorType.Authentication
    } else if (statusCode === 403) {
      type = HunterErrorType.Authorization
    } else if (statusCode === 404) {
      type = HunterErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = HunterErrorType.Validation
    } else if (statusCode === 429) {
      type = HunterErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = HunterErrorType.Server
      retryable = true
    }

    return new HunterError(message, code, type, {
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
    return this.type === HunterErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === HunterErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === HunterErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === HunterErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === HunterErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === HunterErrorType.Server
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
