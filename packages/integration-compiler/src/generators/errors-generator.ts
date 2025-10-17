/**
 * Errors Generator
 *
 * Generate error handling classes from Integration schema.
 */

import { Integration } from '../schema/integration.js'

/**
 * Errors Generator class
 *
 * Generates errors.ts files containing custom error classes
 * with error mapping and classification methods.
 */
export class ErrorsGenerator {
  /**
   * Generate errors.ts from Integration definition
   *
   * @param integration - Integration definition
   * @returns Generated TypeScript code
   */
  generate(integration: Integration): string {
    const sections: string[] = []

    // File header
    sections.push(this.generateHeader(integration))

    // Error type enum
    sections.push(this.generateErrorTypeEnum(integration))

    // Error class
    sections.push(this.generateErrorClass(integration))

    return sections.join('\n\n')
  }

  /**
   * Generate file header
   */
  private generateHeader(integration: Integration): string {
    return `/**
 * ${integration.name} Errors
 *
 * Auto-generated error handling for ${integration.name} Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see ${integration.$id}
 */`
  }

  /**
   * Generate error type enum
   */
  private generateErrorTypeEnum(integration: Integration): string {
    const lines: string[] = []

    lines.push('/**')
    lines.push(' * Error type enum')
    lines.push(' */')
    lines.push(`export enum ${this.getServiceName(integration)}ErrorType {`)
    lines.push("  Authentication = 'authentication',")
    lines.push("  Authorization = 'authorization',")
    lines.push("  Validation = 'validation',")
    lines.push("  NotFound = 'not_found',")
    lines.push("  RateLimit = 'rate_limit',")
    lines.push("  Server = 'server',")
    lines.push("  Network = 'network',")
    lines.push("  Unknown = 'unknown',")
    lines.push('}')

    return lines.join('\n')
  }

  /**
   * Generate error class
   */
  private generateErrorClass(integration: Integration): string {
    const lines: string[] = []

    lines.push('/**')
    lines.push(` * ${integration.name} Error class`)
    lines.push(' *')
    lines.push(` * Custom error class for ${integration.name} Integration operations.`)
    lines.push(' */')
    lines.push(`export class ${this.getServiceName(integration)}Error extends Error {`)
    lines.push('  public readonly code: string | number')
    lines.push(`  public readonly type: ${this.getServiceName(integration)}ErrorType`)
    lines.push('  public readonly statusCode?: number')
    lines.push('  public readonly retryable: boolean')
    lines.push('  public readonly originalError?: Error')
    lines.push('')
    lines.push('  constructor(')
    lines.push('    message: string,')
    lines.push('    code: string | number,')
    lines.push(`    type: ${this.getServiceName(integration)}ErrorType,`)
    lines.push('    options?: {')
    lines.push('      statusCode?: number')
    lines.push('      retryable?: boolean')
    lines.push('      originalError?: Error')
    lines.push('    }')
    lines.push('  ) {')
    lines.push('    super(message)')
    lines.push(`    this.name = '${this.getServiceName(integration)}Error'`)
    lines.push('    this.code = code')
    lines.push('    this.type = type')
    lines.push('    this.statusCode = options?.statusCode')
    lines.push('    this.retryable = options?.retryable ?? false')
    lines.push('    this.originalError = options?.originalError')
    lines.push('')
    lines.push('    // Maintain proper stack trace')
    lines.push('    if (Error.captureStackTrace) {')
    lines.push(`      Error.captureStackTrace(this, ${this.getServiceName(integration)}Error)`)
    lines.push('    }')
    lines.push('  }')

    // fromError static method
    lines.push('')
    lines.push(this.generateFromErrorMethod(integration))

    // Helper methods
    lines.push('')
    lines.push(this.generateHelperMethods(integration))

    lines.push('}')

    return lines.join('\n')
  }

  /**
   * Generate fromError static method
   */
  private generateFromErrorMethod(integration: Integration): string {
    const lines: string[] = []

    lines.push('  /**')
    lines.push('   * Create error from API error response')
    lines.push('   *')
    lines.push('   * @param error - Original error')
    lines.push(`   * @returns ${this.getServiceName(integration)}Error instance`)
    lines.push('   */')
    lines.push(`  static fromError(error: any): ${this.getServiceName(integration)}Error {`)
    lines.push("    const code = error.code || error.error_code || error.type || 'unknown'")
    lines.push('    const statusCode = error.statusCode || error.status')
    lines.push("    const message = error.message || 'An unknown error occurred'")
    lines.push('')

    // Error mapping if configured
    if (integration.errors?.mapping && integration.errors.mapping.length > 0) {
      lines.push('    // Map error codes to types')
      lines.push(`    const errorMap: Record<string, { type: ${this.getServiceName(integration)}ErrorType; retryable: boolean }> = {`)

      for (const mapping of integration.errors.mapping) {
        const typeValue = `${this.getServiceName(integration)}ErrorType.${this.pascalCase(mapping.type)}`
        lines.push(`      '${mapping.code}': { type: ${typeValue}, retryable: ${mapping.retryable || false} },`)
      }

      lines.push('    }')
      lines.push('')
      lines.push('    const mapping = errorMap[code]')
      lines.push('    if (mapping) {')
      lines.push(`      return new ${this.getServiceName(integration)}Error(message, code, mapping.type, {`)
      lines.push('        statusCode,')
      lines.push('        retryable: mapping.retryable,')
      lines.push('        originalError: error,')
      lines.push('      })')
      lines.push('    }')
      lines.push('')
    }

    // Default error mapping based on status code
    lines.push('    // Default error mapping based on status code')
    lines.push(`    let type = ${this.getServiceName(integration)}ErrorType.Unknown`)
    lines.push('    let retryable = false')
    lines.push('')
    lines.push('    if (statusCode === 401) {')
    lines.push(`      type = ${this.getServiceName(integration)}ErrorType.Authentication`)
    lines.push('    } else if (statusCode === 403) {')
    lines.push(`      type = ${this.getServiceName(integration)}ErrorType.Authorization`)
    lines.push('    } else if (statusCode === 404) {')
    lines.push(`      type = ${this.getServiceName(integration)}ErrorType.NotFound`)
    lines.push('    } else if (statusCode === 422 || statusCode === 400) {')
    lines.push(`      type = ${this.getServiceName(integration)}ErrorType.Validation`)
    lines.push('    } else if (statusCode === 429) {')
    lines.push(`      type = ${this.getServiceName(integration)}ErrorType.RateLimit`)
    lines.push('      retryable = true')
    lines.push('    } else if (statusCode && statusCode >= 500) {')
    lines.push(`      type = ${this.getServiceName(integration)}ErrorType.Server`)
    lines.push('      retryable = true')
    lines.push('    }')
    lines.push('')
    lines.push(`    return new ${this.getServiceName(integration)}Error(message, code, type, {`)
    lines.push('      statusCode,')
    lines.push('      retryable,')
    lines.push('      originalError: error,')
    lines.push('    })')
    lines.push('  }')

    return lines.join('\n')
  }

  /**
   * Generate helper methods
   */
  private generateHelperMethods(integration: Integration): string {
    const lines: string[] = []

    lines.push('  /** Check if error is retryable */')
    lines.push('  isRetriable(): boolean {')
    lines.push('    return this.retryable')
    lines.push('  }')
    lines.push('')
    lines.push('  /** Check if error is authentication error */')
    lines.push('  isAuthenticationError(): boolean {')
    lines.push(`    return this.type === ${this.getServiceName(integration)}ErrorType.Authentication`)
    lines.push('  }')
    lines.push('')
    lines.push('  /** Check if error is authorization error */')
    lines.push('  isAuthorizationError(): boolean {')
    lines.push(`    return this.type === ${this.getServiceName(integration)}ErrorType.Authorization`)
    lines.push('  }')
    lines.push('')
    lines.push('  /** Check if error is validation error */')
    lines.push('  isValidationError(): boolean {')
    lines.push(`    return this.type === ${this.getServiceName(integration)}ErrorType.Validation`)
    lines.push('  }')
    lines.push('')
    lines.push('  /** Check if error is not found error */')
    lines.push('  isNotFoundError(): boolean {')
    lines.push(`    return this.type === ${this.getServiceName(integration)}ErrorType.NotFound`)
    lines.push('  }')
    lines.push('')
    lines.push('  /** Check if error is rate limit error */')
    lines.push('  isRateLimitError(): boolean {')
    lines.push(`    return this.type === ${this.getServiceName(integration)}ErrorType.RateLimit`)
    lines.push('  }')
    lines.push('')
    lines.push('  /** Check if error is server error */')
    lines.push('  isServerError(): boolean {')
    lines.push(`    return this.type === ${this.getServiceName(integration)}ErrorType.Server`)
    lines.push('  }')
    lines.push('')
    lines.push('  /** Get error details as object */')
    lines.push('  toJSON() {')
    lines.push('    return {')
    lines.push('      name: this.name,')
    lines.push('      message: this.message,')
    lines.push('      code: this.code,')
    lines.push('      type: this.type,')
    lines.push('      statusCode: this.statusCode,')
    lines.push('      retryable: this.retryable,')
    lines.push('    }')
    lines.push('  }')

    return lines.join('\n')
  }

  /**
   * Convert to PascalCase
   */
  private pascalCase(str: string): string {
    return str.replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase()).replace(/^[a-z]/, (chr) => chr.toUpperCase())
  }

  /**
   * Get service name for identifier usage (PascalCase)
   */
  private getServiceName(integration: Integration): string {
    return this.pascalCase(integration.service)
  }
}
