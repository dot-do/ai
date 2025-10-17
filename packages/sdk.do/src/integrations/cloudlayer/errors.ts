/**
 * Cloudlayer Errors
 *
 * Auto-generated error handling for Cloudlayer Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/cloudlayer
 */

/**
 * Error type enum
 */
export enum CloudlayerErrorType {
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
 * Cloudlayer Error class
 *
 * Custom error class for Cloudlayer Integration operations.
 */
export class CloudlayerError extends Error {
  public readonly code: string | number
  public readonly type: CloudlayerErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: CloudlayerErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'CloudlayerError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CloudlayerError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns CloudlayerError instance
   */
  static fromError(error: any): CloudlayerError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: CloudlayerErrorType; retryable: boolean }> = {
      '401': { type: CloudlayerErrorType.Authentication, retryable: false },
      '429': { type: CloudlayerErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new CloudlayerError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = CloudlayerErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = CloudlayerErrorType.Authentication
    } else if (statusCode === 403) {
      type = CloudlayerErrorType.Authorization
    } else if (statusCode === 404) {
      type = CloudlayerErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = CloudlayerErrorType.Validation
    } else if (statusCode === 429) {
      type = CloudlayerErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = CloudlayerErrorType.Server
      retryable = true
    }

    return new CloudlayerError(message, code, type, {
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
    return this.type === CloudlayerErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === CloudlayerErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === CloudlayerErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === CloudlayerErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === CloudlayerErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === CloudlayerErrorType.Server
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
