/**
 * Crowdin Errors
 *
 * Auto-generated error handling for Crowdin Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/crowdin
 */

/**
 * Error type enum
 */
export enum CrowdinErrorType {
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
 * Crowdin Error class
 *
 * Custom error class for Crowdin Integration operations.
 */
export class CrowdinError extends Error {
  public readonly code: string | number
  public readonly type: CrowdinErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: CrowdinErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'CrowdinError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CrowdinError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns CrowdinError instance
   */
  static fromError(error: any): CrowdinError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: CrowdinErrorType; retryable: boolean }> = {
      '401': { type: CrowdinErrorType.Authentication, retryable: false },
      '429': { type: CrowdinErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new CrowdinError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = CrowdinErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = CrowdinErrorType.Authentication
    } else if (statusCode === 403) {
      type = CrowdinErrorType.Authorization
    } else if (statusCode === 404) {
      type = CrowdinErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = CrowdinErrorType.Validation
    } else if (statusCode === 429) {
      type = CrowdinErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = CrowdinErrorType.Server
      retryable = true
    }

    return new CrowdinError(message, code, type, {
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
    return this.type === CrowdinErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === CrowdinErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === CrowdinErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === CrowdinErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === CrowdinErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === CrowdinErrorType.Server
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
