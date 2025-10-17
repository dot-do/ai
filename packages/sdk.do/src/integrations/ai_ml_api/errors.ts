/**
 * Ai ml api Errors
 *
 * Auto-generated error handling for Ai ml api Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/ai_ml_api
 */

/**
 * Error type enum
 */
export enum AiMlApiErrorType {
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
 * Ai ml api Error class
 *
 * Custom error class for Ai ml api Integration operations.
 */
export class AiMlApiError extends Error {
  public readonly code: string | number
  public readonly type: AiMlApiErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: AiMlApiErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'AiMlApiError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AiMlApiError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns AiMlApiError instance
   */
  static fromError(error: any): AiMlApiError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: AiMlApiErrorType; retryable: boolean }> = {
      '401': { type: AiMlApiErrorType.Authentication, retryable: false },
      '429': { type: AiMlApiErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new AiMlApiError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = AiMlApiErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = AiMlApiErrorType.Authentication
    } else if (statusCode === 403) {
      type = AiMlApiErrorType.Authorization
    } else if (statusCode === 404) {
      type = AiMlApiErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = AiMlApiErrorType.Validation
    } else if (statusCode === 429) {
      type = AiMlApiErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = AiMlApiErrorType.Server
      retryable = true
    }

    return new AiMlApiError(message, code, type, {
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
    return this.type === AiMlApiErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === AiMlApiErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === AiMlApiErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === AiMlApiErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === AiMlApiErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === AiMlApiErrorType.Server
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
