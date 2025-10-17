/**
 * Docmosis Errors
 *
 * Auto-generated error handling for Docmosis Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/docmosis
 */

/**
 * Error type enum
 */
export enum DocmosisErrorType {
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
 * Docmosis Error class
 *
 * Custom error class for Docmosis Integration operations.
 */
export class DocmosisError extends Error {
  public readonly code: string | number
  public readonly type: DocmosisErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: DocmosisErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'DocmosisError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DocmosisError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns DocmosisError instance
   */
  static fromError(error: any): DocmosisError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: DocmosisErrorType; retryable: boolean }> = {
      '401': { type: DocmosisErrorType.Authentication, retryable: false },
      '429': { type: DocmosisErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new DocmosisError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = DocmosisErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = DocmosisErrorType.Authentication
    } else if (statusCode === 403) {
      type = DocmosisErrorType.Authorization
    } else if (statusCode === 404) {
      type = DocmosisErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = DocmosisErrorType.Validation
    } else if (statusCode === 429) {
      type = DocmosisErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = DocmosisErrorType.Server
      retryable = true
    }

    return new DocmosisError(message, code, type, {
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
    return this.type === DocmosisErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === DocmosisErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === DocmosisErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === DocmosisErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === DocmosisErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === DocmosisErrorType.Server
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
