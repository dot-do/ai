/**
 * Modelry Errors
 *
 * Auto-generated error handling for Modelry Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/modelry
 */

/**
 * Error type enum
 */
export enum ModelryErrorType {
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
 * Modelry Error class
 *
 * Custom error class for Modelry Integration operations.
 */
export class ModelryError extends Error {
  public readonly code: string | number
  public readonly type: ModelryErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ModelryErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ModelryError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ModelryError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ModelryError instance
   */
  static fromError(error: any): ModelryError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ModelryErrorType; retryable: boolean }> = {
      '401': { type: ModelryErrorType.Authentication, retryable: false },
      '429': { type: ModelryErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ModelryError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ModelryErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ModelryErrorType.Authentication
    } else if (statusCode === 403) {
      type = ModelryErrorType.Authorization
    } else if (statusCode === 404) {
      type = ModelryErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ModelryErrorType.Validation
    } else if (statusCode === 429) {
      type = ModelryErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ModelryErrorType.Server
      retryable = true
    }

    return new ModelryError(message, code, type, {
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
    return this.type === ModelryErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ModelryErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ModelryErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ModelryErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ModelryErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ModelryErrorType.Server
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
