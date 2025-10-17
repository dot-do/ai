/**
 * Blocknative Errors
 *
 * Auto-generated error handling for Blocknative Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/blocknative
 */

/**
 * Error type enum
 */
export enum BlocknativeErrorType {
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
 * Blocknative Error class
 *
 * Custom error class for Blocknative Integration operations.
 */
export class BlocknativeError extends Error {
  public readonly code: string | number
  public readonly type: BlocknativeErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: BlocknativeErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'BlocknativeError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BlocknativeError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns BlocknativeError instance
   */
  static fromError(error: any): BlocknativeError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: BlocknativeErrorType; retryable: boolean }> = {
      '401': { type: BlocknativeErrorType.Authentication, retryable: false },
      '429': { type: BlocknativeErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new BlocknativeError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = BlocknativeErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = BlocknativeErrorType.Authentication
    } else if (statusCode === 403) {
      type = BlocknativeErrorType.Authorization
    } else if (statusCode === 404) {
      type = BlocknativeErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = BlocknativeErrorType.Validation
    } else if (statusCode === 429) {
      type = BlocknativeErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = BlocknativeErrorType.Server
      retryable = true
    }

    return new BlocknativeError(message, code, type, {
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
    return this.type === BlocknativeErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === BlocknativeErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === BlocknativeErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === BlocknativeErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === BlocknativeErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === BlocknativeErrorType.Server
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
