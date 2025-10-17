/**
 * All images ai Errors
 *
 * Auto-generated error handling for All images ai Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/all_images_ai
 */

/**
 * Error type enum
 */
export enum AllImagesAiErrorType {
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
 * All images ai Error class
 *
 * Custom error class for All images ai Integration operations.
 */
export class AllImagesAiError extends Error {
  public readonly code: string | number
  public readonly type: AllImagesAiErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: AllImagesAiErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'AllImagesAiError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AllImagesAiError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns AllImagesAiError instance
   */
  static fromError(error: any): AllImagesAiError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: AllImagesAiErrorType; retryable: boolean }> = {
      '401': { type: AllImagesAiErrorType.Authentication, retryable: false },
      '429': { type: AllImagesAiErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new AllImagesAiError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = AllImagesAiErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = AllImagesAiErrorType.Authentication
    } else if (statusCode === 403) {
      type = AllImagesAiErrorType.Authorization
    } else if (statusCode === 404) {
      type = AllImagesAiErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = AllImagesAiErrorType.Validation
    } else if (statusCode === 429) {
      type = AllImagesAiErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = AllImagesAiErrorType.Server
      retryable = true
    }

    return new AllImagesAiError(message, code, type, {
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
    return this.type === AllImagesAiErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === AllImagesAiErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === AllImagesAiErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === AllImagesAiErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === AllImagesAiErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === AllImagesAiErrorType.Server
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
