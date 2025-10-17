/**
 * Apipie ai Errors
 *
 * Auto-generated error handling for Apipie ai Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/apipie_ai
 */

/**
 * Error type enum
 */
export enum ApipieAiErrorType {
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
 * Apipie ai Error class
 *
 * Custom error class for Apipie ai Integration operations.
 */
export class ApipieAiError extends Error {
  public readonly code: string | number
  public readonly type: ApipieAiErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ApipieAiErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ApipieAiError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApipieAiError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ApipieAiError instance
   */
  static fromError(error: any): ApipieAiError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ApipieAiErrorType; retryable: boolean }> = {
      '401': { type: ApipieAiErrorType.Authentication, retryable: false },
      '429': { type: ApipieAiErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ApipieAiError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ApipieAiErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ApipieAiErrorType.Authentication
    } else if (statusCode === 403) {
      type = ApipieAiErrorType.Authorization
    } else if (statusCode === 404) {
      type = ApipieAiErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ApipieAiErrorType.Validation
    } else if (statusCode === 429) {
      type = ApipieAiErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ApipieAiErrorType.Server
      retryable = true
    }

    return new ApipieAiError(message, code, type, {
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
    return this.type === ApipieAiErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ApipieAiErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ApipieAiErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ApipieAiErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ApipieAiErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ApipieAiErrorType.Server
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
