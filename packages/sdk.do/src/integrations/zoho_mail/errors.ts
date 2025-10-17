/**
 * Zoho mail Errors
 *
 * Auto-generated error handling for Zoho mail Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/zoho_mail
 */

/**
 * Error type enum
 */
export enum ZohoMailErrorType {
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
 * Zoho mail Error class
 *
 * Custom error class for Zoho mail Integration operations.
 */
export class ZohoMailError extends Error {
  public readonly code: string | number
  public readonly type: ZohoMailErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ZohoMailErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ZohoMailError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ZohoMailError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ZohoMailError instance
   */
  static fromError(error: any): ZohoMailError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ZohoMailErrorType; retryable: boolean }> = {
      '401': { type: ZohoMailErrorType.Authentication, retryable: false },
      '429': { type: ZohoMailErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ZohoMailError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ZohoMailErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ZohoMailErrorType.Authentication
    } else if (statusCode === 403) {
      type = ZohoMailErrorType.Authorization
    } else if (statusCode === 404) {
      type = ZohoMailErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ZohoMailErrorType.Validation
    } else if (statusCode === 429) {
      type = ZohoMailErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ZohoMailErrorType.Server
      retryable = true
    }

    return new ZohoMailError(message, code, type, {
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
    return this.type === ZohoMailErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ZohoMailErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ZohoMailErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ZohoMailErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ZohoMailErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ZohoMailErrorType.Server
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
