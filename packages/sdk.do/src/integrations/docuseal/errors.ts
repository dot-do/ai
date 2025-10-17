/**
 * Docuseal Errors
 *
 * Auto-generated error handling for Docuseal Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/docuseal
 */

/**
 * Error type enum
 */
export enum DocusealErrorType {
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
 * Docuseal Error class
 *
 * Custom error class for Docuseal Integration operations.
 */
export class DocusealError extends Error {
  public readonly code: string | number
  public readonly type: DocusealErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: DocusealErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'DocusealError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DocusealError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns DocusealError instance
   */
  static fromError(error: any): DocusealError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: DocusealErrorType; retryable: boolean }> = {
      '401': { type: DocusealErrorType.Authentication, retryable: false },
      '429': { type: DocusealErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new DocusealError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = DocusealErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = DocusealErrorType.Authentication
    } else if (statusCode === 403) {
      type = DocusealErrorType.Authorization
    } else if (statusCode === 404) {
      type = DocusealErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = DocusealErrorType.Validation
    } else if (statusCode === 429) {
      type = DocusealErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = DocusealErrorType.Server
      retryable = true
    }

    return new DocusealError(message, code, type, {
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
    return this.type === DocusealErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === DocusealErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === DocusealErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === DocusealErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === DocusealErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === DocusealErrorType.Server
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
