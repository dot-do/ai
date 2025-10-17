/**
 * Utility functions for function management
 */

import type { FunctionDefinition } from './types.js'
import { FunctionDefinitionSchema } from './types.js'

/**
 * Generate a unique function ID
 *
 * @param name - Function name (optional, will be sanitized)
 * @returns Generated function ID
 *
 * @example
 * ```typescript
 * const id = generateFunctionId('My Function') // 'my-function-abc123'
 * ```
 */
export function generateFunctionId(name?: string): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)

  if (name) {
    const sanitized = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    return `${sanitized}-${timestamp}${random}`
  }

  return `func-${timestamp}${random}`
}

/**
 * Generate a unique execution ID
 *
 * @returns Generated execution ID
 *
 * @example
 * ```typescript
 * const id = generateExecutionId() // 'exec-abc123def456'
 * ```
 */
export function generateExecutionId(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 12)
  return `exec-${timestamp}${random}`
}

/**
 * Validate function definition against schema
 *
 * @param definition - Function definition to validate
 * @returns Validated function definition
 * @throws Error if validation fails
 *
 * @example
 * ```typescript
 * try {
 *   const validated = await validateFunctionDefinition(definition)
 * } catch (error) {
 *   console.error('Validation failed:', error)
 * }
 * ```
 */
export async function validateFunctionDefinition(definition: FunctionDefinition): Promise<FunctionDefinition> {
  try {
    return FunctionDefinitionSchema.parse(definition)
  } catch (error) {
    throw new Error(`Function definition validation failed: ${error}`)
  }
}

/**
 * Parse function code to extract metadata
 *
 * @param code - Function source code
 * @returns Parsed metadata (handler, exports, etc.)
 *
 * @example
 * ```typescript
 * const meta = parseFunctionCode('export default function handler(input) { ... }')
 * console.log('Handler:', meta.handler) // 'handler'
 * ```
 */
export function parseFunctionCode(code: string): {
  handler?: string
  hasDefault: boolean
  exports: string[]
} {
  const hasDefault = /export\s+default/.test(code)
  const exports: string[] = []

  // Extract named exports
  const namedExportRegex = /export\s+(?:const|let|var|function|class)\s+(\w+)/g
  let match
  while ((match = namedExportRegex.exec(code)) !== null) {
    exports.push(match[1])
  }

  // Try to find handler function
  let handler: string | undefined

  // Check for default export
  if (hasDefault) {
    // Try to find: export default function name()
    const defaultFunctionMatch = /export\s+default\s+function\s+(\w+)/.exec(code)
    if (defaultFunctionMatch) {
      handler = defaultFunctionMatch[1]
    } else {
      handler = 'default'
    }
  }

  // If no default, use first named export
  if (!handler && exports.length > 0) {
    handler = exports[0]
  }

  return {
    handler,
    hasDefault,
    exports,
  }
}

/**
 * Format function version string
 *
 * @param major - Major version
 * @param minor - Minor version
 * @param patch - Patch version
 * @returns Formatted version string (e.g., "1.2.3")
 *
 * @example
 * ```typescript
 * const version = formatVersion(1, 2, 3) // '1.2.3'
 * ```
 */
export function formatVersion(major: number, minor: number, patch: number): string {
  return `${major}.${minor}.${patch}`
}

/**
 * Parse version string into components
 *
 * @param version - Version string (e.g., "1.2.3")
 * @returns Version components
 * @throws Error if version format is invalid
 *
 * @example
 * ```typescript
 * const { major, minor, patch } = parseVersion('1.2.3')
 * ```
 */
export function parseVersion(version: string): { major: number; minor: number; patch: number } {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version)
  if (!match) {
    throw new Error(`Invalid version format: ${version}`)
  }

  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
  }
}

/**
 * Increment version (patch, minor, or major)
 *
 * @param version - Current version string
 * @param type - Version component to increment
 * @returns New version string
 *
 * @example
 * ```typescript
 * const newVersion = incrementVersion('1.2.3', 'minor') // '1.3.0'
 * ```
 */
export function incrementVersion(version: string, type: 'major' | 'minor' | 'patch'): string {
  const { major, minor, patch } = parseVersion(version)

  switch (type) {
    case 'major':
      return formatVersion(major + 1, 0, 0)
    case 'minor':
      return formatVersion(major, minor + 1, 0)
    case 'patch':
      return formatVersion(major, minor, patch + 1)
  }
}

/**
 * Calculate function size in bytes
 *
 * @param definition - Function definition
 * @returns Size in bytes
 *
 * @example
 * ```typescript
 * const size = calculateFunctionSize(definition)
 * console.log(`Function size: ${(size / 1024).toFixed(2)} KB`)
 * ```
 */
export function calculateFunctionSize(definition: FunctionDefinition): number {
  const codeSize = new TextEncoder().encode(definition.source.code).length
  const metadataSize = new TextEncoder().encode(JSON.stringify(definition.metadata)).length
  return codeSize + metadataSize
}
