/**
 * Airtable Errors
 *
 * Auto-generated error handling for Airtable Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/airtable
 */

/**
 * Error type enum
 */
export enum AirtableErrorType {
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
 * Airtable Error class
 *
 * Custom error class for Airtable Integration operations.
 */
export class AirtableError extends Error {
  public readonly code: string | number
  public readonly type: AirtableErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: AirtableErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'AirtableError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AirtableError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns AirtableError instance
   */
  static fromError(error: any): AirtableError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: AirtableErrorType; retryable: boolean }> = {
      '401': { type: AirtableErrorType.Authentication, retryable: false },
      '429': { type: AirtableErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new AirtableError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = AirtableErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = AirtableErrorType.Authentication
    } else if (statusCode === 403) {
      type = AirtableErrorType.Authorization
    } else if (statusCode === 404) {
      type = AirtableErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = AirtableErrorType.Validation
    } else if (statusCode === 429) {
      type = AirtableErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = AirtableErrorType.Server
      retryable = true
    }

    return new AirtableError(message, code, type, {
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
    return this.type === AirtableErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === AirtableErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === AirtableErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === AirtableErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === AirtableErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === AirtableErrorType.Server
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
