/**
 * Virustotal Errors
 *
 * Auto-generated error handling for Virustotal Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/virustotal
 */

/**
 * Error type enum
 */
export enum VirustotalErrorType {
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
 * Virustotal Error class
 *
 * Custom error class for Virustotal Integration operations.
 */
export class VirustotalError extends Error {
  public readonly code: string | number
  public readonly type: VirustotalErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: VirustotalErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'VirustotalError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, VirustotalError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns VirustotalError instance
   */
  static fromError(error: any): VirustotalError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: VirustotalErrorType; retryable: boolean }> = {
      '401': { type: VirustotalErrorType.Authentication, retryable: false },
      '429': { type: VirustotalErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new VirustotalError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = VirustotalErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = VirustotalErrorType.Authentication
    } else if (statusCode === 403) {
      type = VirustotalErrorType.Authorization
    } else if (statusCode === 404) {
      type = VirustotalErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = VirustotalErrorType.Validation
    } else if (statusCode === 429) {
      type = VirustotalErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = VirustotalErrorType.Server
      retryable = true
    }

    return new VirustotalError(message, code, type, {
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
    return this.type === VirustotalErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === VirustotalErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === VirustotalErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === VirustotalErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === VirustotalErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === VirustotalErrorType.Server
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
