/**
 * Prisma Errors
 *
 * Auto-generated error handling for Prisma Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/prisma
 */

/**
 * Error type enum
 */
export enum PrismaErrorType {
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
 * Prisma Error class
 *
 * Custom error class for Prisma Integration operations.
 */
export class PrismaError extends Error {
  public readonly code: string | number
  public readonly type: PrismaErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: PrismaErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = 'PrismaError'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PrismaError)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns PrismaError instance
   */
  static fromError(error: any): PrismaError {
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    // Map error codes to types
    const errorMap: Record<string, { type: PrismaErrorType; retryable: boolean }> = {
      '401': { type: PrismaErrorType.Authentication, retryable: false },
      '429': { type: PrismaErrorType.RateLimit, retryable: true },
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new PrismaError(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }

    // Default error mapping based on status code
    let type = PrismaErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = PrismaErrorType.Authentication
    } else if (statusCode === 403) {
      type = PrismaErrorType.Authorization
    } else if (statusCode === 404) {
      type = PrismaErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = PrismaErrorType.Validation
    } else if (statusCode === 429) {
      type = PrismaErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = PrismaErrorType.Server
      retryable = true
    }

    return new PrismaError(message, code, type, {
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
    return this.type === PrismaErrorType.Authentication
  }

  /** Check if error is authorization error */
  isAuthorizationError(): boolean {
    return this.type === PrismaErrorType.Authorization
  }

  /** Check if error is validation error */
  isValidationError(): boolean {
    return this.type === PrismaErrorType.Validation
  }

  /** Check if error is not found error */
  isNotFoundError(): boolean {
    return this.type === PrismaErrorType.NotFound
  }

  /** Check if error is rate limit error */
  isRateLimitError(): boolean {
    return this.type === PrismaErrorType.RateLimit
  }

  /** Check if error is server error */
  isServerError(): boolean {
    return this.type === PrismaErrorType.Server
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
