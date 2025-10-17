/**
 * Test app Errors
 *
 * Auto-generated error handling for Test app Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/test_app
 */

/**
 * Error type enum
 */
export enum TestAppErrorType {
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
 * Test app Error class
 *
 * Custom error class for Test app Integration operations.
 */
export class TestAppError extends Error {
  public readonly code: string | number
  public readonly type: TestAppErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: TestAppErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'TestAppError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TestAppError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns TestAppError instance
   */
  static fromError(error: any): TestAppError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: TestAppErrorType; retryable: boolean }> = {
      '401': { type: TestAppErrorType.Authentication, retryable: false },
      '429': { type: TestAppErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new TestAppError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = TestAppErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = TestAppErrorType.Authentication
    } else if (statusCode === 403) {
      type = TestAppErrorType.Authorization
    } else if (statusCode === 404) {
      type = TestAppErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = TestAppErrorType.Validation
    } else if (statusCode === 429) {
      type = TestAppErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = TestAppErrorType.Server
      retryable = true
    }

    return new TestAppError(message, code, type, {
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
    return this.type === TestAppErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === TestAppErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === TestAppErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === TestAppErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === TestAppErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === TestAppErrorType.Server
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
