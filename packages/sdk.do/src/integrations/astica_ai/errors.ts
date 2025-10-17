/**
 * Astica ai Errors
 *
 * Auto-generated error handling for Astica ai Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/astica_ai
 */

/**
 * Error type enum
 */
export enum AsticaAiErrorType {
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
 * Astica ai Error class
 *
 * Custom error class for Astica ai Integration operations.
 */
export class AsticaAiError extends Error {
  public readonly code: string | number
  public readonly type: AsticaAiErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: AsticaAiErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'AsticaAiError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AsticaAiError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns AsticaAiError instance
   */
  static fromError(error: any): AsticaAiError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: AsticaAiErrorType; retryable: boolean }> = {
      '401': { type: AsticaAiErrorType.Authentication, retryable: false },
      '429': { type: AsticaAiErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new AsticaAiError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = AsticaAiErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = AsticaAiErrorType.Authentication
    } else if (statusCode === 403) {
      type = AsticaAiErrorType.Authorization
    } else if (statusCode === 404) {
      type = AsticaAiErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = AsticaAiErrorType.Validation
    } else if (statusCode === 429) {
      type = AsticaAiErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = AsticaAiErrorType.Server
      retryable = true
    }

    return new AsticaAiError(message, code, type, {
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
    return this.type === AsticaAiErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === AsticaAiErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === AsticaAiErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === AsticaAiErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === AsticaAiErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === AsticaAiErrorType.Server
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
