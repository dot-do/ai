/**
 * Alttext ai Errors
 *
 * Auto-generated error handling for Alttext ai Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/alttext_ai
 */

/**
 * Error type enum
 */
export enum AlttextAiErrorType {
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
 * Alttext ai Error class
 *
 * Custom error class for Alttext ai Integration operations.
 */
export class AlttextAiError extends Error {
  public readonly code: string | number
  public readonly type: AlttextAiErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: AlttextAiErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'AlttextAiError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AlttextAiError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns AlttextAiError instance
   */
  static fromError(error: any): AlttextAiError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: AlttextAiErrorType; retryable: boolean }> = {
      '401': { type: AlttextAiErrorType.Authentication, retryable: false },
      '429': { type: AlttextAiErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new AlttextAiError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = AlttextAiErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = AlttextAiErrorType.Authentication
    } else if (statusCode === 403) {
      type = AlttextAiErrorType.Authorization
    } else if (statusCode === 404) {
      type = AlttextAiErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = AlttextAiErrorType.Validation
    } else if (statusCode === 429) {
      type = AlttextAiErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = AlttextAiErrorType.Server
      retryable = true
    }

    return new AlttextAiError(message, code, type, {
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
    return this.type === AlttextAiErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === AlttextAiErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === AlttextAiErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === AlttextAiErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === AlttextAiErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === AlttextAiErrorType.Server
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
