/**
 * Jira Errors
 *
 * Auto-generated error handling for Jira Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/jira
 */

/**
 * Error type enum
 */
export enum JiraErrorType {
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
 * Jira Error class
 *
 * Custom error class for Jira Integration operations.
 */
export class JiraError extends Error {
  public readonly code: string | number
  public readonly type: JiraErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: JiraErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'JiraError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, JiraError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns JiraError instance
   */
  static fromError(error: any): JiraError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: JiraErrorType; retryable: boolean }> = {
      '401': { type: JiraErrorType.Authentication, retryable: false },
      '403': { type: JiraErrorType.Authorization, retryable: false },
      '404': { type: JiraErrorType.NotFound, retryable: false },
      '400': { type: JiraErrorType.Validation, retryable: false },
      '429': { type: JiraErrorType.RateLimit, retryable: true },
      '500': { type: JiraErrorType.Server, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new JiraError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = JiraErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = JiraErrorType.Authentication
    } else if (statusCode === 403) {
      type = JiraErrorType.Authorization
    } else if (statusCode === 404) {
      type = JiraErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = JiraErrorType.Validation
    } else if (statusCode === 429) {
      type = JiraErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = JiraErrorType.Server
      retryable = true
    }

    return new JiraError(message, code, type, {
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
    return this.type === JiraErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === JiraErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === JiraErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === JiraErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === JiraErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === JiraErrorType.Server
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
