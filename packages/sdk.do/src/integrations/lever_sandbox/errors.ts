/**
 * Lever sandbox Errors
 *
 * Auto-generated error handling for Lever sandbox Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/lever_sandbox
 */

/**
 * Error type enum
 */
export enum LeverSandboxErrorType {
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
 * Lever sandbox Error class
 *
 * Custom error class for Lever sandbox Integration operations.
 */
export class LeverSandboxError extends Error {
  public readonly code: string | number
  public readonly type: LeverSandboxErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: LeverSandboxErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'LeverSandboxError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, LeverSandboxError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns LeverSandboxError instance
   */
  static fromError(error: any): LeverSandboxError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: LeverSandboxErrorType; retryable: boolean }> = {
      '401': { type: LeverSandboxErrorType.Authentication, retryable: false },
      '429': { type: LeverSandboxErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new LeverSandboxError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = LeverSandboxErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = LeverSandboxErrorType.Authentication
    } else if (statusCode === 403) {
      type = LeverSandboxErrorType.Authorization
    } else if (statusCode === 404) {
      type = LeverSandboxErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = LeverSandboxErrorType.Validation
    } else if (statusCode === 429) {
      type = LeverSandboxErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = LeverSandboxErrorType.Server
      retryable = true
    }

    return new LeverSandboxError(message, code, type, {
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
    return this.type === LeverSandboxErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === LeverSandboxErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === LeverSandboxErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === LeverSandboxErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === LeverSandboxErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === LeverSandboxErrorType.Server
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
