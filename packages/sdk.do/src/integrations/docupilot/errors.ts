/**
 * Docupilot Errors
 *
 * Auto-generated error handling for Docupilot Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/docupilot
 */

/**
 * Error type enum
 */
export enum DocupilotErrorType {
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
 * Docupilot Error class
 *
 * Custom error class for Docupilot Integration operations.
 */
export class DocupilotError extends Error {
  public readonly code: string | number
  public readonly type: DocupilotErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: DocupilotErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'DocupilotError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DocupilotError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns DocupilotError instance
   */
  static fromError(error: any): DocupilotError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: DocupilotErrorType; retryable: boolean }> = {
      '401': { type: DocupilotErrorType.Authentication, retryable: false },
      '429': { type: DocupilotErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new DocupilotError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = DocupilotErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = DocupilotErrorType.Authentication
    } else if (statusCode === 403) {
      type = DocupilotErrorType.Authorization
    } else if (statusCode === 404) {
      type = DocupilotErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = DocupilotErrorType.Validation
    } else if (statusCode === 429) {
      type = DocupilotErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = DocupilotErrorType.Server
      retryable = true
    }

    return new DocupilotError(message, code, type, {
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
    return this.type === DocupilotErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === DocupilotErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === DocupilotErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === DocupilotErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === DocupilotErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === DocupilotErrorType.Server
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
