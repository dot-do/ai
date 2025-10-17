/**
 * Capsule crm Errors
 *
 * Auto-generated error handling for Capsule crm Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/capsule_crm
 */

/**
 * Error type enum
 */
export enum CapsuleCrmErrorType {
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
 * Capsule crm Error class
 *
 * Custom error class for Capsule crm Integration operations.
 */
export class CapsuleCrmError extends Error {
  public readonly code: string | number
  public readonly type: CapsuleCrmErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: CapsuleCrmErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'CapsuleCrmError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CapsuleCrmError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns CapsuleCrmError instance
   */
  static fromError(error: any): CapsuleCrmError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: CapsuleCrmErrorType; retryable: boolean }> = {
      '401': { type: CapsuleCrmErrorType.Authentication, retryable: false },
      '429': { type: CapsuleCrmErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new CapsuleCrmError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = CapsuleCrmErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = CapsuleCrmErrorType.Authentication
    } else if (statusCode === 403) {
      type = CapsuleCrmErrorType.Authorization
    } else if (statusCode === 404) {
      type = CapsuleCrmErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = CapsuleCrmErrorType.Validation
    } else if (statusCode === 429) {
      type = CapsuleCrmErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = CapsuleCrmErrorType.Server
      retryable = true
    }

    return new CapsuleCrmError(message, code, type, {
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
    return this.type === CapsuleCrmErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === CapsuleCrmErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === CapsuleCrmErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === CapsuleCrmErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === CapsuleCrmErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === CapsuleCrmErrorType.Server
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
