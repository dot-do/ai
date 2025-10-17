/**
 * Addresszen Errors
 *
 * Auto-generated error handling for Addresszen Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/addresszen
 */

/**
 * Error type enum
 */
export enum AddresszenErrorType {
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
 * Addresszen Error class
 *
 * Custom error class for Addresszen Integration operations.
 */
export class AddresszenError extends Error {
  public readonly code: string | number
  public readonly type: AddresszenErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: AddresszenErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'AddresszenError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AddresszenError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns AddresszenError instance
   */
  static fromError(error: any): AddresszenError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: AddresszenErrorType; retryable: boolean }> = {
      '401': { type: AddresszenErrorType.Authentication, retryable: false },
      '429': { type: AddresszenErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new AddresszenError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = AddresszenErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = AddresszenErrorType.Authentication
    } else if (statusCode === 403) {
      type = AddresszenErrorType.Authorization
    } else if (statusCode === 404) {
      type = AddresszenErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = AddresszenErrorType.Validation
    } else if (statusCode === 429) {
      type = AddresszenErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = AddresszenErrorType.Server
      retryable = true
    }

    return new AddresszenError(message, code, type, {
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
    return this.type === AddresszenErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === AddresszenErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === AddresszenErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === AddresszenErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === AddresszenErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === AddresszenErrorType.Server
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
