/**
 * ActiveCampaign Errors
 *
 * Auto-generated error handling for ActiveCampaign Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/activecampaign
 */

/**
 * Error type enum
 */
export enum ActivecampaignErrorType {
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
 * ActiveCampaign Error class
 *
 * Custom error class for ActiveCampaign Integration operations.
 */
export class ActivecampaignError extends Error {
  public readonly code: string | number
  public readonly type: ActivecampaignErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ActivecampaignErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ActivecampaignError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ActivecampaignError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ActivecampaignError instance
   */
  static fromError(error: any): ActivecampaignError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ActivecampaignErrorType; retryable: boolean }> = {
      '401': { type: ActivecampaignErrorType.Authentication, retryable: false },
      '429': { type: ActivecampaignErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ActivecampaignError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ActivecampaignErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ActivecampaignErrorType.Authentication
    } else if (statusCode === 403) {
      type = ActivecampaignErrorType.Authorization
    } else if (statusCode === 404) {
      type = ActivecampaignErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ActivecampaignErrorType.Validation
    } else if (statusCode === 429) {
      type = ActivecampaignErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ActivecampaignErrorType.Server
      retryable = true
    }

    return new ActivecampaignError(message, code, type, {
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
    return this.type === ActivecampaignErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ActivecampaignErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ActivecampaignErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ActivecampaignErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ActivecampaignErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ActivecampaignErrorType.Server
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
