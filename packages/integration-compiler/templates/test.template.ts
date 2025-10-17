/**
 * Test Template
 *
 * Handlebars template for generating E2E test files.
 */

export const testTemplate = `/**
 * {{serviceName}} Integration Tests
 *
 * Auto-generated E2E tests for {{serviceName}} Integration.
 * Generated from MDXLD Integration definition.
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { {{serviceName}}Client } from './client.js'

describe('{{serviceName}} Integration', () => {
  let client: {{serviceName}}Client
  const testResources: any[] = []

  beforeAll(() => {
    // Initialize client
    client = new {{serviceName}}Client({
      {{#if (eq authConfig.type 'api-key')}}
      apiKey: process.env.{{constantCase serviceName}}_API_KEY || '',
      {{/if}}
      {{#if (eq authConfig.type 'oauth2')}}
      accessToken: process.env.{{constantCase serviceName}}_ACCESS_TOKEN || '',
      {{/if}}
    })
  })

  {{#if cleanup}}
  afterAll(async () => {
    // Cleanup test resources
    for (const resource of testResources) {
      try {
        if (resource.type && resource.id) {
          // Attempt to delete test resource
          console.log(\`Cleaning up \${resource.type}: \${resource.id}\`)
        }
      } catch (error) {
        console.error('Cleanup error:', error)
      }
    }
  })
  {{/if}}

  {{#each scenarios}}
  describe('{{name}}', () => {
    {{#if skipIf}}
    const skip = {{skipIf}}
    if (skip) {
      it.skip('{{name}} (skipped)', () => {})
      return
    }
    {{/if}}

    {{#if description}}
    it('{{description}}', async () => {
    {{else}}
    it('should {{name}}', async () => {
    {{/if}}
      {{#each steps}}
      {{#if (eq action 'create')}}
      // Create {{resource}}
      const {{camelCase resource}} = await client.{{camelCase resource}}.create({{json params}})
      expect({{camelCase resource}}).toBeDefined()
      {{#if expects.fields}}
      {{#each expects.fields}}
      expect({{camelCase ../resource}}.{{@key}}).toBe({{json this}})
      {{/each}}
      {{/if}}
      testResources.push({ type: '{{resource}}', id: {{camelCase resource}}.id })

      {{else if (eq action 'retrieve')}}
      // Retrieve {{resource}}
      const retrieved{{pascalCase resource}} = await client.{{camelCase resource}}.retrieve({{json params}})
      expect(retrieved{{pascalCase resource}}).toBeDefined()
      {{#if expects.fields}}
      {{#each expects.fields}}
      expect(retrieved{{pascalCase ../resource}}.{{@key}}).toBe({{json this}})
      {{/each}}
      {{/if}}

      {{else if (eq action 'update')}}
      // Update {{resource}}
      const updated{{pascalCase resource}} = await client.{{camelCase resource}}.update({{json params}})
      expect(updated{{pascalCase resource}}).toBeDefined()
      {{#if expects.fields}}
      {{#each expects.fields}}
      expect(updated{{pascalCase ../resource}}.{{@key}}).toBe({{json this}})
      {{/each}}
      {{/if}}

      {{else if (eq action 'list')}}
      // List {{resource}}
      const {{camelCase resource}}List = await client.{{camelCase resource}}.list({{json params}})
      expect({{camelCase resource}}List).toBeDefined()
      expect(Array.isArray({{camelCase resource}}List)).toBe(true)
      {{#if expects.count}}
      expect({{camelCase resource}}List.length).toBeGreaterThanOrEqual({{expects.count}})
      {{/if}}

      {{else if (eq action 'delete')}}
      // Delete {{resource}}
      await client.{{camelCase resource}}.delete({{json params}})
      // Remove from cleanup list
      const index = testResources.findIndex(r => r.type === '{{resource}}' && r.id === {{json params.id}})
      if (index > -1) testResources.splice(index, 1)

      {{else if (eq action 'assert')}}
      // Custom assertion
      {{#if expects.status}}
      expect(response.status).toBe({{expects.status}})
      {{/if}}
      {{#if expects.fields}}
      {{#each expects.fields}}
      expect(result.{{@key}}).toBe({{json this}})
      {{/each}}
      {{/if}}

      {{/if}}
      {{/each}}
    })
  })

  {{/each}}

  {{#each resources}}
  describe('{{name}} Resource', () => {
    {{#each operations}}
    {{#if (eq type 'create')}}
    it('should create {{../name}}', async () => {
      const result = await client.{{camelCase ../name}}.create({
        // Add test parameters
      })
      expect(result).toBeDefined()
      testResources.push({ type: '{{../name}}', id: result.id })
    })

    {{else if (eq type 'list')}}
    it('should list {{../name}}', async () => {
      const result = await client.{{camelCase ../name}}.list()
      expect(result).toBeDefined()
      expect(Array.isArray(result)).toBe(true)
    })

    {{else if (eq type 'retrieve')}}
    it('should retrieve {{../name}}', async () => {
      // Create test resource first
      const created = await client.{{camelCase ../name}}.create({})
      testResources.push({ type: '{{../name}}', id: created.id })

      const result = await client.{{camelCase ../name}}.retrieve({ id: created.id })
      expect(result).toBeDefined()
      expect(result.id).toBe(created.id)
    })

    {{else if (eq type 'update')}}
    it('should update {{../name}}', async () => {
      // Create test resource first
      const created = await client.{{camelCase ../name}}.create({})
      testResources.push({ type: '{{../name}}', id: created.id })

      const result = await client.{{camelCase ../name}}.update({ id: created.id })
      expect(result).toBeDefined()
      expect(result.id).toBe(created.id)
    })

    {{else if (eq type 'delete')}}
    it('should delete {{../name}}', async () => {
      // Create test resource first
      const created = await client.{{camelCase ../name}}.create({})

      await client.{{camelCase ../name}}.delete({ id: created.id })
      // Verify deletion
      await expect(
        client.{{camelCase ../name}}.retrieve({ id: created.id })
      ).rejects.toThrow()
    })

    {{/if}}
    {{/each}}
  })

  {{/each}}
})
`
