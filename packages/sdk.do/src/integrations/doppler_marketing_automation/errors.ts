/**
 * Doppler marketing automation Errors
 *
 * Auto-generated error handling for Doppler marketing automation Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/doppler_marketing_automation
 */

/**
 * Error type enum
 */
export enum DopplerMarketingAutomationErrorType {
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
 * Doppler marketing automation Error class
 *
 * Custom error class for Doppler marketing automation Integration operations.
 */
export class DopplerMarketingAutomationError extends Error {
  public readonly code: string | number
  public readonly type: DopplerMarketingAutomationErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: DopplerMarketingAutomationErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'DopplerMarketingAutomationError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DopplerMarketingAutomationError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns DopplerMarketingAutomationError instance
   */
  static fromError(error: any): DopplerMarketingAutomationError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: DopplerMarketingAutomationErrorType; retryable: boolean }> = {
      '401': { type: DopplerMarketingAutomationErrorType.Authentication, retryable: false },
      '429': { type: DopplerMarketingAutomationErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new DopplerMarketingAutomationError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = DopplerMarketingAutomationErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = DopplerMarketingAutomationErrorType.Authentication
    } else if (statusCode === 403) {
      type = DopplerMarketingAutomationErrorType.Authorization
    } else if (statusCode === 404) {
      type = DopplerMarketingAutomationErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = DopplerMarketingAutomationErrorType.Validation
    } else if (statusCode === 429) {
      type = DopplerMarketingAutomationErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = DopplerMarketingAutomationErrorType.Server
      retryable = true
    }

    return new DopplerMarketingAutomationError(message, code, type, {
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
    return this.type === DopplerMarketingAutomationErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === DopplerMarketingAutomationErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === DopplerMarketingAutomationErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === DopplerMarketingAutomationErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === DopplerMarketingAutomationErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === DopplerMarketingAutomationErrorType.Server
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
