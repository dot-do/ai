/**
 * Agent mail Errors
 *
 * Auto-generated error handling for Agent mail Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/agent_mail
 */

/**
 * Error type enum
 */
export enum AgentMailErrorType {
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
 * Agent mail Error class
 *
 * Custom error class for Agent mail Integration operations.
 */
export class AgentMailError extends Error {
  public readonly code: string | number
  public readonly type: AgentMailErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: AgentMailErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'AgentMailError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AgentMailError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns AgentMailError instance
   */
  static fromError(error: any): AgentMailError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: AgentMailErrorType; retryable: boolean }> = {
      '401': { type: AgentMailErrorType.Authentication, retryable: false },
      '429': { type: AgentMailErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new AgentMailError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = AgentMailErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = AgentMailErrorType.Authentication
    } else if (statusCode === 403) {
      type = AgentMailErrorType.Authorization
    } else if (statusCode === 404) {
      type = AgentMailErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = AgentMailErrorType.Validation
    } else if (statusCode === 429) {
      type = AgentMailErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = AgentMailErrorType.Server
      retryable = true
    }

    return new AgentMailError(message, code, type, {
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
    return this.type === AgentMailErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === AgentMailErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === AgentMailErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === AgentMailErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === AgentMailErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === AgentMailErrorType.Server
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
