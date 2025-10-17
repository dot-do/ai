/**
 * Custom error classes for Composio client
 */

/**
 * Base error class for Composio-related errors
 */
export class ComposioError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
    public originalError?: any
  ) {
    super(message)
    this.name = 'ComposioError'
    Object.setPrototypeOf(this, ComposioError.prototype)
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      statusCode: this.statusCode,
    }
  }
}

/**
 * Authentication error
 */
export class ComposioAuthError extends ComposioError {
  constructor(message: string = 'Authentication failed', originalError?: any) {
    super(message, 'AUTH_FAILED', 401, originalError)
    this.name = 'ComposioAuthError'
    Object.setPrototypeOf(this, ComposioAuthError.prototype)
  }
}

/**
 * Rate limit error
 */
export class ComposioRateLimitError extends ComposioError {
  constructor(
    message: string = 'Rate limit exceeded',
    public retryAfter?: number,
    originalError?: any
  ) {
    super(message, 'RATE_LIMIT', 429, originalError)
    this.name = 'ComposioRateLimitError'
    Object.setPrototypeOf(this, ComposioRateLimitError.prototype)
  }
}

/**
 * Not found error
 */
export class ComposioNotFoundError extends ComposioError {
  constructor(message: string = 'Resource not found', originalError?: any) {
    super(message, 'NOT_FOUND', 404, originalError)
    this.name = 'ComposioNotFoundError'
    Object.setPrototypeOf(this, ComposioNotFoundError.prototype)
  }
}

/**
 * Validation error
 */
export class ComposioValidationError extends ComposioError {
  constructor(message: string = 'Invalid request parameters', originalError?: any) {
    super(message, 'VALIDATION_ERROR', 400, originalError)
    this.name = 'ComposioValidationError'
    Object.setPrototypeOf(this, ComposioValidationError.prototype)
  }
}

/**
 * Network error
 */
export class ComposioNetworkError extends ComposioError {
  constructor(message: string = 'Network error', originalError?: any) {
    super(message, 'NETWORK_ERROR', undefined, originalError)
    this.name = 'ComposioNetworkError'
    Object.setPrototypeOf(this, ComposioNetworkError.prototype)
  }
}

/**
 * Timeout error
 */
export class ComposioTimeoutError extends ComposioError {
  constructor(message: string = 'Request timeout', originalError?: any) {
    super(message, 'TIMEOUT', 408, originalError)
    this.name = 'ComposioTimeoutError'
    Object.setPrototypeOf(this, ComposioTimeoutError.prototype)
  }
}

/**
 * Service error (5xx)
 */
export class ComposioServiceError extends ComposioError {
  constructor(message: string = 'Service error', statusCode: number = 500, originalError?: any) {
    super(message, 'SERVICE_ERROR', statusCode, originalError)
    this.name = 'ComposioServiceError'
    Object.setPrototypeOf(this, ComposioServiceError.prototype)
  }
}

/**
 * Map error to appropriate error class
 */
export function mapError(error: any): ComposioError {
  // Handle network errors
  if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT' || error.code === 'ENOTFOUND') {
    return new ComposioNetworkError(error.message, error)
  }

  // Handle timeout errors
  if (error.name === 'AbortError' || error.code === 'ETIMEDOUT') {
    return new ComposioTimeoutError(error.message, error)
  }

  // Handle HTTP errors
  if (error.status || error.statusCode) {
    const status = error.status || error.statusCode

    if (status === 401 || status === 403) {
      return new ComposioAuthError(error.message || 'Authentication failed', error)
    }

    if (status === 404) {
      return new ComposioNotFoundError(error.message || 'Resource not found', error)
    }

    if (status === 400 || status === 422) {
      return new ComposioValidationError(error.message || 'Invalid request', error)
    }

    if (status === 429) {
      const retryAfter = error.headers?.['retry-after'] ? parseInt(error.headers['retry-after']) : undefined
      return new ComposioRateLimitError(error.message || 'Rate limit exceeded', retryAfter, error)
    }

    if (status >= 500) {
      return new ComposioServiceError(error.message || 'Service error', status, error)
    }
  }

  // Default to generic error
  return new ComposioError(error.message || 'Unknown error', 'UNKNOWN', undefined, error)
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: any): boolean {
  // Network errors are retryable
  if (error instanceof ComposioNetworkError) {
    return true
  }

  // 5xx errors are retryable
  if (error instanceof ComposioServiceError) {
    return true
  }

  // Rate limit errors are retryable (with backoff)
  if (error instanceof ComposioRateLimitError) {
    return true
  }

  // Timeout errors are retryable
  if (error instanceof ComposioTimeoutError) {
    return true
  }

  // Everything else is not retryable
  return false
}
