/**
 * Bitbucket Errors
 *
 * Auto-generated error handling for Bitbucket Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/bitbucket
 */

/**
 * Error type enum
 */
export enum BitbucketErrorType {
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
 * Bitbucket Error class
 *
 * Custom error class for Bitbucket Integration operations.
 */
export class BitbucketError extends Error {
  public readonly code: string | number
  public readonly type: BitbucketErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: BitbucketErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'BitbucketError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BitbucketError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns BitbucketError instance
   */
  static fromError(error: any): BitbucketError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: BitbucketErrorType; retryable: boolean }> = {
      '401': { type: BitbucketErrorType.Authentication, retryable: false },
      '403': { type: BitbucketErrorType.Authorization, retryable: false },
      '404': { type: BitbucketErrorType.NotFound, retryable: false },
      '400': { type: BitbucketErrorType.Validation, retryable: false },
      '429': { type: BitbucketErrorType.RateLimit, retryable: true },
      '500': { type: BitbucketErrorType.Server, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new BitbucketError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = BitbucketErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = BitbucketErrorType.Authentication
    } else if (statusCode === 403) {
      type = BitbucketErrorType.Authorization
    } else if (statusCode === 404) {
      type = BitbucketErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = BitbucketErrorType.Validation
    } else if (statusCode === 429) {
      type = BitbucketErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = BitbucketErrorType.Server
      retryable = true
    }

    return new BitbucketError(message, code, type, {
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
    return this.type === BitbucketErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === BitbucketErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === BitbucketErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === BitbucketErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === BitbucketErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === BitbucketErrorType.Server
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
