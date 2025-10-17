/**
 * Schema validation utilities
 */

import { z } from 'zod'
import type { Schema } from './types'

/**
 * Check if schema is Zod schema
 */
function isZodSchema(schema: Schema): schema is z.ZodType {
  return typeof schema === 'object' && '_def' in schema
}

/**
 * Validate input against schema
 */
export function validateInput<T>(schema: Schema<T>, input: unknown): T {
  if (isZodSchema(schema)) {
    return schema.parse(input)
  }

  // JSON Schema validation (basic)
  // TODO: Use a JSON Schema validator library
  return input as T
}

/**
 * Validate output against schema
 */
export function validateOutput<T>(schema: Schema<T>, output: unknown): T {
  if (isZodSchema(schema)) {
    return schema.parse(output)
  }

  // JSON Schema validation (basic)
  // TODO: Use a JSON Schema validator library
  return output as T
}
