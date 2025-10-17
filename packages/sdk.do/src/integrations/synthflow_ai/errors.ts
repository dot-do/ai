/**
 * Synthflow ai Errors
 *
 * Auto-generated error handling for Synthflow ai Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/synthflow_ai
 */

/**
 * Error type enum
 */
export enum SynthflowAiErrorType {
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
 * Synthflow ai Error class
 *
 * Custom error class for Synthflow ai Integration operations.
 */
export class SynthflowAiError extends Error {
  public readonly code: string | number
  public readonly type: SynthflowAiErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: SynthflowAiErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'SynthflowAiError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SynthflowAiError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns SynthflowAiError instance
   */
  static fromError(error: any): SynthflowAiError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: SynthflowAiErrorType; retryable: boolean }> = {
      '401': { type: SynthflowAiErrorType.Authentication, retryable: false },
      '429': { type: SynthflowAiErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new SynthflowAiError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = SynthflowAiErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = SynthflowAiErrorType.Authentication
    } else if (statusCode === 403) {
      type = SynthflowAiErrorType.Authorization
    } else if (statusCode === 404) {
      type = SynthflowAiErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = SynthflowAiErrorType.Validation
    } else if (statusCode === 429) {
      type = SynthflowAiErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = SynthflowAiErrorType.Server
      retryable = true
    }

    return new SynthflowAiError(message, code, type, {
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
    return this.type === SynthflowAiErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === SynthflowAiErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === SynthflowAiErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === SynthflowAiErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === SynthflowAiErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === SynthflowAiErrorType.Server
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
