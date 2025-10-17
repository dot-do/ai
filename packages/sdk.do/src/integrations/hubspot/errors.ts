/**
 * HubSpot Errors
 *
 * Auto-generated error handling for HubSpot Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/hubspot
 */

/**
 * Error type enum
 */
export enum HubspotErrorType {
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
 * HubSpot Error class
 *
 * Custom error class for HubSpot Integration operations.
 */
export class HubspotError extends Error {
  public readonly code: string | number
  public readonly type: HubspotErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: HubspotErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'HubspotError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, HubspotError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns HubspotError instance
   */
  static fromError(error: any): HubspotError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: HubspotErrorType; retryable: boolean }> = {
      '400': { type: HubspotErrorType.Validation, retryable: false },
      '401': { type: HubspotErrorType.Authentication, retryable: false },
      '403': { type: HubspotErrorType.Authorization, retryable: false },
      '404': { type: HubspotErrorType.NotFound, retryable: false },
      '409': { type: HubspotErrorType.Validation, retryable: false },
      '429': { type: HubspotErrorType.RateLimit, retryable: true },
      '500': { type: HubspotErrorType.Server, retryable: true },
      '502': { type: HubspotErrorType.Server, retryable: true },
      '503': { type: HubspotErrorType.Server, retryable: true },
      '504': { type: HubspotErrorType.Server, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new HubspotError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = HubspotErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = HubspotErrorType.Authentication
    } else if (statusCode === 403) {
      type = HubspotErrorType.Authorization
    } else if (statusCode === 404) {
      type = HubspotErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = HubspotErrorType.Validation
    } else if (statusCode === 429) {
      type = HubspotErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = HubspotErrorType.Server
      retryable = true
    }

    return new HubspotError(message, code, type, {
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
    return this.type === HubspotErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === HubspotErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === HubspotErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === HubspotErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === HubspotErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === HubspotErrorType.Server
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
