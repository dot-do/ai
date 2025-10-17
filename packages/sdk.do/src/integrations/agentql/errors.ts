/**
 * Agentql Errors
 *
 * Auto-generated error handling for Agentql Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/agentql
 */

/**
 * Error type enum
 */
export enum AgentqlErrorType {
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
 * Agentql Error class
 *
 * Custom error class for Agentql Integration operations.
 */
export class AgentqlError extends Error {
  public readonly code: string | number
  public readonly type: AgentqlErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: AgentqlErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'AgentqlError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AgentqlError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns AgentqlError instance
   */
  static fromError(error: any): AgentqlError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: AgentqlErrorType; retryable: boolean }> = {
      '401': { type: AgentqlErrorType.Authentication, retryable: false },
      '429': { type: AgentqlErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new AgentqlError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = AgentqlErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = AgentqlErrorType.Authentication
    } else if (statusCode === 403) {
      type = AgentqlErrorType.Authorization
    } else if (statusCode === 404) {
      type = AgentqlErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = AgentqlErrorType.Validation
    } else if (statusCode === 429) {
      type = AgentqlErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = AgentqlErrorType.Server
      retryable = true
    }

    return new AgentqlError(message, code, type, {
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
    return this.type === AgentqlErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === AgentqlErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === AgentqlErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === AgentqlErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === AgentqlErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === AgentqlErrorType.Server
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
