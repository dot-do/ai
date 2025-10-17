/**
 * Insighto ai Errors
 *
 * Auto-generated error handling for Insighto ai Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/insighto_ai
 */

/**
 * Error type enum
 */
export enum InsightoAiErrorType {
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
 * Insighto ai Error class
 *
 * Custom error class for Insighto ai Integration operations.
 */
export class InsightoAiError extends Error {
  public readonly code: string | number
  public readonly type: InsightoAiErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: InsightoAiErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'InsightoAiError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InsightoAiError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns InsightoAiError instance
   */
  static fromError(error: any): InsightoAiError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: InsightoAiErrorType; retryable: boolean }> = {
      '401': { type: InsightoAiErrorType.Authentication, retryable: false },
      '429': { type: InsightoAiErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new InsightoAiError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = InsightoAiErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = InsightoAiErrorType.Authentication
    } else if (statusCode === 403) {
      type = InsightoAiErrorType.Authorization
    } else if (statusCode === 404) {
      type = InsightoAiErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = InsightoAiErrorType.Validation
    } else if (statusCode === 429) {
      type = InsightoAiErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = InsightoAiErrorType.Server
      retryable = true
    }

    return new InsightoAiError(message, code, type, {
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
    return this.type === InsightoAiErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === InsightoAiErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === InsightoAiErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === InsightoAiErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === InsightoAiErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === InsightoAiErrorType.Server
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
