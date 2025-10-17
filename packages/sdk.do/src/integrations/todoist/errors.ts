/**
 * Todoist Errors
 *
 * Auto-generated error handling for Todoist Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/todoist
 */

/**
 * Error type enum
 */
export enum TodoistErrorType {
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
 * Todoist Error class
 *
 * Custom error class for Todoist Integration operations.
 */
export class TodoistError extends Error {
  public readonly code: string | number
  public readonly type: TodoistErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: TodoistErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'TodoistError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TodoistError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns TodoistError instance
   */
  static fromError(error: any): TodoistError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: TodoistErrorType; retryable: boolean }> = {
      '401': { type: TodoistErrorType.Authentication, retryable: false },
      '429': { type: TodoistErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new TodoistError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = TodoistErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = TodoistErrorType.Authentication
    } else if (statusCode === 403) {
      type = TodoistErrorType.Authorization
    } else if (statusCode === 404) {
      type = TodoistErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = TodoistErrorType.Validation
    } else if (statusCode === 429) {
      type = TodoistErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = TodoistErrorType.Server
      retryable = true
    }

    return new TodoistError(message, code, type, {
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
    return this.type === TodoistErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === TodoistErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === TodoistErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === TodoistErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === TodoistErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === TodoistErrorType.Server
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
