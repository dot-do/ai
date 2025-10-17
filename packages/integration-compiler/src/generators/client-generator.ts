/**
 * Client Generator
 *
 * Generate TypeScript client class from Integration schema.
 */

import { Integration, Resource, Operation } from '../schema/integration.js'

/**
 * Client Generator class
 *
 * Generates client.ts files containing the main Integration client class
 * with resource namespaces and operation methods.
 */
export class ClientGenerator {
  /**
   * Generate client.ts from Integration definition
   *
   * @param integration - Integration definition
   * @returns Generated TypeScript code
   */
  generate(integration: Integration): string {
    const sections: string[] = []

    // File header
    sections.push(this.generateHeader(integration))

    // Imports
    sections.push(this.generateImports(integration))

    // Client options interface
    sections.push(this.generateClientOptionsInterface(integration))

    // Client class
    sections.push(this.generateClientClass(integration))

    return sections.join('\n\n')
  }

  /**
   * Generate file header
   */
  private generateHeader(integration: Integration): string {
    return `/**
 * ${integration.name} Client
 *
 * Auto-generated Integration client for ${integration.name}.
 * Generated from MDXLD Integration definition.
 *
 * @see ${integration.$id}
 */`
  }

  /**
   * Generate imports
   */
  private generateImports(integration: Integration): string {
    const lines: string[] = []

    // SDK import if configured
    if (integration.sdkPackage) {
      const sdkImport = integration.sdkImport || this.extractSDKName(integration.sdkPackage)
      lines.push(`import ${sdkImport} from '${integration.sdkPackage}'`)
    }

    // Type imports
    const typeNames = this.collectTypeNames(integration)
    if (typeNames.length > 0) {
      lines.push(`import { ${typeNames.join(', ')} } from './types.js'`)
    }

    // Error import
    lines.push(`import { ${this.getServiceName(integration)}Error } from './errors.js'`)

    return lines.join('\n')
  }

  /**
   * Generate ClientOptions interface
   */
  private generateClientOptionsInterface(integration: Integration): string {
    const lines: string[] = []

    lines.push('/**')
    lines.push(` * ${integration.name} client options`)
    lines.push(' */')
    lines.push(`export interface ${this.getServiceName(integration)}ClientOptions {`)

    // Auth fields based on type
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
        lines.push('  /** JWT token */')
        lines.push('  token: string')
        break
      case 'basic':
        lines.push('  /** Basic auth username */')
        lines.push('  username: string')
        lines.push('  /** Basic auth password */')
        lines.push('  password: string')
        break
    }

    lines.push('  /** Base URL override */')
    lines.push('  baseUrl?: string')
    lines.push('  /** Request timeout in ms */')
    lines.push('  timeout?: number')
    lines.push('  /** Retry attempts */')
    lines.push('  retryAttempts?: number')
    lines.push('}')

    return lines.join('\n')
  }

  /**
   * Generate client class
   */
  private generateClientClass(integration: Integration): string {
    const lines: string[] = []

    lines.push('/**')
    lines.push(` * ${integration.name} Client`)
    lines.push(' *')
    lines.push(` * ${integration.description}`)
    lines.push(' */')
    lines.push(`export class ${this.getServiceName(integration)}Client {`)
    lines.push(`  private options: ${this.getServiceName(integration)}ClientOptions`)

    if (integration.sdkPackage) {
      const sdkImport = integration.sdkImport || this.extractSDKName(integration.sdkPackage)
      lines.push(`  private sdk: ${sdkImport}`)
    }

    // Resource namespaces
    for (const resource of integration.resources) {
      lines.push('')
      lines.push('  /**')
      lines.push(`   * ${resource.name} resource`)
      if (resource.description) {
        lines.push(`   * ${resource.description}`)
      }
      lines.push('   */')
      lines.push(`  public ${this.camelCase(resource.name)}: {`)

      for (const operation of resource.operations) {
        const opName = this.getOperationName(operation)
        const paramsType = this.getParamsTypeName(resource, operation)
        const returnType = operation.returns || 'any'

        lines.push(`    /** ${operation.description || `${operation.type} ${resource.name}`} */`)
        lines.push(`    ${opName}: (${paramsType ? `params: ${paramsType}` : ''}) => Promise<${returnType}>`)
      }

      lines.push('  }')
    }

    // Constructor
    lines.push('')
    lines.push(`  constructor(options: ${this.getServiceName(integration)}ClientOptions) {`)
    lines.push('    this.options = {')
    lines.push(`      baseUrl: '${integration.baseUrl}',`)
    lines.push('      timeout: 30000,')
    lines.push('      retryAttempts: 3,')
    lines.push('      ...options,')
    lines.push('    }')

    // Initialize SDK if configured
    if (integration.sdkPackage) {
      const sdkImport = integration.sdkImport || this.extractSDKName(integration.sdkPackage)
      lines.push('')
      lines.push('    // Initialize SDK')

      // For SDK-based integrations, many SDKs (like Stripe) accept API key directly
      // Others may need an options object - check auth type
      if (integration.auth.type === 'api-key' && integration.sdkBased) {
        // Direct API key initialization (Stripe pattern)
        lines.push(`    this.sdk = new ${sdkImport}(this.options.apiKey, {`)
        if (integration.apiVersion) {
          lines.push(`      apiVersion: '${integration.apiVersion}',`)
        }
        lines.push('    })')
      } else {
        // Object-based initialization (standard pattern)
        lines.push(`    this.sdk = new ${sdkImport}({`)
        switch (integration.auth.type) {
          case 'api-key':
            lines.push('      apiKey: this.options.apiKey,')
            break
          case 'oauth2':
            lines.push('      accessToken: this.options.accessToken,')
            break
        }
        lines.push('    })')
      }
    }

    // Initialize resource namespaces
    lines.push('')
    lines.push('    // Initialize resource namespaces')
    for (const resource of integration.resources) {
      lines.push(`    this.${this.camelCase(resource.name)} = {`)

      for (const operation of resource.operations) {
        const opName = this.getOperationName(operation)
        const methodName = `${this.camelCase(resource.name)}${this.pascalCase(opName)}`
        lines.push(`      ${opName}: this.${methodName}.bind(this),`)
      }

      lines.push('    }')
    }

    lines.push('  }')

    // Operation methods
    for (const resource of integration.resources) {
      for (const operation of resource.operations) {
        lines.push('')
        lines.push(this.generateOperationMethod(integration, resource, operation))
      }
    }

    // HTTP request method if not using SDK
    if (!integration.sdkPackage) {
      lines.push('')
      lines.push(this.generateRequestMethod(integration))
    }

    lines.push('}')

    return lines.join('\n')
  }

  /**
   * Generate operation method
   */
  private generateOperationMethod(integration: Integration, resource: Resource, operation: Operation): string {
    const lines: string[] = []
    const opName = this.getOperationName(operation)
    const methodName = `${this.camelCase(resource.name)}${this.pascalCase(opName)}`
    const paramsType = this.getParamsTypeName(resource, operation)
    const returnType = operation.returns || 'any'

    lines.push('  /**')
    lines.push(`   * ${operation.description || `${operation.type} ${resource.name}`}`)
    if (paramsType) {
      lines.push('   * @param params - Operation parameters')
    }
    lines.push(`   * @returns ${returnType}`)
    lines.push('   */')
    lines.push(`  private async ${methodName}(${paramsType ? `params: ${paramsType}` : ''}): Promise<${returnType}> {`)
    lines.push('    try {')

    if (integration.sdkPackage) {
      // Use SDK
      // Use sdkPath if provided, otherwise fall back to camelCase(plural or name)
      const sdkPath = resource.sdkPath || this.camelCase(resource.plural || resource.name)
      const methodName = operation.method || opName
      lines.push(`      const result = await this.sdk.${sdkPath}.${methodName}(${paramsType ? 'params' : ''})`)
      lines.push('      return result')
    } else {
      // Use HTTP request
      const path = operation.path ? this.interpolatePath(operation.path) : ''
      const method = operation.method || 'GET'
      lines.push(`      const response = await this.request('${method}', '${path}', ${paramsType ? 'params' : 'undefined'})`)
      lines.push(`      return response as ${returnType}`)
    }

    lines.push('    } catch (error) {')
    lines.push(`      throw ${this.getServiceName(integration)}Error.fromError(error)`)
    lines.push('    }')
    lines.push('  }')

    return lines.join('\n')
  }

  /**
   * Generate HTTP request method
   */
  private generateRequestMethod(integration: Integration): string {
    const lines: string[] = []

    lines.push('  /**')
    lines.push('   * Make HTTP request')
    lines.push('   * @param method - HTTP method')
    lines.push('   * @param path - Request path')
    lines.push('   * @param data - Request data')
    lines.push('   * @returns Response data')
    lines.push('   */')
    lines.push('  private async request(method: string, path: string, data?: any): Promise<any> {')
    lines.push('    const url = `${this.options.baseUrl}${path}`')
    lines.push('    const headers: Record<string, string> = {')
    lines.push("      'Content-Type': 'application/json',")

    // Add auth headers
    if (integration.auth.type === 'api-key' && integration.auth.headerName) {
      const scheme = integration.auth.scheme || ''
      lines.push(`      '${integration.auth.headerName}': ${scheme ? `'${scheme} ' + ` : ''}this.options.apiKey,`)
    } else if (integration.auth.type === 'oauth2') {
      lines.push("      'Authorization': 'Bearer ' + this.options.accessToken,")
    }

    lines.push('    }')
    lines.push('')
    lines.push('    const config: RequestInit = {')
    lines.push('      method,')
    lines.push('      headers,')
    lines.push('      signal: AbortSignal.timeout(this.options.timeout || 30000),')
    lines.push('    }')
    lines.push('')
    lines.push("    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {")
    lines.push('      config.body = JSON.stringify(data)')
    lines.push('    }')
    lines.push('')
    lines.push('    const response = await fetch(url, config)')
    lines.push('')
    lines.push('    if (!response.ok) {')
    lines.push('      throw new Error(`HTTP ${response.status}: ${response.statusText}`)')
    lines.push('    }')
    lines.push('')
    lines.push('    return response.json()')
    lines.push('  }')

    return lines.join('\n')
  }

  /**
   * Collect all type names needed for imports
   */
  private collectTypeNames(integration: Integration): string[] {
    const names = new Set<string>()

    for (const resource of integration.resources) {
      for (const operation of resource.operations) {
        if (operation.params && operation.params.length > 0) {
          const typeName = this.getParamsTypeName(resource, operation)
          if (typeName) {
            names.add(typeName)
          }
        }
      }
    }

    return Array.from(names)
  }

  /**
   * Get params type name for an operation
   */
  private getParamsTypeName(resource: Resource, operation: Operation): string | null {
    if (!operation.params || operation.params.length === 0) {
      return null
    }

    const opName = this.getOperationName(operation)
    return `${this.pascalCase(resource.name)}${this.pascalCase(opName)}Params`
  }

  /**
   * Get operation name
   */
  private getOperationName(operation: Operation): string {
    return operation.name || operation.type || 'unknown'
  }

  /**
   * Extract SDK name from package
   */
  private extractSDKName(pkg: string): string {
    const parts = pkg.split('/')
    const name = parts[parts.length - 1]
    return this.pascalCase(name)
  }

  /**
   * Get service name for identifier usage (PascalCase)
   */
  private getServiceName(integration: Integration): string {
    return this.pascalCase(integration.service)
  }

  /**
   * Interpolate path parameters
   */
  private interpolatePath(path: string): string {
    // Replace {param} with ${params.param}
    return path.replace(/\{(\w+)\}/g, '${params.$1}')
  }

  /**
   * Convert to PascalCase
   */
  private pascalCase(str: string): string {
    return str.replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase()).replace(/^[a-z]/, (chr) => chr.toUpperCase())
  }

  /**
   * Convert to camelCase
   */
  private camelCase(str: string): string {
    return str.replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase()).replace(/^[A-Z]/, (chr) => chr.toLowerCase())
  }
}
