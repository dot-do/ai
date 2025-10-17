/**
 * Openrouter Errors
 *
 * Auto-generated error handling for Openrouter Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/openrouter
 */

/**
 * Error type enum
 */
export enum OpenrouterErrorType {
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
 * Openrouter Error class
 *
 * Custom error class for Openrouter Integration operations.
 */
export class OpenrouterError extends Error {
  public readonly code: string | number
  public readonly type: OpenrouterErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: OpenrouterErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'OpenrouterError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, OpenrouterError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns OpenrouterError instance
   */
  static fromError(error: any): OpenrouterError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: OpenrouterErrorType; retryable: boolean }> = {
      '401': { type: OpenrouterErrorType.Authentication, retryable: false },
      '429': { type: OpenrouterErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new OpenrouterError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = OpenrouterErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = OpenrouterErrorType.Authentication
    } else if (statusCode === 403) {
      type = OpenrouterErrorType.Authorization
    } else if (statusCode === 404) {
      type = OpenrouterErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = OpenrouterErrorType.Validation
    } else if (statusCode === 429) {
      type = OpenrouterErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = OpenrouterErrorType.Server
      retryable = true
    }

    return new OpenrouterError(message, code, type, {
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
    return this.type === OpenrouterErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === OpenrouterErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === OpenrouterErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === OpenrouterErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === OpenrouterErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === OpenrouterErrorType.Server
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
