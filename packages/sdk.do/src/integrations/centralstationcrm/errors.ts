/**
 * Centralstationcrm Errors
 *
 * Auto-generated error handling for Centralstationcrm Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/centralstationcrm
 */

/**
 * Error type enum
 */
export enum CentralstationcrmErrorType {
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
 * Centralstationcrm Error class
 *
 * Custom error class for Centralstationcrm Integration operations.
 */
export class CentralstationcrmError extends Error {
  public readonly code: string | number
  public readonly type: CentralstationcrmErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: CentralstationcrmErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'CentralstationcrmError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CentralstationcrmError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns CentralstationcrmError instance
   */
  static fromError(error: any): CentralstationcrmError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: CentralstationcrmErrorType; retryable: boolean }> = {
      '401': { type: CentralstationcrmErrorType.Authentication, retryable: false },
      '429': { type: CentralstationcrmErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new CentralstationcrmError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = CentralstationcrmErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = CentralstationcrmErrorType.Authentication
    } else if (statusCode === 403) {
      type = CentralstationcrmErrorType.Authorization
    } else if (statusCode === 404) {
      type = CentralstationcrmErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = CentralstationcrmErrorType.Validation
    } else if (statusCode === 429) {
      type = CentralstationcrmErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = CentralstationcrmErrorType.Server
      retryable = true
    }

    return new CentralstationcrmError(message, code, type, {
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
    return this.type === CentralstationcrmErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === CentralstationcrmErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === CentralstationcrmErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === CentralstationcrmErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === CentralstationcrmErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === CentralstationcrmErrorType.Server
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
