/**
 * Contentful Errors
 *
 * Auto-generated error handling for Contentful Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/contentful
 */

/**
 * Error type enum
 */
export enum ContentfulErrorType {
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
 * Contentful Error class
 *
 * Custom error class for Contentful Integration operations.
 */
export class ContentfulError extends Error {
  public readonly code: string | number
  public readonly type: ContentfulErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ContentfulErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ContentfulError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ContentfulError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ContentfulError instance
   */
  static fromError(error: any): ContentfulError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ContentfulErrorType; retryable: boolean }> = {
      '401': { type: ContentfulErrorType.Authentication, retryable: false },
      '429': { type: ContentfulErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ContentfulError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ContentfulErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ContentfulErrorType.Authentication
    } else if (statusCode === 403) {
      type = ContentfulErrorType.Authorization
    } else if (statusCode === 404) {
      type = ContentfulErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ContentfulErrorType.Validation
    } else if (statusCode === 429) {
      type = ContentfulErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ContentfulErrorType.Server
      retryable = true
    }

    return new ContentfulError(message, code, type, {
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
    return this.type === ContentfulErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ContentfulErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ContentfulErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ContentfulErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ContentfulErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ContentfulErrorType.Server
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
