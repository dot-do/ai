/**
 * Flexisign Errors
 *
 * Auto-generated error handling for Flexisign Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/flexisign
 */

/**
 * Error type enum
 */
export enum FlexisignErrorType {
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
 * Flexisign Error class
 *
 * Custom error class for Flexisign Integration operations.
 */
export class FlexisignError extends Error {
  public readonly code: string | number
  public readonly type: FlexisignErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: FlexisignErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'FlexisignError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FlexisignError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns FlexisignError instance
   */
  static fromError(error: any): FlexisignError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: FlexisignErrorType; retryable: boolean }> = {
      '401': { type: FlexisignErrorType.Authentication, retryable: false },
      '429': { type: FlexisignErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new FlexisignError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = FlexisignErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = FlexisignErrorType.Authentication
    } else if (statusCode === 403) {
      type = FlexisignErrorType.Authorization
    } else if (statusCode === 404) {
      type = FlexisignErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = FlexisignErrorType.Validation
    } else if (statusCode === 429) {
      type = FlexisignErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = FlexisignErrorType.Server
      retryable = true
    }

    return new FlexisignError(message, code, type, {
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
    return this.type === FlexisignErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === FlexisignErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === FlexisignErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === FlexisignErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === FlexisignErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === FlexisignErrorType.Server
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
