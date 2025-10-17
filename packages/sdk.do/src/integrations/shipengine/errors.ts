/**
 * Shipengine Errors
 *
 * Auto-generated error handling for Shipengine Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/shipengine
 */

/**
 * Error type enum
 */
export enum ShipengineErrorType {
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
 * Shipengine Error class
 *
 * Custom error class for Shipengine Integration operations.
 */
export class ShipengineError extends Error {
  public readonly code: string | number
  public readonly type: ShipengineErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ShipengineErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ShipengineError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ShipengineError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ShipengineError instance
   */
  static fromError(error: any): ShipengineError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ShipengineErrorType; retryable: boolean }> = {
      '401': { type: ShipengineErrorType.Authentication, retryable: false },
      '429': { type: ShipengineErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ShipengineError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ShipengineErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ShipengineErrorType.Authentication
    } else if (statusCode === 403) {
      type = ShipengineErrorType.Authorization
    } else if (statusCode === 404) {
      type = ShipengineErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ShipengineErrorType.Validation
    } else if (statusCode === 429) {
      type = ShipengineErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ShipengineErrorType.Server
      retryable = true
    }

    return new ShipengineError(message, code, type, {
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
    return this.type === ShipengineErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ShipengineErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ShipengineErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ShipengineErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ShipengineErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ShipengineErrorType.Server
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
