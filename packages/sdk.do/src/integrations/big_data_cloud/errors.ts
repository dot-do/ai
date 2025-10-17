/**
 * Big data cloud Errors
 *
 * Auto-generated error handling for Big data cloud Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/big_data_cloud
 */

/**
 * Error type enum
 */
export enum BigDataCloudErrorType {
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
 * Big data cloud Error class
 *
 * Custom error class for Big data cloud Integration operations.
 */
export class BigDataCloudError extends Error {
  public readonly code: string | number
  public readonly type: BigDataCloudErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: BigDataCloudErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'BigDataCloudError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BigDataCloudError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns BigDataCloudError instance
   */
  static fromError(error: any): BigDataCloudError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: BigDataCloudErrorType; retryable: boolean }> = {
      '401': { type: BigDataCloudErrorType.Authentication, retryable: false },
      '429': { type: BigDataCloudErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new BigDataCloudError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = BigDataCloudErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = BigDataCloudErrorType.Authentication
    } else if (statusCode === 403) {
      type = BigDataCloudErrorType.Authorization
    } else if (statusCode === 404) {
      type = BigDataCloudErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = BigDataCloudErrorType.Validation
    } else if (statusCode === 429) {
      type = BigDataCloudErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = BigDataCloudErrorType.Server
      retryable = true
    }

    return new BigDataCloudError(message, code, type, {
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
    return this.type === BigDataCloudErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === BigDataCloudErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === BigDataCloudErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === BigDataCloudErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === BigDataCloudErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === BigDataCloudErrorType.Server
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
