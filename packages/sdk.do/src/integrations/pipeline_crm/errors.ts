/**
 * Pipeline crm Errors
 *
 * Auto-generated error handling for Pipeline crm Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/pipeline_crm
 */

/**
 * Error type enum
 */
export enum PipelineCrmErrorType {
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
 * Pipeline crm Error class
 *
 * Custom error class for Pipeline crm Integration operations.
 */
export class PipelineCrmError extends Error {
  public readonly code: string | number
  public readonly type: PipelineCrmErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: PipelineCrmErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'PipelineCrmError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PipelineCrmError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns PipelineCrmError instance
   */
  static fromError(error: any): PipelineCrmError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: PipelineCrmErrorType; retryable: boolean }> = {
      '401': { type: PipelineCrmErrorType.Authentication, retryable: false },
      '429': { type: PipelineCrmErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new PipelineCrmError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = PipelineCrmErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = PipelineCrmErrorType.Authentication
    } else if (statusCode === 403) {
      type = PipelineCrmErrorType.Authorization
    } else if (statusCode === 404) {
      type = PipelineCrmErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = PipelineCrmErrorType.Validation
    } else if (statusCode === 429) {
      type = PipelineCrmErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = PipelineCrmErrorType.Server
      retryable = true
    }

    return new PipelineCrmError(message, code, type, {
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
    return this.type === PipelineCrmErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === PipelineCrmErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === PipelineCrmErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === PipelineCrmErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === PipelineCrmErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === PipelineCrmErrorType.Server
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
