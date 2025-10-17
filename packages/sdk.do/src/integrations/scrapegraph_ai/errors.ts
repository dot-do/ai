/**
 * Scrapegraph ai Errors
 *
 * Auto-generated error handling for Scrapegraph ai Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/scrapegraph_ai
 */

/**
 * Error type enum
 */
export enum ScrapegraphAiErrorType {
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
 * Scrapegraph ai Error class
 *
 * Custom error class for Scrapegraph ai Integration operations.
 */
export class ScrapegraphAiError extends Error {
  public readonly code: string | number
  public readonly type: ScrapegraphAiErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ScrapegraphAiErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ScrapegraphAiError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ScrapegraphAiError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ScrapegraphAiError instance
   */
  static fromError(error: any): ScrapegraphAiError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ScrapegraphAiErrorType; retryable: boolean }> = {
      '401': { type: ScrapegraphAiErrorType.Authentication, retryable: false },
      '429': { type: ScrapegraphAiErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ScrapegraphAiError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ScrapegraphAiErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ScrapegraphAiErrorType.Authentication
    } else if (statusCode === 403) {
      type = ScrapegraphAiErrorType.Authorization
    } else if (statusCode === 404) {
      type = ScrapegraphAiErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ScrapegraphAiErrorType.Validation
    } else if (statusCode === 429) {
      type = ScrapegraphAiErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ScrapegraphAiErrorType.Server
      retryable = true
    }

    return new ScrapegraphAiError(message, code, type, {
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
    return this.type === ScrapegraphAiErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ScrapegraphAiErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ScrapegraphAiErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ScrapegraphAiErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ScrapegraphAiErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ScrapegraphAiErrorType.Server
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
