/**
 * Eventzilla Errors
 *
 * Auto-generated error handling for Eventzilla Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/eventzilla
 */

/**
 * Error type enum
 */
export enum EventzillaErrorType {
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
 * Eventzilla Error class
 *
 * Custom error class for Eventzilla Integration operations.
 */
export class EventzillaError extends Error {
  public readonly code: string | number
  public readonly type: EventzillaErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: EventzillaErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'EventzillaError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, EventzillaError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns EventzillaError instance
   */
  static fromError(error: any): EventzillaError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: EventzillaErrorType; retryable: boolean }> = {
      '401': { type: EventzillaErrorType.Authentication, retryable: false },
      '429': { type: EventzillaErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new EventzillaError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = EventzillaErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = EventzillaErrorType.Authentication
    } else if (statusCode === 403) {
      type = EventzillaErrorType.Authorization
    } else if (statusCode === 404) {
      type = EventzillaErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = EventzillaErrorType.Validation
    } else if (statusCode === 429) {
      type = EventzillaErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = EventzillaErrorType.Server
      retryable = true
    }

    return new EventzillaError(message, code, type, {
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
    return this.type === EventzillaErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === EventzillaErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === EventzillaErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === EventzillaErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === EventzillaErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === EventzillaErrorType.Server
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
