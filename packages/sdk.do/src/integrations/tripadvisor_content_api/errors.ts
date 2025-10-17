/**
 * Tripadvisor content api Errors
 *
 * Auto-generated error handling for Tripadvisor content api Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/tripadvisor_content_api
 */

/**
 * Error type enum
 */
export enum TripadvisorContentApiErrorType {
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
 * Tripadvisor content api Error class
 *
 * Custom error class for Tripadvisor content api Integration operations.
 */
export class TripadvisorContentApiError extends Error {
  public readonly code: string | number
  public readonly type: TripadvisorContentApiErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: TripadvisorContentApiErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'TripadvisorContentApiError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TripadvisorContentApiError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns TripadvisorContentApiError instance
   */
  static fromError(error: any): TripadvisorContentApiError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: TripadvisorContentApiErrorType; retryable: boolean }> = {
      '401': { type: TripadvisorContentApiErrorType.Authentication, retryable: false },
      '429': { type: TripadvisorContentApiErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new TripadvisorContentApiError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = TripadvisorContentApiErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = TripadvisorContentApiErrorType.Authentication
    } else if (statusCode === 403) {
      type = TripadvisorContentApiErrorType.Authorization
    } else if (statusCode === 404) {
      type = TripadvisorContentApiErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = TripadvisorContentApiErrorType.Validation
    } else if (statusCode === 429) {
      type = TripadvisorContentApiErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = TripadvisorContentApiErrorType.Server
      retryable = true
    }

    return new TripadvisorContentApiError(message, code, type, {
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
    return this.type === TripadvisorContentApiErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === TripadvisorContentApiErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === TripadvisorContentApiErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === TripadvisorContentApiErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === TripadvisorContentApiErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === TripadvisorContentApiErrorType.Server
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
