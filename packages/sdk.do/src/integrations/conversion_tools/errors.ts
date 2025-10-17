/**
 * Conversion tools Errors
 *
 * Auto-generated error handling for Conversion tools Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/conversion_tools
 */

/**
 * Error type enum
 */
export enum ConversionToolsErrorType {
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
 * Conversion tools Error class
 *
 * Custom error class for Conversion tools Integration operations.
 */
export class ConversionToolsError extends Error {
  public readonly code: string | number
  public readonly type: ConversionToolsErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ConversionToolsErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ConversionToolsError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ConversionToolsError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ConversionToolsError instance
   */
  static fromError(error: any): ConversionToolsError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ConversionToolsErrorType; retryable: boolean }> = {
      '401': { type: ConversionToolsErrorType.Authentication, retryable: false },
      '429': { type: ConversionToolsErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ConversionToolsError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ConversionToolsErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ConversionToolsErrorType.Authentication
    } else if (statusCode === 403) {
      type = ConversionToolsErrorType.Authorization
    } else if (statusCode === 404) {
      type = ConversionToolsErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ConversionToolsErrorType.Validation
    } else if (statusCode === 429) {
      type = ConversionToolsErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ConversionToolsErrorType.Server
      retryable = true
    }

    return new ConversionToolsError(message, code, type, {
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
    return this.type === ConversionToolsErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ConversionToolsErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ConversionToolsErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ConversionToolsErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ConversionToolsErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ConversionToolsErrorType.Server
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
