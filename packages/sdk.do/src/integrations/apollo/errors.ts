/**
 * Apollo Errors
 *
 * Auto-generated error handling for Apollo Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/apollo
 */

/**
 * Error type enum
 */
export enum ApolloErrorType {
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
 * Apollo Error class
 *
 * Custom error class for Apollo Integration operations.
 */
export class ApolloError extends Error {
  public readonly code: string | number
  public readonly type: ApolloErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ApolloErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ApolloError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApolloError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ApolloError instance
   */
  static fromError(error: any): ApolloError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ApolloErrorType; retryable: boolean }> = {
      '401': { type: ApolloErrorType.Authentication, retryable: false },
      '429': { type: ApolloErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ApolloError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ApolloErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ApolloErrorType.Authentication
    } else if (statusCode === 403) {
      type = ApolloErrorType.Authorization
    } else if (statusCode === 404) {
      type = ApolloErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ApolloErrorType.Validation
    } else if (statusCode === 429) {
      type = ApolloErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ApolloErrorType.Server
      retryable = true
    }

    return new ApolloError(message, code, type, {
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
    return this.type === ApolloErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ApolloErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ApolloErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ApolloErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ApolloErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ApolloErrorType.Server
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
