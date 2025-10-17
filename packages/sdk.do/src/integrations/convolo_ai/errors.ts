/**
 * Convolo ai Errors
 *
 * Auto-generated error handling for Convolo ai Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/convolo_ai
 */

/**
 * Error type enum
 */
export enum ConvoloAiErrorType {
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
 * Convolo ai Error class
 *
 * Custom error class for Convolo ai Integration operations.
 */
export class ConvoloAiError extends Error {
  public readonly code: string | number
  public readonly type: ConvoloAiErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ConvoloAiErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ConvoloAiError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ConvoloAiError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ConvoloAiError instance
   */
  static fromError(error: any): ConvoloAiError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ConvoloAiErrorType; retryable: boolean }> = {
      '401': { type: ConvoloAiErrorType.Authentication, retryable: false },
      '429': { type: ConvoloAiErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ConvoloAiError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ConvoloAiErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ConvoloAiErrorType.Authentication
    } else if (statusCode === 403) {
      type = ConvoloAiErrorType.Authorization
    } else if (statusCode === 404) {
      type = ConvoloAiErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ConvoloAiErrorType.Validation
    } else if (statusCode === 429) {
      type = ConvoloAiErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ConvoloAiErrorType.Server
      retryable = true
    }

    return new ConvoloAiError(message, code, type, {
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
    return this.type === ConvoloAiErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ConvoloAiErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ConvoloAiErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ConvoloAiErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ConvoloAiErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ConvoloAiErrorType.Server
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
