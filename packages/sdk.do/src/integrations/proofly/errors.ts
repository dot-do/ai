/**
 * Proofly Errors
 *
 * Auto-generated error handling for Proofly Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/proofly
 */

/**
 * Error type enum
 */
export enum ProoflyErrorType {
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
 * Proofly Error class
 *
 * Custom error class for Proofly Integration operations.
 */
export class ProoflyError extends Error {
  public readonly code: string | number
  public readonly type: ProoflyErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: ProoflyErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'ProoflyError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ProoflyError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns ProoflyError instance
   */
  static fromError(error: any): ProoflyError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: ProoflyErrorType; retryable: boolean }> = {
      '401': { type: ProoflyErrorType.Authentication, retryable: false },
      '429': { type: ProoflyErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new ProoflyError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = ProoflyErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = ProoflyErrorType.Authentication
    } else if (statusCode === 403) {
      type = ProoflyErrorType.Authorization
    } else if (statusCode === 404) {
      type = ProoflyErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = ProoflyErrorType.Validation
    } else if (statusCode === 429) {
      type = ProoflyErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = ProoflyErrorType.Server
      retryable = true
    }

    return new ProoflyError(message, code, type, {
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
    return this.type === ProoflyErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === ProoflyErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === ProoflyErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === ProoflyErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === ProoflyErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === ProoflyErrorType.Server
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
