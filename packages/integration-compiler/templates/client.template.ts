/**
 * Client Template
 *
 * Handlebars template for generating client.ts files.
 */

export const clientTemplate = `/**
 * {{serviceName}} Client
 *
 * Auto-generated Integration client for {{serviceName}}.
 * Generated from MDXLD Integration definition.
 */

{{#if sdkPackage}}
import {{sdkImport}} from '{{sdkPackage}}'
{{/if}}
import { {{typeImports}} } from './types.js'
import { {{serviceName}}Error } from './errors.js'

/**
 * {{serviceName}} client options
 */
export interface {{serviceName}}ClientOptions {
  {{#if authConfig.type}}
  {{#if (eq authConfig.type 'api-key')}}
  apiKey: string
  {{/if}}
  {{#if (eq authConfig.type 'oauth2')}}
  accessToken: string
  {{/if}}
  {{#if (eq authConfig.type 'jwt')}}
  token: string
  {{/if}}
  {{#if (eq authConfig.type 'basic')}}
  username: string
  password: string
  {{/if}}
  {{/if}}
  baseUrl?: string
  timeout?: number
  retryAttempts?: number
}

/**
 * {{serviceName}} Client
 *
 * {{description}}
 */
export class {{serviceName}}Client {
  private options: {{serviceName}}ClientOptions
  {{#if sdkPackage}}
  private sdk: {{sdkType}}
  {{/if}}

  {{#each resources}}
  /**
   * {{name}} resource namespace
   */
  public {{camelCase name}}: {
    {{#each operations}}
    /**
     * {{#if description}}{{description}}{{else}}{{type}} {{../name}}{{/if}}
     */
    {{operationName}}: ({{#if params}}params: {{paramsType}}{{/if}}) => Promise<{{returnType}}>
    {{/each}}
  }
  {{/each}}

  constructor(options: {{serviceName}}ClientOptions) {
    this.options = {
      baseUrl: '{{baseUrl}}',
      timeout: 30000,
      retryAttempts: 3,
      ...options,
    }

    {{#if sdkPackage}}
    // Initialize SDK
    this.sdk = new {{sdkType}}({
      {{#if (eq authConfig.type 'api-key')}}
      apiKey: this.options.apiKey,
      {{/if}}
      {{#if (eq authConfig.type 'oauth2')}}
      accessToken: this.options.accessToken,
      {{/if}}
    })
    {{/if}}

    // Initialize resource namespaces
    {{#each resources}}
    this.{{camelCase name}} = {
      {{#each operations}}
      {{operationName}}: this.create{{pascalCase ../name}}{{pascalCase operationName}}.bind(this),
      {{/each}}
    }
    {{/each}}
  }

  {{#each resources}}
  {{#each operations}}
  /**
   * {{#if description}}{{description}}{{else}}{{type}} {{../name}}{{/if}}
   *
   * @param params - {{#if description}}Operation parameters{{else}}{{type}} parameters{{/if}}
   * @returns {{returnType}}
   */
  private async create{{pascalCase ../name}}{{pascalCase operationName}}({{#if params}}params: {{paramsType}}{{/if}}): Promise<{{returnType}}> {
    try {
      {{#if ../sdkPackage}}
      const result = await this.sdk.{{../name}}.{{operationName}}({{#if params}}params{{/if}})
      return result
      {{else}}
      const response = await this.request('{{method}}', '{{path}}', {{#if params}}params{{else}}undefined{{/if}})
      return response as {{returnType}}
      {{/if}}
    } catch (error) {
      throw {{serviceName}}Error.fromError(error)
    }
  }

  {{/each}}
  {{/each}}

  {{#unless sdkPackage}}
  /**
   * Make HTTP request
   *
   * @param method - HTTP method
   * @param path - Request path
   * @param data - Request data
   * @returns Response data
   */
  private async request(method: string, path: string, data?: any): Promise<any> {
    const url = \`\${this.options.baseUrl}\${path}\`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      {{#if (eq authConfig.type 'api-key')}}
      {{#if authConfig.headerName}}
      '{{authConfig.headerName}}': {{#if authConfig.scheme}}'{{authConfig.scheme}} ' + {{/if}}this.options.apiKey,
      {{/if}}
      {{/if}}
      {{#if (eq authConfig.type 'oauth2')}}
      'Authorization': 'Bearer ' + this.options.accessToken,
      {{/if}}
    }

    const config: RequestInit = {
      method,
      headers,
      signal: AbortSignal.timeout(this.options.timeout || 30000),
    }

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      config.body = JSON.stringify(data)
    }

    const response = await fetch(url, config)

    if (!response.ok) {
      throw new Error(\`HTTP \${response.status}: \${response.statusText}\`)
    }

    return response.json()
  }
  {{/unless}}
}
`
