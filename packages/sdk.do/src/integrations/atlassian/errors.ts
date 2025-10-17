/**
 * Atlassian Errors
 *
 * Auto-generated error handling for Atlassian Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/atlassian
 */

/**
 * Error type enum
 */
export enum AtlassianErrorType {
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
 * Atlassian Error class
 *
 * Custom error class for Atlassian Integration operations.
 */
export class AtlassianError extends Error {
  public readonly code: string | number
  public readonly type: AtlassianErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: AtlassianErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'AtlassianError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AtlassianError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns AtlassianError instance
   */
  static fromError(error: any): AtlassianError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: AtlassianErrorType; retryable: boolean }> = {
      '401': { type: AtlassianErrorType.Authentication, retryable: false },
      '429': { type: AtlassianErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new AtlassianError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = AtlassianErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = AtlassianErrorType.Authentication
    } else if (statusCode === 403) {
      type = AtlassianErrorType.Authorization
    } else if (statusCode === 404) {
      type = AtlassianErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = AtlassianErrorType.Validation
    } else if (statusCode === 429) {
      type = AtlassianErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = AtlassianErrorType.Server
      retryable = true
    }

    return new AtlassianError(message, code, type, {
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
    return this.type === AtlassianErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === AtlassianErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === AtlassianErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === AtlassianErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === AtlassianErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === AtlassianErrorType.Server
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
