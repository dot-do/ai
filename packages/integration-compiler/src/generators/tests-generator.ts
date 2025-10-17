/**
 * Tests Generator
 *
 * Generate E2E test files from Integration schema.
 */

import { Integration, Resource, Operation, TestScenario } from '../schema/integration.js'

/**
 * Tests Generator class
 *
 * Generates E2E test files with test scenarios, resource tests,
 * and cleanup logic.
 */
export class TestsGenerator {
  /**
   * Generate E2E test file from Integration definition
   *
   * @param integration - Integration definition
   * @returns Generated TypeScript test code or null if tests not enabled
   */
  generate(integration: Integration): string | null {
    if (!integration.tests?.enabled) {
      return null
    }

    const sections: string[] = []

    // File header
    sections.push(this.generateHeader(integration))

    // Imports
    sections.push(this.generateImports(integration))

    // Test suite
    sections.push(this.generateTestSuite(integration))

    return sections.join('\n\n')
  }

  /**
   * Generate file header
   */
  private generateHeader(integration: Integration): string {
    return `/**
 * ${integration.name} Integration Tests
 *
 * Auto-generated E2E tests for ${integration.name} Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see ${integration.$id}
 */`
  }

  /**
   * Generate imports
   */
  private generateImports(integration: Integration): string {
    return `import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { ${this.getServiceName(integration)}Client } from './client.js'`
  }

  /**
   * Generate test suite
   */
  private generateTestSuite(integration: Integration): string {
    const lines: string[] = []

    lines.push(`describe('${integration.name} Integration', () => {`)
    lines.push(`  let client: ${this.getServiceName(integration)}Client`)
    lines.push('  const testResources: any[] = []')
    lines.push('')

    // beforeAll hook
    lines.push('  beforeAll(() => {')
    lines.push('    // Initialize client')
    lines.push(`    client = new ${this.getServiceName(integration)}Client({`)

    switch (integration.auth.type) {
      case 'api-key':
        lines.push(`      apiKey: process.env.${this.constantCase(integration.service)}_API_KEY || '',`)
        break
      case 'oauth2':
        lines.push(`      accessToken: process.env.${this.constantCase(integration.service)}_ACCESS_TOKEN || '',`)
        break
      case 'jwt':
        lines.push(`      token: process.env.${this.constantCase(integration.service)}_TOKEN || '',`)
        break
      case 'basic':
        lines.push(`      username: process.env.${this.constantCase(integration.service)}_USERNAME || '',`)
        lines.push(`      password: process.env.${this.constantCase(integration.service)}_PASSWORD || '',`)
        break
    }

    lines.push('    })')
    lines.push('  })')
    lines.push('')

    // afterAll hook for cleanup
    if (integration.tests?.cleanup) {
      lines.push('  afterAll(async () => {')
      lines.push('    // Cleanup test resources')
      lines.push('    for (const resource of testResources) {')
      lines.push('      try {')
      lines.push('        if (resource.type && resource.id) {')
      lines.push('          console.log(`Cleaning up ${resource.type}: ${resource.id}`)')
      lines.push('          // Add cleanup logic')
      lines.push('        }')
      lines.push('      } catch (error) {')
      lines.push("        console.error('Cleanup error:', error)")
      lines.push('      }')
      lines.push('    }')
      lines.push('  })')
      lines.push('')
    }

    // Custom test scenarios
    if (integration.tests?.scenarios && integration.tests.scenarios.length > 0) {
      for (const scenario of integration.tests.scenarios) {
        lines.push(this.generateScenarioTest(integration, scenario))
        lines.push('')
      }
    }

    // Resource tests
    for (const resource of integration.resources) {
      lines.push(this.generateResourceTests(integration, resource))
      lines.push('')
    }

    lines.push('})')

    return lines.join('\n')
  }

  /**
   * Generate test scenario
   */
  private generateScenarioTest(_integration: Integration, scenario: TestScenario): string {
    const lines: string[] = []

    lines.push(`  describe('${scenario.name}', () => {`)

    // Skip condition
    if (scenario.skipIf) {
      lines.push(`    const skip = ${scenario.skipIf}`)
      lines.push('    if (skip) {')
      lines.push(`      it.skip('${scenario.name} (skipped)', () => {})`)
      lines.push('      return')
      lines.push('    }')
      lines.push('')
    }

    const testName = scenario.description || `should ${scenario.name}`
    lines.push(`    it('${testName}', async () => {`)

    // Generate steps
    for (const step of scenario.steps) {
      lines.push(this.generateTestStep(step, 6))
    }

    lines.push('    })')
    lines.push('  })')

    return lines.join('\n')
  }

  /**
   * Generate test step
   */
  private generateTestStep(step: any, indent: number): string {
    const pad = ' '.repeat(indent)
    const lines: string[] = []

    switch (step.action) {
      case 'create':
        {
          const varName = this.sanitizeVarName(step.resource)
          const resourceName = this.camelCase(step.resource)
          lines.push(`${pad}// Create ${step.resource}`)
          lines.push(`${pad}const ${varName} = await client.${resourceName}.create(${JSON.stringify(step.params || {})})`)
          lines.push(`${pad}expect(${varName}).toBeDefined()`)
          if (step.expects?.fields) {
            for (const [key, value] of Object.entries(step.expects.fields)) {
              lines.push(`${pad}expect(${varName}.${key}).toBe(${JSON.stringify(value)})`)
            }
          }
          lines.push(`${pad}testResources.push({ type: '${step.resource}', id: ${varName}.id })`)
        }
        break

      case 'retrieve':
        lines.push(`${pad}// Retrieve ${step.resource}`)
        lines.push(
          `${pad}const retrieved${this.pascalCase(step.resource)} = await client.${this.camelCase(step.resource)}.retrieve(${JSON.stringify(step.params || {})})`
        )
        lines.push(`${pad}expect(retrieved${this.pascalCase(step.resource)}).toBeDefined()`)
        if (step.expects?.fields) {
          for (const [key, value] of Object.entries(step.expects.fields)) {
            lines.push(`${pad}expect(retrieved${this.pascalCase(step.resource)}.${key}).toBe(${JSON.stringify(value)})`)
          }
        }
        break

      case 'update':
        lines.push(`${pad}// Update ${step.resource}`)
        lines.push(
          `${pad}const updated${this.pascalCase(step.resource)} = await client.${this.camelCase(step.resource)}.update(${JSON.stringify(step.params || {})})`
        )
        lines.push(`${pad}expect(updated${this.pascalCase(step.resource)}).toBeDefined()`)
        if (step.expects?.fields) {
          for (const [key, value] of Object.entries(step.expects.fields)) {
            lines.push(`${pad}expect(updated${this.pascalCase(step.resource)}.${key}).toBe(${JSON.stringify(value)})`)
          }
        }
        break

      case 'list':
        {
          const varName = this.sanitizeVarName(step.resource)
          const resourceName = this.camelCase(step.resource)
          lines.push(`${pad}// List ${step.resource}`)
          lines.push(`${pad}const ${varName}List = await client.${resourceName}.list(${JSON.stringify(step.params || {})})`)
          lines.push(`${pad}expect(${varName}List).toBeDefined()`)
          lines.push(`${pad}expect(Array.isArray(${varName}List)).toBe(true)`)
          if (step.expects?.count !== undefined) {
            lines.push(`${pad}expect(${varName}List.length).toBeGreaterThanOrEqual(${step.expects.count})`)
          }
        }
        break

      case 'delete':
        lines.push(`${pad}// Delete ${step.resource}`)
        lines.push(`${pad}await client.${this.camelCase(step.resource)}.delete(${JSON.stringify(step.params || {})})`)
        if (step.params?.id) {
          lines.push(`${pad}// Remove from cleanup list`)
          lines.push(`${pad}const index = testResources.findIndex(r => r.type === '${step.resource}' && r.id === ${JSON.stringify(step.params.id)})`)
          lines.push(`${pad}if (index > -1) testResources.splice(index, 1)`)
        }
        break

      case 'assert':
        if (step.expects?.status) {
          lines.push(`${pad}expect(response.status).toBe(${step.expects.status})`)
        }
        if (step.expects?.fields) {
          for (const [key, value] of Object.entries(step.expects.fields)) {
            lines.push(`${pad}expect(result.${key}).toBe(${JSON.stringify(value)})`)
          }
        }
        break
    }

    lines.push('')
    return lines.join('\n')
  }

  /**
   * Generate resource tests
   */
  private generateResourceTests(_integration: Integration, resource: Resource): string {
    const lines: string[] = []

    lines.push(`  describe('${resource.name} Resource', () => {`)

    for (const operation of resource.operations) {
      lines.push(this.generateOperationTest(resource, operation))
      lines.push('')
    }

    lines.push('  })')

    return lines.join('\n')
  }

  /**
   * Generate operation test
   */
  private generateOperationTest(resource: Resource, operation: Operation): string {
    const lines: string[] = []
    const opName = operation.name || operation.type

    lines.push(`    it('should ${operation.type} ${resource.name}', async () => {`)

    switch (operation.type) {
      case 'create':
        lines.push(`      const result = await client.${this.camelCase(resource.name)}.${opName}({`)
        lines.push('        // Add test parameters')
        lines.push('      })')
        lines.push('      expect(result).toBeDefined()')
        lines.push(`      testResources.push({ type: '${resource.name}', id: result.id })`)
        break

      case 'list':
        lines.push(`      const result = await client.${this.camelCase(resource.name)}.${opName}()`)
        lines.push('      expect(result).toBeDefined()')
        lines.push('      expect(Array.isArray(result)).toBe(true)')
        break

      case 'retrieve':
        lines.push('      // Create test resource first')
        lines.push(`      const created = await client.${this.camelCase(resource.name)}.create({})`)
        lines.push(`      testResources.push({ type: '${resource.name}', id: created.id })`)
        lines.push('')
        lines.push(`      const result = await client.${this.camelCase(resource.name)}.${opName}({ id: created.id })`)
        lines.push('      expect(result).toBeDefined()')
        lines.push('      expect(result.id).toBe(created.id)')
        break

      case 'update':
        lines.push('      // Create test resource first')
        lines.push(`      const created = await client.${this.camelCase(resource.name)}.create({})`)
        lines.push(`      testResources.push({ type: '${resource.name}', id: created.id })`)
        lines.push('')
        lines.push(`      const result = await client.${this.camelCase(resource.name)}.${opName}({ id: created.id })`)
        lines.push('      expect(result).toBeDefined()')
        lines.push('      expect(result.id).toBe(created.id)')
        break

      case 'delete':
        lines.push('      // Create test resource first')
        lines.push(`      const created = await client.${this.camelCase(resource.name)}.create({})`)
        lines.push('')
        lines.push(`      await client.${this.camelCase(resource.name)}.${opName}({ id: created.id })`)
        lines.push('      // Verify deletion')
        lines.push('      await expect(')
        lines.push(`        client.${this.camelCase(resource.name)}.retrieve({ id: created.id })`)
        lines.push('      ).rejects.toThrow()')
        break
    }

    lines.push('    })')

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

  /**
   * Convert to camelCase
   */
  private camelCase(str: string): string {
    return str.replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase()).replace(/^[A-Z]/, (chr) => chr.toLowerCase())
  }

  /**
   * Convert to CONSTANT_CASE
   */
  private constantCase(str: string): string {
    return str.replace(/[^a-zA-Z0-9]+/g, '_').toUpperCase()
  }

  /**
   * Sanitize variable name to avoid reserved keywords
   */
  private sanitizeVarName(name: string): string {
    const reservedKeywords = new Set([
      'break',
      'case',
      'catch',
      'class',
      'const',
      'continue',
      'debugger',
      'default',
      'delete',
      'do',
      'else',
      'export',
      'extends',
      'finally',
      'for',
      'function',
      'if',
      'import',
      'in',
      'instanceof',
      'let',
      'new',
      'return',
      'super',
      'switch',
      'this',
      'throw',
      'try',
      'typeof',
      'var',
      'void',
      'while',
      'with',
      'yield',
      'enum',
      'implements',
      'interface',
      'package',
      'private',
      'protected',
      'public',
      'static',
      'await',
      'async',
    ])

    const camelCased = this.camelCase(name)
    return reservedKeywords.has(camelCased) ? `${camelCased}Resource` : camelCased
  }
}
