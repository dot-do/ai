/**
 * Lemlist Errors
 *
 * Auto-generated error handling for Lemlist Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/lemlist
 */

/**
 * Error type enum
 */
export enum LemlistErrorType {
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
 * Lemlist Error class
 *
 * Custom error class for Lemlist Integration operations.
 */
export class LemlistError extends Error {
  public readonly code: string | number
  public readonly type: LemlistErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: LemlistErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'LemlistError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, LemlistError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns LemlistError instance
   */
  static fromError(error: any): LemlistError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: LemlistErrorType; retryable: boolean }> = {
      '401': { type: LemlistErrorType.Authentication, retryable: false },
      '429': { type: LemlistErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new LemlistError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = LemlistErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = LemlistErrorType.Authentication
    } else if (statusCode === 403) {
      type = LemlistErrorType.Authorization
    } else if (statusCode === 404) {
      type = LemlistErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = LemlistErrorType.Validation
    } else if (statusCode === 429) {
      type = LemlistErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = LemlistErrorType.Server
      retryable = true
    }

    return new LemlistError(message, code, type, {
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
    return this.type === LemlistErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === LemlistErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === LemlistErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === LemlistErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === LemlistErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === LemlistErrorType.Server
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
