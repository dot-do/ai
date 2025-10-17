/**
 * Aivoov Errors
 *
 * Auto-generated error handling for Aivoov Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/aivoov
 */

/**
 * Error type enum
 */
export enum AivoovErrorType {
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
 * Aivoov Error class
 *
 * Custom error class for Aivoov Integration operations.
 */
export class AivoovError extends Error {
  public readonly code: string | number
  public readonly type: AivoovErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: AivoovErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'AivoovError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AivoovError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns AivoovError instance
   */
  static fromError(error: any): AivoovError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: AivoovErrorType; retryable: boolean }> = {
      '401': { type: AivoovErrorType.Authentication, retryable: false },
      '429': { type: AivoovErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new AivoovError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = AivoovErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = AivoovErrorType.Authentication
    } else if (statusCode === 403) {
      type = AivoovErrorType.Authorization
    } else if (statusCode === 404) {
      type = AivoovErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = AivoovErrorType.Validation
    } else if (statusCode === 429) {
      type = AivoovErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = AivoovErrorType.Server
      retryable = true
    }

    return new AivoovError(message, code, type, {
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
    return this.type === AivoovErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === AivoovErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === AivoovErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === AivoovErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === AivoovErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === AivoovErrorType.Server
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
