/**
 * Microsoft tenant Errors
 *
 * Auto-generated error handling for Microsoft tenant Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/microsoft_tenant
 */

/**
 * Error type enum
 */
export enum MicrosoftTenantErrorType {
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
 * Microsoft tenant Error class
 *
 * Custom error class for Microsoft tenant Integration operations.
 */
export class MicrosoftTenantError extends Error {
  public readonly code: string | number
  public readonly type: MicrosoftTenantErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: MicrosoftTenantErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'MicrosoftTenantError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MicrosoftTenantError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns MicrosoftTenantError instance
   */
  static fromError(error: any): MicrosoftTenantError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: MicrosoftTenantErrorType; retryable: boolean }> = {
      '401': { type: MicrosoftTenantErrorType.Authentication, retryable: false },
      '429': { type: MicrosoftTenantErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new MicrosoftTenantError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = MicrosoftTenantErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = MicrosoftTenantErrorType.Authentication
    } else if (statusCode === 403) {
      type = MicrosoftTenantErrorType.Authorization
    } else if (statusCode === 404) {
      type = MicrosoftTenantErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = MicrosoftTenantErrorType.Validation
    } else if (statusCode === 429) {
      type = MicrosoftTenantErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = MicrosoftTenantErrorType.Server
      retryable = true
    }

    return new MicrosoftTenantError(message, code, type, {
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
    return this.type === MicrosoftTenantErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === MicrosoftTenantErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === MicrosoftTenantErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === MicrosoftTenantErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === MicrosoftTenantErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === MicrosoftTenantErrorType.Server
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
