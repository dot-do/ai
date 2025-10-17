/**
 * Notion Errors
 *
 * Auto-generated error handling for Notion Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/notion
 */

/**
 * Error type enum
 */
export enum NotionErrorType {
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
 * Notion Error class
 *
 * Custom error class for Notion Integration operations.
 */
export class NotionError extends Error {
  public readonly code: string | number
  public readonly type: NotionErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: NotionErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'NotionError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotionError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns NotionError instance
   */
  static fromError(error: any): NotionError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: NotionErrorType; retryable: boolean }> = {
      unauthorized: { type: NotionErrorType.Authentication, retryable: false },
      restricted_resource: { type: NotionErrorType.Authorization, retryable: false },
      object_not_found: { type: NotionErrorType.NotFound, retryable: false },
      conflict_error: { type: NotionErrorType.Validation, retryable: false },
      rate_limited: { type: NotionErrorType.RateLimit, retryable: true },
      internal_server_error: { type: NotionErrorType.Server, retryable: true },
      service_unavailable: { type: NotionErrorType.Server, retryable: true },
      database_connection_unavailable: { type: NotionErrorType.Server, retryable: true },
      validation_error: { type: NotionErrorType.Validation, retryable: false },
      invalid_json: { type: NotionErrorType.Validation, retryable: false },
      invalid_request_url: { type: NotionErrorType.Validation, retryable: false },
      invalid_request: { type: NotionErrorType.Validation, retryable: false },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new NotionError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = NotionErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = NotionErrorType.Authentication
    } else if (statusCode === 403) {
      type = NotionErrorType.Authorization
    } else if (statusCode === 404) {
      type = NotionErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = NotionErrorType.Validation
    } else if (statusCode === 429) {
      type = NotionErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = NotionErrorType.Server
      retryable = true
    }

    return new NotionError(message, code, type, {
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
    return this.type === NotionErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === NotionErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === NotionErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === NotionErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === NotionErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === NotionErrorType.Server
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
