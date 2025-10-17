/**
 * Twilio Errors
 *
 * Auto-generated error handling for Twilio Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/twilio
 */

/**
 * Error type enum
 */
export enum TwilioErrorType {
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
 * Twilio Error class
 *
 * Custom error class for Twilio Integration operations.
 */
export class TwilioError extends Error {
  public readonly code: string | number
  public readonly type: TwilioErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: TwilioErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'TwilioError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TwilioError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns TwilioError instance
   */
  static fromError(error: any): TwilioError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: TwilioErrorType; retryable: boolean }> = {
      '20003': { type: TwilioErrorType.Authentication, retryable: false },
      '20008': { type: TwilioErrorType.Authorization, retryable: false },
      '20009': { type: TwilioErrorType.Authorization, retryable: false },
      '21211': { type: TwilioErrorType.Validation, retryable: false },
      '21408': { type: TwilioErrorType.Authorization, retryable: false },
      '21604': { type: TwilioErrorType.Validation, retryable: false },
      '21606': { type: TwilioErrorType.NotFound, retryable: false },
      '21610': { type: TwilioErrorType.Validation, retryable: false },
      '21614': { type: TwilioErrorType.Validation, retryable: false },
      '30001': { type: TwilioErrorType.RateLimit, retryable: true },
      '30003': { type: TwilioErrorType.Validation, retryable: false },
      '30004': { type: TwilioErrorType.Validation, retryable: false },
      '30005': { type: TwilioErrorType.Validation, retryable: false },
      '30006': { type: TwilioErrorType.Validation, retryable: false },
      '30007': { type: TwilioErrorType.Validation, retryable: false },
      '30008': { type: TwilioErrorType.Server, retryable: true },
      '30009': { type: TwilioErrorType.Validation, retryable: false },
      '30010': { type: TwilioErrorType.Validation, retryable: false },
      '63003': { type: TwilioErrorType.Validation, retryable: false },
      '63004': { type: TwilioErrorType.Validation, retryable: false },
      '63005': { type: TwilioErrorType.RateLimit, retryable: false },
      '63006': { type: TwilioErrorType.RateLimit, retryable: false },
      '20429': { type: TwilioErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new TwilioError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = TwilioErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = TwilioErrorType.Authentication
    } else if (statusCode === 403) {
      type = TwilioErrorType.Authorization
    } else if (statusCode === 404) {
      type = TwilioErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = TwilioErrorType.Validation
    } else if (statusCode === 429) {
      type = TwilioErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = TwilioErrorType.Server
      retryable = true
    }

    return new TwilioError(message, code, type, {
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
    return this.type === TwilioErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === TwilioErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === TwilioErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === TwilioErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === TwilioErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === TwilioErrorType.Server
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
