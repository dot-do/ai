/**
 * Flowiseai Errors
 *
 * Auto-generated error handling for Flowiseai Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/flowiseai
 */

/**
 * Error type enum
 */
export enum FlowiseaiErrorType {
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
 * Flowiseai Error class
 *
 * Custom error class for Flowiseai Integration operations.
 */
export class FlowiseaiError extends Error {
  public readonly code: string | number
  public readonly type: FlowiseaiErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: FlowiseaiErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'FlowiseaiError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FlowiseaiError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns FlowiseaiError instance
   */
  static fromError(error: any): FlowiseaiError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: FlowiseaiErrorType; retryable: boolean }> = {
      '401': { type: FlowiseaiErrorType.Authentication, retryable: false },
      '429': { type: FlowiseaiErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new FlowiseaiError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = FlowiseaiErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = FlowiseaiErrorType.Authentication
    } else if (statusCode === 403) {
      type = FlowiseaiErrorType.Authorization
    } else if (statusCode === 404) {
      type = FlowiseaiErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = FlowiseaiErrorType.Validation
    } else if (statusCode === 429) {
      type = FlowiseaiErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = FlowiseaiErrorType.Server
      retryable = true
    }

    return new FlowiseaiError(message, code, type, {
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
    return this.type === FlowiseaiErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === FlowiseaiErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === FlowiseaiErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === FlowiseaiErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === FlowiseaiErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === FlowiseaiErrorType.Server
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
