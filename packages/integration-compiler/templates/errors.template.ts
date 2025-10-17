/**
 * Errors Template
 *
 * Handlebars template for generating errors.ts files.
 */

export const errorsTemplate = `/**
 * {{serviceName}} Errors
 *
 * Auto-generated error handling for {{serviceName}} Integration.
 * Generated from MDXLD Integration definition.
 */

/**
 * Error type enum
 */
export enum {{serviceName}}ErrorType {
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
 * {{serviceName}} Error class
 *
 * Custom error class for {{serviceName}} Integration operations.
 */
export class {{serviceName}}Error extends Error {
  public readonly code: string | number
  public readonly type: {{serviceName}}ErrorType
  public readonly statusCode?: number
  public readonly retryable: boolean
  public readonly originalError?: Error

  constructor(
    message: string,
    code: string | number,
    type: {{serviceName}}ErrorType,
    options?: {
      statusCode?: number
      retryable?: boolean
      originalError?: Error
    }
  ) {
    super(message)
    this.name = '{{serviceName}}Error'
    this.code = code
    this.type = type
    this.statusCode = options?.statusCode
    this.retryable = options?.retryable ?? false
    this.originalError = options?.originalError

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, {{serviceName}}Error)
    }
  }

  /**
   * Create error from API error response
   *
   * @param error - Original error
   * @returns {{serviceName}}Error instance
   */
  static fromError(error: any): {{serviceName}}Error {
    // Handle known error codes
    const code = error.code || error.error_code || error.type || 'unknown'
    const statusCode = error.statusCode || error.status
    const message = error.message || 'An unknown error occurred'

    {{#if errorMappings}}
    // Map error codes to types
    const errorMap: Record<string, { type: {{serviceName}}ErrorType; retryable: boolean }> = {
      {{#each errorMappings}}
      '{{code}}': { type: {{serviceName}}ErrorType.{{pascalCase type}}, retryable: {{#if retryable}}true{{else}}false{{/if}} },
      {{/each}}
    }

    const mapping = errorMap[code]
    if (mapping) {
      return new {{serviceName}}Error(message, code, mapping.type, {
        statusCode,
        retryable: mapping.retryable,
        originalError: error,
      })
    }
    {{/if}}

    // Default error mapping based on status code
    let type = {{serviceName}}ErrorType.Unknown
    let retryable = false

    if (statusCode === 401) {
      type = {{serviceName}}ErrorType.Authentication
    } else if (statusCode === 403) {
      type = {{serviceName}}ErrorType.Authorization
    } else if (statusCode === 404) {
      type = {{serviceName}}ErrorType.NotFound
    } else if (statusCode === 422 || statusCode === 400) {
      type = {{serviceName}}ErrorType.Validation
    } else if (statusCode === 429) {
      type = {{serviceName}}ErrorType.RateLimit
      retryable = true
    } else if (statusCode && statusCode >= 500) {
      type = {{serviceName}}ErrorType.Server
      retryable = true
    }

    return new {{serviceName}}Error(message, code, type, {
      statusCode,
      retryable,
      originalError: error,
    })
  }

  /**
   * Check if error is retryable
   */
  isRetriable(): boolean {
    return this.retryable
  }

  /**
   * Check if error is authentication error
   */
  isAuthenticationError(): boolean {
    return this.type === {{serviceName}}ErrorType.Authentication
  }

  /**
   * Check if error is authorization error
   */
  isAuthorizationError(): boolean {
    return this.type === {{serviceName}}ErrorType.Authorization
  }

  /**
   * Check if error is validation error
   */
  isValidationError(): boolean {
    return this.type === {{serviceName}}ErrorType.Validation
  }

  /**
   * Check if error is not found error
   */
  isNotFoundError(): boolean {
    return this.type === {{serviceName}}ErrorType.NotFound
  }

  /**
   * Check if error is rate limit error
   */
  isRateLimitError(): boolean {
    return this.type === {{serviceName}}ErrorType.RateLimit
  }

  /**
   * Check if error is server error
   */
  isServerError(): boolean {
    return this.type === {{serviceName}}ErrorType.Server
  }

  /**
   * Get error details as object
   */
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
`
