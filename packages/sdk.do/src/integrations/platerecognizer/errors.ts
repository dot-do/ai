/**
 * Platerecognizer Errors
 *
 * Auto-generated error handling for Platerecognizer Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/platerecognizer
 */

/**
 * Error type enum
 */
export enum PlaterecognizerErrorType {
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
 * Platerecognizer Error class
 *
 * Custom error class for Platerecognizer Integration operations.
 */
export class PlaterecognizerError extends Error {
  public readonly code: string | number
  public readonly type: PlaterecognizerErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: PlaterecognizerErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'PlaterecognizerError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PlaterecognizerError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns PlaterecognizerError instance
   */
  static fromError(error: any): PlaterecognizerError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: PlaterecognizerErrorType; retryable: boolean }> = {
      '401': { type: PlaterecognizerErrorType.Authentication, retryable: false },
      '429': { type: PlaterecognizerErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new PlaterecognizerError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = PlaterecognizerErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = PlaterecognizerErrorType.Authentication
    } else if (statusCode === 403) {
      type = PlaterecognizerErrorType.Authorization
    } else if (statusCode === 404) {
      type = PlaterecognizerErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = PlaterecognizerErrorType.Validation
    } else if (statusCode === 429) {
      type = PlaterecognizerErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = PlaterecognizerErrorType.Server
      retryable = true
    }

    return new PlaterecognizerError(message, code, type, {
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
    return this.type === PlaterecognizerErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === PlaterecognizerErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === PlaterecognizerErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === PlaterecognizerErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === PlaterecognizerErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === PlaterecognizerErrorType.Server
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
