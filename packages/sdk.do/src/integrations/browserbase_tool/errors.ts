/**
 * Browserbase tool Errors
 *
 * Auto-generated error handling for Browserbase tool Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/browserbase_tool
 */

/**
 * Error type enum
 */
export enum BrowserbaseToolErrorType {
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
 * Browserbase tool Error class
 *
 * Custom error class for Browserbase tool Integration operations.
 */
export class BrowserbaseToolError extends Error {
  public readonly code: string | number
  public readonly type: BrowserbaseToolErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: BrowserbaseToolErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'BrowserbaseToolError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BrowserbaseToolError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns BrowserbaseToolError instance
   */
  static fromError(error: any): BrowserbaseToolError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: BrowserbaseToolErrorType; retryable: boolean }> = {
      '401': { type: BrowserbaseToolErrorType.Authentication, retryable: false },
      '429': { type: BrowserbaseToolErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new BrowserbaseToolError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = BrowserbaseToolErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = BrowserbaseToolErrorType.Authentication
    } else if (statusCode === 403) {
      type = BrowserbaseToolErrorType.Authorization
    } else if (statusCode === 404) {
      type = BrowserbaseToolErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = BrowserbaseToolErrorType.Validation
    } else if (statusCode === 429) {
      type = BrowserbaseToolErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = BrowserbaseToolErrorType.Server
      retryable = true
    }

    return new BrowserbaseToolError(message, code, type, {
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
    return this.type === BrowserbaseToolErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === BrowserbaseToolErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === BrowserbaseToolErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === BrowserbaseToolErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === BrowserbaseToolErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === BrowserbaseToolErrorType.Server
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
