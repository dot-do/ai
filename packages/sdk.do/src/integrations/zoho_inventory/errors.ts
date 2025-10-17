/**
 * Zoho inventory Errors
 *
 * Auto-generated error handling for Zoho inventory Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/zoho_inventory
 */

/**
 * Error type enum
 */
export enum ZohoInventoryErrorType {
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
 * Zoho inventory Error class
 *
 * Custom error class for Zoho inventory Integration operations.
 */
export class ZohoInventoryError extends Error {
  public readonly code: string | number
  public readonly type: ZohoInventoryErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ZohoInventoryErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ZohoInventoryError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ZohoInventoryError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ZohoInventoryError instance
   */
  static fromError(error: any): ZohoInventoryError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ZohoInventoryErrorType; retryable: boolean }> = {
      '401': { type: ZohoInventoryErrorType.Authentication, retryable: false },
      '429': { type: ZohoInventoryErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ZohoInventoryError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ZohoInventoryErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ZohoInventoryErrorType.Authentication
    } else if (statusCode === 403) {
      type = ZohoInventoryErrorType.Authorization
    } else if (statusCode === 404) {
      type = ZohoInventoryErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ZohoInventoryErrorType.Validation
    } else if (statusCode === 429) {
      type = ZohoInventoryErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ZohoInventoryErrorType.Server
      retryable = true
    }

    return new ZohoInventoryError(message, code, type, {
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
    return this.type === ZohoInventoryErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ZohoInventoryErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ZohoInventoryErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ZohoInventoryErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ZohoInventoryErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ZohoInventoryErrorType.Server
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
