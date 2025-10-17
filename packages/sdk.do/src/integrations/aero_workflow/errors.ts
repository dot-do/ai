/**
 * Aero workflow Errors
 *
 * Auto-generated error handling for Aero workflow Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/aero_workflow
 */

/**
 * Error type enum
 */
export enum AeroWorkflowErrorType {
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
 * Aero workflow Error class
 *
 * Custom error class for Aero workflow Integration operations.
 */
export class AeroWorkflowError extends Error {
  public readonly code: string | number
  public readonly type: AeroWorkflowErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: AeroWorkflowErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'AeroWorkflowError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AeroWorkflowError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns AeroWorkflowError instance
   */
  static fromError(error: any): AeroWorkflowError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: AeroWorkflowErrorType; retryable: boolean }> = {
      '401': { type: AeroWorkflowErrorType.Authentication, retryable: false },
      '429': { type: AeroWorkflowErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new AeroWorkflowError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = AeroWorkflowErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = AeroWorkflowErrorType.Authentication
    } else if (statusCode === 403) {
      type = AeroWorkflowErrorType.Authorization
    } else if (statusCode === 404) {
      type = AeroWorkflowErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = AeroWorkflowErrorType.Validation
    } else if (statusCode === 429) {
      type = AeroWorkflowErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = AeroWorkflowErrorType.Server
      retryable = true
    }

    return new AeroWorkflowError(message, code, type, {
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
    return this.type === AeroWorkflowErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === AeroWorkflowErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === AeroWorkflowErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === AeroWorkflowErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === AeroWorkflowErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === AeroWorkflowErrorType.Server
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
