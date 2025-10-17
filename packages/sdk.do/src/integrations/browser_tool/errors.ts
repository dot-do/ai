/**
 * Browser tool Errors
 *
 * Auto-generated error handling for Browser tool Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/browser_tool
 */

/**
 * Error type enum
 */
export enum BrowserToolErrorType {
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
 * Browser tool Error class
 *
 * Custom error class for Browser tool Integration operations.
 */
export class BrowserToolError extends Error {
  public readonly code: string | number
  public readonly type: BrowserToolErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: BrowserToolErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'BrowserToolError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BrowserToolError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns BrowserToolError instance
   */
  static fromError(error: any): BrowserToolError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: BrowserToolErrorType; retryable: boolean }> = {
      '401': { type: BrowserToolErrorType.Authentication, retryable: false },
      '429': { type: BrowserToolErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new BrowserToolError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = BrowserToolErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = BrowserToolErrorType.Authentication
    } else if (statusCode === 403) {
      type = BrowserToolErrorType.Authorization
    } else if (statusCode === 404) {
      type = BrowserToolErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = BrowserToolErrorType.Validation
    } else if (statusCode === 429) {
      type = BrowserToolErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = BrowserToolErrorType.Server
      retryable = true
    }

    return new BrowserToolError(message, code, type, {
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
    return this.type === BrowserToolErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === BrowserToolErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === BrowserToolErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === BrowserToolErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === BrowserToolErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === BrowserToolErrorType.Server
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
