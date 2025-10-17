/**
 * Microsoft teams Errors
 *
 * Auto-generated error handling for Microsoft teams Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/microsoft_teams
 */

/**
 * Error type enum
 */
export enum MicrosoftTeamsErrorType {
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
 * Microsoft teams Error class
 *
 * Custom error class for Microsoft teams Integration operations.
 */
export class MicrosoftTeamsError extends Error {
  public readonly code: string | number
  public readonly type: MicrosoftTeamsErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: MicrosoftTeamsErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'MicrosoftTeamsError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MicrosoftTeamsError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns MicrosoftTeamsError instance
   */
  static fromError(error: any): MicrosoftTeamsError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: MicrosoftTeamsErrorType; retryable: boolean }> = {
      '401': { type: MicrosoftTeamsErrorType.Authentication, retryable: false },
      '429': { type: MicrosoftTeamsErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new MicrosoftTeamsError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = MicrosoftTeamsErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = MicrosoftTeamsErrorType.Authentication
    } else if (statusCode === 403) {
      type = MicrosoftTeamsErrorType.Authorization
    } else if (statusCode === 404) {
      type = MicrosoftTeamsErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = MicrosoftTeamsErrorType.Validation
    } else if (statusCode === 429) {
      type = MicrosoftTeamsErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = MicrosoftTeamsErrorType.Server
      retryable = true
    }

    return new MicrosoftTeamsError(message, code, type, {
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
    return this.type === MicrosoftTeamsErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === MicrosoftTeamsErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === MicrosoftTeamsErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === MicrosoftTeamsErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === MicrosoftTeamsErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === MicrosoftTeamsErrorType.Server
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
