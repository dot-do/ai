/**
 * Campaign cleaner Errors
 *
 * Auto-generated error handling for Campaign cleaner Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/campaign_cleaner
 */

/**
 * Error type enum
 */
export enum CampaignCleanerErrorType {
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
 * Campaign cleaner Error class
 *
 * Custom error class for Campaign cleaner Integration operations.
 */
export class CampaignCleanerError extends Error {
  public readonly code: string | number
  public readonly type: CampaignCleanerErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: CampaignCleanerErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'CampaignCleanerError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CampaignCleanerError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns CampaignCleanerError instance
   */
  static fromError(error: any): CampaignCleanerError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: CampaignCleanerErrorType; retryable: boolean }> = {
      '401': { type: CampaignCleanerErrorType.Authentication, retryable: false },
      '429': { type: CampaignCleanerErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new CampaignCleanerError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = CampaignCleanerErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = CampaignCleanerErrorType.Authentication
    } else if (statusCode === 403) {
      type = CampaignCleanerErrorType.Authorization
    } else if (statusCode === 404) {
      type = CampaignCleanerErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = CampaignCleanerErrorType.Validation
    } else if (statusCode === 429) {
      type = CampaignCleanerErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = CampaignCleanerErrorType.Server
      retryable = true
    }

    return new CampaignCleanerError(message, code, type, {
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
    return this.type === CampaignCleanerErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === CampaignCleanerErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === CampaignCleanerErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === CampaignCleanerErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === CampaignCleanerErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === CampaignCleanerErrorType.Server
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
