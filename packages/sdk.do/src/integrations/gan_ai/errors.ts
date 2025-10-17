/**
 * Gan ai Errors
 *
 * Auto-generated error handling for Gan ai Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/gan_ai
 */

/**
 * Error type enum
 */
export enum GanAiErrorType {
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
 * Gan ai Error class
 *
 * Custom error class for Gan ai Integration operations.
 */
export class GanAiError extends Error {
  public readonly code: string | number
  public readonly type: GanAiErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: GanAiErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'GanAiError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GanAiError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns GanAiError instance
   */
  static fromError(error: any): GanAiError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: GanAiErrorType; retryable: boolean }> = {
      '401': { type: GanAiErrorType.Authentication, retryable: false },
      '429': { type: GanAiErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new GanAiError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = GanAiErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = GanAiErrorType.Authentication
    } else if (statusCode === 403) {
      type = GanAiErrorType.Authorization
    } else if (statusCode === 404) {
      type = GanAiErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = GanAiErrorType.Validation
    } else if (statusCode === 429) {
      type = GanAiErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = GanAiErrorType.Server
      retryable = true
    }

    return new GanAiError(message, code, type, {
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
    return this.type === GanAiErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === GanAiErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === GanAiErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === GanAiErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === GanAiErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === GanAiErrorType.Server
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
