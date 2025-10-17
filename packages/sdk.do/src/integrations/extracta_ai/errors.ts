/**
 * Extracta ai Errors
 *
 * Auto-generated error handling for Extracta ai Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/extracta_ai
 */

/**
 * Error type enum
 */
export enum ExtractaAiErrorType {
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
 * Extracta ai Error class
 *
 * Custom error class for Extracta ai Integration operations.
 */
export class ExtractaAiError extends Error {
  public readonly code: string | number
  public readonly type: ExtractaAiErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ExtractaAiErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ExtractaAiError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ExtractaAiError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ExtractaAiError instance
   */
  static fromError(error: any): ExtractaAiError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ExtractaAiErrorType; retryable: boolean }> = {
      '401': { type: ExtractaAiErrorType.Authentication, retryable: false },
      '429': { type: ExtractaAiErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ExtractaAiError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ExtractaAiErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ExtractaAiErrorType.Authentication
    } else if (statusCode === 403) {
      type = ExtractaAiErrorType.Authorization
    } else if (statusCode === 404) {
      type = ExtractaAiErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ExtractaAiErrorType.Validation
    } else if (statusCode === 429) {
      type = ExtractaAiErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ExtractaAiErrorType.Server
      retryable = true
    }

    return new ExtractaAiError(message, code, type, {
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
    return this.type === ExtractaAiErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ExtractaAiErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ExtractaAiErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ExtractaAiErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ExtractaAiErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ExtractaAiErrorType.Server
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
