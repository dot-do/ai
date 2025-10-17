/**
 * Mx technologies Errors
 *
 * Auto-generated error handling for Mx technologies Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/mx_technologies
 */

/**
 * Error type enum
 */
export enum MxTechnologiesErrorType {
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
 * Mx technologies Error class
 *
 * Custom error class for Mx technologies Integration operations.
 */
export class MxTechnologiesError extends Error {
  public readonly code: string | number
  public readonly type: MxTechnologiesErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: MxTechnologiesErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'MxTechnologiesError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MxTechnologiesError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns MxTechnologiesError instance
   */
  static fromError(error: any): MxTechnologiesError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: MxTechnologiesErrorType; retryable: boolean }> = {
      '401': { type: MxTechnologiesErrorType.Authentication, retryable: false },
      '429': { type: MxTechnologiesErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new MxTechnologiesError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = MxTechnologiesErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = MxTechnologiesErrorType.Authentication
    } else if (statusCode === 403) {
      type = MxTechnologiesErrorType.Authorization
    } else if (statusCode === 404) {
      type = MxTechnologiesErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = MxTechnologiesErrorType.Validation
    } else if (statusCode === 429) {
      type = MxTechnologiesErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = MxTechnologiesErrorType.Server
      retryable = true
    }

    return new MxTechnologiesError(message, code, type, {
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
    return this.type === MxTechnologiesErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === MxTechnologiesErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === MxTechnologiesErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === MxTechnologiesErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === MxTechnologiesErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === MxTechnologiesErrorType.Server
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
