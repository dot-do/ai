/**
 * Digital ocean Errors
 *
 * Auto-generated error handling for Digital ocean Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/digital_ocean
 */

/**
 * Error type enum
 */
export enum DigitalOceanErrorType {
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
 * Digital ocean Error class
 *
 * Custom error class for Digital ocean Integration operations.
 */
export class DigitalOceanError extends Error {
  public readonly code: string | number
  public readonly type: DigitalOceanErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: DigitalOceanErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'DigitalOceanError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DigitalOceanError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns DigitalOceanError instance
   */
  static fromError(error: any): DigitalOceanError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: DigitalOceanErrorType; retryable: boolean }> = {
      '401': { type: DigitalOceanErrorType.Authentication, retryable: false },
      '429': { type: DigitalOceanErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new DigitalOceanError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = DigitalOceanErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = DigitalOceanErrorType.Authentication
    } else if (statusCode === 403) {
      type = DigitalOceanErrorType.Authorization
    } else if (statusCode === 404) {
      type = DigitalOceanErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = DigitalOceanErrorType.Validation
    } else if (statusCode === 429) {
      type = DigitalOceanErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = DigitalOceanErrorType.Server
      retryable = true
    }

    return new DigitalOceanError(message, code, type, {
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
    return this.type === DigitalOceanErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === DigitalOceanErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === DigitalOceanErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === DigitalOceanErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === DigitalOceanErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === DigitalOceanErrorType.Server
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
