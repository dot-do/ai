/**
 * Codeinterpreter Errors
 *
 * Auto-generated error handling for Codeinterpreter Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/codeinterpreter
 */

/**
 * Error type enum
 */
export enum CodeinterpreterErrorType {
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
 * Codeinterpreter Error class
 *
 * Custom error class for Codeinterpreter Integration operations.
 */
export class CodeinterpreterError extends Error {
  public readonly code: string | number
  public readonly type: CodeinterpreterErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: CodeinterpreterErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'CodeinterpreterError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CodeinterpreterError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns CodeinterpreterError instance
   */
  static fromError(error: any): CodeinterpreterError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: CodeinterpreterErrorType; retryable: boolean }> = {
      '401': { type: CodeinterpreterErrorType.Authentication, retryable: false },
      '429': { type: CodeinterpreterErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new CodeinterpreterError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = CodeinterpreterErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = CodeinterpreterErrorType.Authentication
    } else if (statusCode === 403) {
      type = CodeinterpreterErrorType.Authorization
    } else if (statusCode === 404) {
      type = CodeinterpreterErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = CodeinterpreterErrorType.Validation
    } else if (statusCode === 429) {
      type = CodeinterpreterErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = CodeinterpreterErrorType.Server
      retryable = true
    }

    return new CodeinterpreterError(message, code, type, {
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
    return this.type === CodeinterpreterErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === CodeinterpreterErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === CodeinterpreterErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === CodeinterpreterErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === CodeinterpreterErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === CodeinterpreterErrorType.Server
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
