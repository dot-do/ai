/**
 * Contentful graphql Errors
 *
 * Auto-generated error handling for Contentful graphql Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/contentful_graphql
 */

/**
 * Error type enum
 */
export enum ContentfulGraphqlErrorType {
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
 * Contentful graphql Error class
 *
 * Custom error class for Contentful graphql Integration operations.
 */
export class ContentfulGraphqlError extends Error {
  public readonly code: string | number
  public readonly type: ContentfulGraphqlErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ContentfulGraphqlErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ContentfulGraphqlError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ContentfulGraphqlError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ContentfulGraphqlError instance
   */
  static fromError(error: any): ContentfulGraphqlError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ContentfulGraphqlErrorType; retryable: boolean }> = {
      '401': { type: ContentfulGraphqlErrorType.Authentication, retryable: false },
      '429': { type: ContentfulGraphqlErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ContentfulGraphqlError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ContentfulGraphqlErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ContentfulGraphqlErrorType.Authentication
    } else if (statusCode === 403) {
      type = ContentfulGraphqlErrorType.Authorization
    } else if (statusCode === 404) {
      type = ContentfulGraphqlErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ContentfulGraphqlErrorType.Validation
    } else if (statusCode === 429) {
      type = ContentfulGraphqlErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ContentfulGraphqlErrorType.Server
      retryable = true
    }

    return new ContentfulGraphqlError(message, code, type, {
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
    return this.type === ContentfulGraphqlErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ContentfulGraphqlErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ContentfulGraphqlErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ContentfulGraphqlErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ContentfulGraphqlErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ContentfulGraphqlErrorType.Server
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
