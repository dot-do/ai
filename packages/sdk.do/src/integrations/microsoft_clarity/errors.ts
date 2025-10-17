/**
 * Microsoft clarity Errors
 *
 * Auto-generated error handling for Microsoft clarity Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/microsoft_clarity
 */

/**
 * Error type enum
 */
export enum MicrosoftClarityErrorType {
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
 * Microsoft clarity Error class
 *
 * Custom error class for Microsoft clarity Integration operations.
 */
export class MicrosoftClarityError extends Error {
  public readonly code: string | number
  public readonly type: MicrosoftClarityErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: MicrosoftClarityErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'MicrosoftClarityError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MicrosoftClarityError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns MicrosoftClarityError instance
   */
  static fromError(error: any): MicrosoftClarityError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: MicrosoftClarityErrorType; retryable: boolean }> = {
      '401': { type: MicrosoftClarityErrorType.Authentication, retryable: false },
      '429': { type: MicrosoftClarityErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new MicrosoftClarityError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = MicrosoftClarityErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = MicrosoftClarityErrorType.Authentication
    } else if (statusCode === 403) {
      type = MicrosoftClarityErrorType.Authorization
    } else if (statusCode === 404) {
      type = MicrosoftClarityErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = MicrosoftClarityErrorType.Validation
    } else if (statusCode === 429) {
      type = MicrosoftClarityErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = MicrosoftClarityErrorType.Server
      retryable = true
    }

    return new MicrosoftClarityError(message, code, type, {
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
    return this.type === MicrosoftClarityErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === MicrosoftClarityErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === MicrosoftClarityErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === MicrosoftClarityErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === MicrosoftClarityErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === MicrosoftClarityErrorType.Server
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
