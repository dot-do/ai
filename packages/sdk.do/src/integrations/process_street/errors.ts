/**
 * Process street Errors
 *
 * Auto-generated error handling for Process street Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/process_street
 */

/**
 * Error type enum
 */
export enum ProcessStreetErrorType {
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
 * Process street Error class
 *
 * Custom error class for Process street Integration operations.
 */
export class ProcessStreetError extends Error {
  public readonly code: string | number
  public readonly type: ProcessStreetErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ProcessStreetErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ProcessStreetError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ProcessStreetError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ProcessStreetError instance
   */
  static fromError(error: any): ProcessStreetError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ProcessStreetErrorType; retryable: boolean }> = {
      '401': { type: ProcessStreetErrorType.Authentication, retryable: false },
      '429': { type: ProcessStreetErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ProcessStreetError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ProcessStreetErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ProcessStreetErrorType.Authentication
    } else if (statusCode === 403) {
      type = ProcessStreetErrorType.Authorization
    } else if (statusCode === 404) {
      type = ProcessStreetErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ProcessStreetErrorType.Validation
    } else if (statusCode === 429) {
      type = ProcessStreetErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ProcessStreetErrorType.Server
      retryable = true
    }

    return new ProcessStreetError(message, code, type, {
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
    return this.type === ProcessStreetErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ProcessStreetErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ProcessStreetErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ProcessStreetErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ProcessStreetErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ProcessStreetErrorType.Server
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
