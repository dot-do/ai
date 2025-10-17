/**
 * Salesforce Errors
 *
 * Auto-generated error handling for Salesforce Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/salesforce
 */

/**
 * Error type enum
 */
export enum SalesforceErrorType {
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
 * Salesforce Error class
 *
 * Custom error class for Salesforce Integration operations.
 */
export class SalesforceError extends Error {
  public readonly code: string | number
  public readonly type: SalesforceErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: SalesforceErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'SalesforceError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SalesforceError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns SalesforceError instance
   */
  static fromError(error: any): SalesforceError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: SalesforceErrorType; retryable: boolean }> = {
      INVALID_SESSION_ID: { type: SalesforceErrorType.Authentication, retryable: false },
      INVALID_LOGIN: { type: SalesforceErrorType.Authentication, retryable: false },
      AUTHENTICATION_FAILED: { type: SalesforceErrorType.Authentication, retryable: false },
      OAUTH_ERROR: { type: SalesforceErrorType.Authentication, retryable: false },
      QUERY_TIMEOUT: { type: SalesforceErrorType.Server, retryable: true },
      MALFORMED_QUERY: { type: SalesforceErrorType.Validation, retryable: false },
      INVALID_FIELD: { type: SalesforceErrorType.Validation, retryable: false },
      DUPLICATE_VALUE: { type: SalesforceErrorType.Validation, retryable: false },
      REQUIRED_FIELD_MISSING: { type: SalesforceErrorType.Validation, retryable: false },
      FIELD_CUSTOM_VALIDATION_EXCEPTION: { type: SalesforceErrorType.Validation, retryable: false },
      STRING_TOO_LONG: { type: SalesforceErrorType.Validation, retryable: false },
      INVALID_FIELD_FOR_INSERT_UPDATE: { type: SalesforceErrorType.Validation, retryable: false },
      ENTITY_IS_DELETED: { type: SalesforceErrorType.NotFound, retryable: false },
      INVALID_ID_FIELD: { type: SalesforceErrorType.NotFound, retryable: false },
      ENTITY_IS_LOCKED: { type: SalesforceErrorType.Server, retryable: false },
      INSUFFICIENT_ACCESS_ON_CROSS_REFERENCE_ENTITY: { type: SalesforceErrorType.Authorization, retryable: false },
      INSUFFICIENT_ACCESS: { type: SalesforceErrorType.Authorization, retryable: false },
      NO_ACCESS: { type: SalesforceErrorType.Authorization, retryable: false },
      REQUEST_LIMIT_EXCEEDED: { type: SalesforceErrorType.RateLimit, retryable: true },
      API_CURRENTLY_DISABLED: { type: SalesforceErrorType.Server, retryable: true },
      INVALID_TYPE: { type: SalesforceErrorType.Validation, retryable: false },
      BATCH_PROCESSING_ERROR: { type: SalesforceErrorType.Server, retryable: true },
      BATCH_LIMIT_EXCEEDED: { type: SalesforceErrorType.RateLimit, retryable: true },
      CONNECTION_ERROR: { type: SalesforceErrorType.Network, retryable: true },
      TIMEOUT_ERROR: { type: SalesforceErrorType.Network, retryable: true },
      UNKNOWN_ERROR: { type: SalesforceErrorType.Unknown, retryable: false },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new SalesforceError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = SalesforceErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = SalesforceErrorType.Authentication
    } else if (statusCode === 403) {
      type = SalesforceErrorType.Authorization
    } else if (statusCode === 404) {
      type = SalesforceErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = SalesforceErrorType.Validation
    } else if (statusCode === 429) {
      type = SalesforceErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = SalesforceErrorType.Server
      retryable = true
    }

    return new SalesforceError(message, code, type, {
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
    return this.type === SalesforceErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === SalesforceErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === SalesforceErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === SalesforceErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === SalesforceErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === SalesforceErrorType.Server
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
