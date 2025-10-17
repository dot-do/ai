/**
 * Active campaign Errors
 *
 * Auto-generated error handling for Active campaign Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/active_campaign
 */

/**
 * Error type enum
 */
export enum ActiveCampaignErrorType {
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
 * Active campaign Error class
 *
 * Custom error class for Active campaign Integration operations.
 */
export class ActiveCampaignError extends Error {
  public readonly code: string | number
  public readonly type: ActiveCampaignErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ActiveCampaignErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ActiveCampaignError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ActiveCampaignError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ActiveCampaignError instance
   */
  static fromError(error: any): ActiveCampaignError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ActiveCampaignErrorType; retryable: boolean }> = {
      '401': { type: ActiveCampaignErrorType.Authentication, retryable: false },
      '429': { type: ActiveCampaignErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ActiveCampaignError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ActiveCampaignErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ActiveCampaignErrorType.Authentication
    } else if (statusCode === 403) {
      type = ActiveCampaignErrorType.Authorization
    } else if (statusCode === 404) {
      type = ActiveCampaignErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ActiveCampaignErrorType.Validation
    } else if (statusCode === 429) {
      type = ActiveCampaignErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ActiveCampaignErrorType.Server
      retryable = true
    }

    return new ActiveCampaignError(message, code, type, {
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
    return this.type === ActiveCampaignErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ActiveCampaignErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ActiveCampaignErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ActiveCampaignErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ActiveCampaignErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ActiveCampaignErrorType.Server
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
