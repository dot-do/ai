/**
 * Rev ai Errors
 *
 * Auto-generated error handling for Rev ai Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/rev_ai
 */

/**
 * Error type enum
 */
export enum RevAiErrorType {
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
 * Rev ai Error class
 *
 * Custom error class for Rev ai Integration operations.
 */
export class RevAiError extends Error {
  public readonly code: string | number
  public readonly type: RevAiErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: RevAiErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'RevAiError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RevAiError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns RevAiError instance
   */
  static fromError(error: any): RevAiError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: RevAiErrorType; retryable: boolean }> = {
      '401': { type: RevAiErrorType.Authentication, retryable: false },
      '429': { type: RevAiErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new RevAiError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = RevAiErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = RevAiErrorType.Authentication
    } else if (statusCode === 403) {
      type = RevAiErrorType.Authorization
    } else if (statusCode === 404) {
      type = RevAiErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = RevAiErrorType.Validation
    } else if (statusCode === 429) {
      type = RevAiErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = RevAiErrorType.Server
      retryable = true
    }

    return new RevAiError(message, code, type, {
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
    return this.type === RevAiErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === RevAiErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === RevAiErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === RevAiErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === RevAiErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === RevAiErrorType.Server
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
