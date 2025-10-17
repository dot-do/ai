/**
 * Proxiedmail Errors
 *
 * Auto-generated error handling for Proxiedmail Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/proxiedmail
 */

/**
 * Error type enum
 */
export enum ProxiedmailErrorType {
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
 * Proxiedmail Error class
 *
 * Custom error class for Proxiedmail Integration operations.
 */
export class ProxiedmailError extends Error {
  public readonly code: string | number
  public readonly type: ProxiedmailErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ProxiedmailErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ProxiedmailError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ProxiedmailError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ProxiedmailError instance
   */
  static fromError(error: any): ProxiedmailError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ProxiedmailErrorType; retryable: boolean }> = {
      '401': { type: ProxiedmailErrorType.Authentication, retryable: false },
      '429': { type: ProxiedmailErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ProxiedmailError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ProxiedmailErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ProxiedmailErrorType.Authentication
    } else if (statusCode === 403) {
      type = ProxiedmailErrorType.Authorization
    } else if (statusCode === 404) {
      type = ProxiedmailErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ProxiedmailErrorType.Validation
    } else if (statusCode === 429) {
      type = ProxiedmailErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ProxiedmailErrorType.Server
      retryable = true
    }

    return new ProxiedmailError(message, code, type, {
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
    return this.type === ProxiedmailErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ProxiedmailErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ProxiedmailErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ProxiedmailErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ProxiedmailErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ProxiedmailErrorType.Server
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
