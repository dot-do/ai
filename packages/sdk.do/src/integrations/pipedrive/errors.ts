/**
 * Pipedrive Errors
 *
 * Auto-generated error handling for Pipedrive Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/pipedrive
 */

/**
 * Error type enum
 */
export enum PipedriveErrorType {
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
 * Pipedrive Error class
 *
 * Custom error class for Pipedrive Integration operations.
 */
export class PipedriveError extends Error {
  public readonly code: string | number
  public readonly type: PipedriveErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: PipedriveErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'PipedriveError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PipedriveError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns PipedriveError instance
   */
  static fromError(error: any): PipedriveError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: PipedriveErrorType; retryable: boolean }> = {
      '401': { type: PipedriveErrorType.Authentication, retryable: false },
      '429': { type: PipedriveErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new PipedriveError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = PipedriveErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = PipedriveErrorType.Authentication
    } else if (statusCode === 403) {
      type = PipedriveErrorType.Authorization
    } else if (statusCode === 404) {
      type = PipedriveErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = PipedriveErrorType.Validation
    } else if (statusCode === 429) {
      type = PipedriveErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = PipedriveErrorType.Server
      retryable = true
    }

    return new PipedriveError(message, code, type, {
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
    return this.type === PipedriveErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === PipedriveErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === PipedriveErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === PipedriveErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === PipedriveErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === PipedriveErrorType.Server
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
