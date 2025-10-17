/**
 * Types Generator
 *
 * Generate TypeScript type definitions from Integration schema.
 */

import { Integration, Resource, Operation, ParamConfig } from '../schema/integration.js'

/**
 * Types Generator class
 *
 * Generates types.ts files containing TypeScript interfaces and types
 * for Integration resources, operations, and parameters.
 */
export class TypesGenerator {
  /**
   * Generate types.ts from Integration definition
   *
   * @param integration - Integration definition
   * @returns Generated TypeScript code
   */
  generate(integration: Integration): string {
    const sections: string[] = []

    // File header
    sections.push(this.generateHeader(integration))

    // Client options type
    sections.push(this.generateClientOptionsType(integration))

    // Resource parameter types
    for (const resource of integration.resources) {
      sections.push(this.generateResourceTypes(resource))
    }

    // SDK type re-exports
    if (integration.sdkPackage) {
      sections.push(this.generateSDKReExports(integration))
    }

    return sections.join('\n\n')
  }

  /**
   * Generate file header with JSDoc
   */
  private generateHeader(integration: Integration): string {
    return `/**
 * ${integration.name} Types
 *
 * Auto-generated TypeScript types for ${integration.name} Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see ${integration.$id}
 */`
  }

  /**
   * Generate ClientOptions interface
   */
  private generateClientOptionsType(integration: Integration): string {
    const lines: string[] = []

    lines.push('/**')
    lines.push(` * ${integration.name} client options`)
    lines.push(' */')
    lines.push(`export interface ${this.pascalCase(integration.service)}ClientOptions {`)

    // Auth fields
    switch (integration.auth.type) {
      case 'api-key':
        lines.push('  /** API key for authentication */')
        lines.push('  apiKey: string')
        break
      case 'oauth2':
        lines.push('  /** OAuth2 access token */')
        lines.push('  accessToken: string')
        break
      case 'jwt':
        lines.push('  /** JWT token for authentication */')
        lines.push('  token: string')
        break
      case 'basic':
        lines.push('  /** Username for basic authentication */')
        lines.push('  username: string')
        lines.push('  /** Password for basic authentication */')
        lines.push('  password: string')
        break
    }

    // Optional fields
    lines.push('  /** Base URL override (optional) */')
    lines.push('  baseUrl?: string')
    lines.push('  /** Request timeout in milliseconds (optional) */')
    lines.push('  timeout?: number')
    lines.push('  /** Number of retry attempts (optional) */')
    lines.push('  retryAttempts?: number')

    lines.push('}')

    return lines.join('\n')
  }

  /**
   * Generate types for a resource
   */
  private generateResourceTypes(resource: Resource): string {
    const lines: string[] = []

    lines.push(`/**`)
    lines.push(` * ${resource.name} resource types`)
    lines.push(` */`)

    // Generate operation parameter types
    for (const operation of resource.operations) {
      const paramsType = this.generateOperationParamsType(resource, operation)
      if (paramsType) {
        lines.push(paramsType)
        lines.push('')
      }
    }

    return lines.join('\n')
  }

  /**
   * Generate parameter type for an operation
   */
  private generateOperationParamsType(resource: Resource, operation: Operation): string | null {
    if (!operation.params || operation.params.length === 0) {
      return null
    }

    const operationName = this.getOperationName(operation)
    const typeName = `${this.pascalCase(resource.name)}${this.pascalCase(operationName)}Params`

    const lines: string[] = []

    lines.push('/**')
    lines.push(` * Parameters for ${resource.name}.${operationName}`)
    if (operation.description) {
      lines.push(` * ${operation.description}`)
    }
    lines.push(' */')
    lines.push(`export interface ${typeName} {`)

    for (const param of operation.params) {
      lines.push(this.generateParamField(param))
    }

    lines.push('}')

    return lines.join('\n')
  }

  /**
   * Generate a parameter field
   */
  private generateParamField(param: ParamConfig): string {
    const lines: string[] = []

    // JSDoc comment
    if (param.description) {
      lines.push(`  /** ${param.description} */`)
    }

    // Field definition
    const optional = param.required ? '' : '?'
    const type = this.mapParamType(param)
    lines.push(`  ${param.name}${optional}: ${type}`)

    return lines.join('\n')
  }

  /**
   * Map parameter type to TypeScript type
   */
  private mapParamType(param: ParamConfig): string {
    switch (param.type) {
      case 'string':
        if (param.validation?.enum) {
          return param.validation.enum.map((v) => `'${v}'`).join(' | ')
        }
        return 'string'
      case 'number':
        return 'number'
      case 'boolean':
        return 'boolean'
      case 'object':
        return 'Record<string, any>'
      case 'array':
        return 'any[]'
      default:
        return 'any'
    }
  }

  /**
   * Generate SDK re-exports
   */
  private generateSDKReExports(integration: Integration): string {
    const lines: string[] = []

    lines.push('/**')
    lines.push(' * SDK type re-exports')
    lines.push(' */')
    lines.push(`export type * from '${integration.sdkPackage}'`)

    return lines.join('\n')
  }

  /**
   * Get operation name
   */
  private getOperationName(operation: Operation): string {
    return operation.name || operation.type || 'unknown'
  }

  /**
   * Convert string to PascalCase
   */
  private pascalCase(str: string): string {
    return str.replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase()).replace(/^[a-z]/, (chr) => chr.toUpperCase())
  }
}
