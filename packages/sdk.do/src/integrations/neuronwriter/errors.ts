/**
 * Neuronwriter Errors
 *
 * Auto-generated error handling for Neuronwriter Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/neuronwriter
 */

/**
 * Error type enum
 */
export enum NeuronwriterErrorType {
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
 * Neuronwriter Error class
 *
 * Custom error class for Neuronwriter Integration operations.
 */
export class NeuronwriterError extends Error {
  public readonly code: string | number
  public readonly type: NeuronwriterErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: NeuronwriterErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'NeuronwriterError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NeuronwriterError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns NeuronwriterError instance
   */
  static fromError(error: any): NeuronwriterError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: NeuronwriterErrorType; retryable: boolean }> = {
      '401': { type: NeuronwriterErrorType.Authentication, retryable: false },
      '429': { type: NeuronwriterErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new NeuronwriterError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = NeuronwriterErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = NeuronwriterErrorType.Authentication
    } else if (statusCode === 403) {
      type = NeuronwriterErrorType.Authorization
    } else if (statusCode === 404) {
      type = NeuronwriterErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = NeuronwriterErrorType.Validation
    } else if (statusCode === 429) {
      type = NeuronwriterErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = NeuronwriterErrorType.Server
      retryable = true
    }

    return new NeuronwriterError(message, code, type, {
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
    return this.type === NeuronwriterErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === NeuronwriterErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === NeuronwriterErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === NeuronwriterErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === NeuronwriterErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === NeuronwriterErrorType.Server
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
