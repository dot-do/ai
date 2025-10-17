/**
 * Optimoroute Errors
 *
 * Auto-generated error handling for Optimoroute Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/optimoroute
 */

/**
 * Error type enum
 */
export enum OptimorouteErrorType {
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
 * Optimoroute Error class
 *
 * Custom error class for Optimoroute Integration operations.
 */
export class OptimorouteError extends Error {
  public readonly code: string | number
  public readonly type: OptimorouteErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: OptimorouteErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'OptimorouteError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, OptimorouteError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns OptimorouteError instance
   */
  static fromError(error: any): OptimorouteError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: OptimorouteErrorType; retryable: boolean }> = {
      '401': { type: OptimorouteErrorType.Authentication, retryable: false },
      '429': { type: OptimorouteErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new OptimorouteError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = OptimorouteErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = OptimorouteErrorType.Authentication
    } else if (statusCode === 403) {
      type = OptimorouteErrorType.Authorization
    } else if (statusCode === 404) {
      type = OptimorouteErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = OptimorouteErrorType.Validation
    } else if (statusCode === 429) {
      type = OptimorouteErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = OptimorouteErrorType.Server
      retryable = true
    }

    return new OptimorouteError(message, code, type, {
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
    return this.type === OptimorouteErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === OptimorouteErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === OptimorouteErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === OptimorouteErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === OptimorouteErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === OptimorouteErrorType.Server
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
