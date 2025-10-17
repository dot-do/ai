/**
 * Mx toolbox Errors
 *
 * Auto-generated error handling for Mx toolbox Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/mx_toolbox
 */

/**
 * Error type enum
 */
export enum MxToolboxErrorType {
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
 * Mx toolbox Error class
 *
 * Custom error class for Mx toolbox Integration operations.
 */
export class MxToolboxError extends Error {
  public readonly code: string | number
  public readonly type: MxToolboxErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: MxToolboxErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'MxToolboxError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MxToolboxError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns MxToolboxError instance
   */
  static fromError(error: any): MxToolboxError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: MxToolboxErrorType; retryable: boolean }> = {
      '401': { type: MxToolboxErrorType.Authentication, retryable: false },
      '429': { type: MxToolboxErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new MxToolboxError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = MxToolboxErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = MxToolboxErrorType.Authentication
    } else if (statusCode === 403) {
      type = MxToolboxErrorType.Authorization
    } else if (statusCode === 404) {
      type = MxToolboxErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = MxToolboxErrorType.Validation
    } else if (statusCode === 429) {
      type = MxToolboxErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = MxToolboxErrorType.Server
      retryable = true
    }

    return new MxToolboxError(message, code, type, {
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
    return this.type === MxToolboxErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === MxToolboxErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === MxToolboxErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === MxToolboxErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === MxToolboxErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === MxToolboxErrorType.Server
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
