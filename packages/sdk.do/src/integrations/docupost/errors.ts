/**
 * Docupost Errors
 *
 * Auto-generated error handling for Docupost Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/docupost
 */

/**
 * Error type enum
 */
export enum DocupostErrorType {
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
 * Docupost Error class
 *
 * Custom error class for Docupost Integration operations.
 */
export class DocupostError extends Error {
  public readonly code: string | number
  public readonly type: DocupostErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: DocupostErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'DocupostError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DocupostError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns DocupostError instance
   */
  static fromError(error: any): DocupostError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: DocupostErrorType; retryable: boolean }> = {
      '401': { type: DocupostErrorType.Authentication, retryable: false },
      '429': { type: DocupostErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new DocupostError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = DocupostErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = DocupostErrorType.Authentication
    } else if (statusCode === 403) {
      type = DocupostErrorType.Authorization
    } else if (statusCode === 404) {
      type = DocupostErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = DocupostErrorType.Validation
    } else if (statusCode === 429) {
      type = DocupostErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = DocupostErrorType.Server
      retryable = true
    }

    return new DocupostError(message, code, type, {
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
    return this.type === DocupostErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === DocupostErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === DocupostErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === DocupostErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === DocupostErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === DocupostErrorType.Server
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
