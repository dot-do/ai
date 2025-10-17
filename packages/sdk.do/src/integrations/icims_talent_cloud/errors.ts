/**
 * Icims talent cloud Errors
 *
 * Auto-generated error handling for Icims talent cloud Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/icims_talent_cloud
 */

/**
 * Error type enum
 */
export enum IcimsTalentCloudErrorType {
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
 * Icims talent cloud Error class
 *
 * Custom error class for Icims talent cloud Integration operations.
 */
export class IcimsTalentCloudError extends Error {
  public readonly code: string | number
  public readonly type: IcimsTalentCloudErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: IcimsTalentCloudErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'IcimsTalentCloudError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, IcimsTalentCloudError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns IcimsTalentCloudError instance
   */
  static fromError(error: any): IcimsTalentCloudError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: IcimsTalentCloudErrorType; retryable: boolean }> = {
      '401': { type: IcimsTalentCloudErrorType.Authentication, retryable: false },
      '429': { type: IcimsTalentCloudErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new IcimsTalentCloudError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = IcimsTalentCloudErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = IcimsTalentCloudErrorType.Authentication
    } else if (statusCode === 403) {
      type = IcimsTalentCloudErrorType.Authorization
    } else if (statusCode === 404) {
      type = IcimsTalentCloudErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = IcimsTalentCloudErrorType.Validation
    } else if (statusCode === 429) {
      type = IcimsTalentCloudErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = IcimsTalentCloudErrorType.Server
      retryable = true
    }

    return new IcimsTalentCloudError(message, code, type, {
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
    return this.type === IcimsTalentCloudErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === IcimsTalentCloudErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === IcimsTalentCloudErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === IcimsTalentCloudErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === IcimsTalentCloudErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === IcimsTalentCloudErrorType.Server
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
