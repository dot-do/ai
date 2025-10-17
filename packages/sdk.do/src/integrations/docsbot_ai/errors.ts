/**
 * Docsbot ai Errors
 *
 * Auto-generated error handling for Docsbot ai Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/docsbot_ai
 */

/**
 * Error type enum
 */
export enum DocsbotAiErrorType {
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
 * Docsbot ai Error class
 *
 * Custom error class for Docsbot ai Integration operations.
 */
export class DocsbotAiError extends Error {
  public readonly code: string | number
  public readonly type: DocsbotAiErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: DocsbotAiErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'DocsbotAiError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DocsbotAiError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns DocsbotAiError instance
   */
  static fromError(error: any): DocsbotAiError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: DocsbotAiErrorType; retryable: boolean }> = {
      '401': { type: DocsbotAiErrorType.Authentication, retryable: false },
      '429': { type: DocsbotAiErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new DocsbotAiError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = DocsbotAiErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = DocsbotAiErrorType.Authentication
    } else if (statusCode === 403) {
      type = DocsbotAiErrorType.Authorization
    } else if (statusCode === 404) {
      type = DocsbotAiErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = DocsbotAiErrorType.Validation
    } else if (statusCode === 429) {
      type = DocsbotAiErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = DocsbotAiErrorType.Server
      retryable = true
    }

    return new DocsbotAiError(message, code, type, {
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
    return this.type === DocsbotAiErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === DocsbotAiErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === DocsbotAiErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === DocsbotAiErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === DocsbotAiErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === DocsbotAiErrorType.Server
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
