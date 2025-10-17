/**
 * Google Workspace Errors
 *
 * Auto-generated error handling for Google Workspace Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/google-workspace
 */

/**
 * Error type enum
 */
export enum GoogleWorkspaceErrorType {
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
 * Google Workspace Error class
 *
 * Custom error class for Google Workspace Integration operations.
 */
export class GoogleWorkspaceError extends Error {
  public readonly code: string | number
  public readonly type: GoogleWorkspaceErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: GoogleWorkspaceErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'GoogleWorkspaceError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GoogleWorkspaceError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns GoogleWorkspaceError instance
   */
  static fromError(error: any): GoogleWorkspaceError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: GoogleWorkspaceErrorType; retryable: boolean }> = {
      INVALID_ARGUMENT: { type: GoogleWorkspaceErrorType.Validation, retryable: false },
      FAILED_PRECONDITION: { type: GoogleWorkspaceErrorType.Validation, retryable: false },
      OUT_OF_RANGE: { type: GoogleWorkspaceErrorType.Validation, retryable: false },
      UNAUTHENTICATED: { type: GoogleWorkspaceErrorType.Authentication, retryable: false },
      PERMISSION_DENIED: { type: GoogleWorkspaceErrorType.Authorization, retryable: false },
      NOT_FOUND: { type: GoogleWorkspaceErrorType.NotFound, retryable: false },
      ALREADY_EXISTS: { type: GoogleWorkspaceErrorType.Validation, retryable: false },
      ABORTED: { type: GoogleWorkspaceErrorType.Validation, retryable: true },
      RESOURCE_EXHAUSTED: { type: GoogleWorkspaceErrorType.RateLimit, retryable: true },
      CANCELLED: { type: GoogleWorkspaceErrorType.Validation, retryable: false },
      UNKNOWN: { type: GoogleWorkspaceErrorType.Server, retryable: false },
      INTERNAL: { type: GoogleWorkspaceErrorType.Server, retryable: true },
      NOT_IMPLEMENTED: { type: GoogleWorkspaceErrorType.Server, retryable: false },
      UNAVAILABLE: { type: GoogleWorkspaceErrorType.Server, retryable: true },
      DEADLINE_EXCEEDED: { type: GoogleWorkspaceErrorType.Server, retryable: true },
      DATA_LOSS: { type: GoogleWorkspaceErrorType.Server, retryable: false },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new GoogleWorkspaceError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = GoogleWorkspaceErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = GoogleWorkspaceErrorType.Authentication
    } else if (statusCode === 403) {
      type = GoogleWorkspaceErrorType.Authorization
    } else if (statusCode === 404) {
      type = GoogleWorkspaceErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = GoogleWorkspaceErrorType.Validation
    } else if (statusCode === 429) {
      type = GoogleWorkspaceErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = GoogleWorkspaceErrorType.Server
      retryable = true
    }

    return new GoogleWorkspaceError(message, code, type, {
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
    return this.type === GoogleWorkspaceErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === GoogleWorkspaceErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === GoogleWorkspaceErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === GoogleWorkspaceErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === GoogleWorkspaceErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === GoogleWorkspaceErrorType.Server
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
