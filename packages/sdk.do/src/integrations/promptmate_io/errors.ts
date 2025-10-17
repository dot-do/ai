/**
 * Promptmate io Errors
 *
 * Auto-generated error handling for Promptmate io Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/promptmate_io
 */

/**
 * Error type enum
 */
export enum PromptmateIoErrorType {
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
 * Promptmate io Error class
 *
 * Custom error class for Promptmate io Integration operations.
 */
export class PromptmateIoError extends Error {
  public readonly code: string | number
  public readonly type: PromptmateIoErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: PromptmateIoErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'PromptmateIoError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PromptmateIoError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns PromptmateIoError instance
   */
  static fromError(error: any): PromptmateIoError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: PromptmateIoErrorType; retryable: boolean }> = {
      '401': { type: PromptmateIoErrorType.Authentication, retryable: false },
      '429': { type: PromptmateIoErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new PromptmateIoError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = PromptmateIoErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = PromptmateIoErrorType.Authentication
    } else if (statusCode === 403) {
      type = PromptmateIoErrorType.Authorization
    } else if (statusCode === 404) {
      type = PromptmateIoErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = PromptmateIoErrorType.Validation
    } else if (statusCode === 429) {
      type = PromptmateIoErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = PromptmateIoErrorType.Server
      retryable = true
    }

    return new PromptmateIoError(message, code, type, {
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
    return this.type === PromptmateIoErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === PromptmateIoErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === PromptmateIoErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === PromptmateIoErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === PromptmateIoErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === PromptmateIoErrorType.Server
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
