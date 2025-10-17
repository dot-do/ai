/**
 * Adobe Errors
 *
 * Auto-generated error handling for Adobe Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/adobe
 */

/**
 * Error type enum
 */
export enum AdobeErrorType {
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
 * Adobe Error class
 *
 * Custom error class for Adobe Integration operations.
 */
export class AdobeError extends Error {
  public readonly code: string | number
  public readonly type: AdobeErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: AdobeErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'AdobeError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AdobeError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns AdobeError instance
   */
  static fromError(error: any): AdobeError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: AdobeErrorType; retryable: boolean }> = {
      '401': { type: AdobeErrorType.Authentication, retryable: false },
      '429': { type: AdobeErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new AdobeError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = AdobeErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = AdobeErrorType.Authentication
    } else if (statusCode === 403) {
      type = AdobeErrorType.Authorization
    } else if (statusCode === 404) {
      type = AdobeErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = AdobeErrorType.Validation
    } else if (statusCode === 429) {
      type = AdobeErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = AdobeErrorType.Server
      retryable = true
    }

    return new AdobeError(message, code, type, {
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
    return this.type === AdobeErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === AdobeErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === AdobeErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === AdobeErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === AdobeErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === AdobeErrorType.Server
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
