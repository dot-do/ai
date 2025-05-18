import { z } from 'zod'
import { zodToJsonSchema } from 'zod-to-json-schema'

/**
 * Creates a Zod schema from a template object where:
 * - String values become descriptions
 * - Pipe-separated values become enums
 */
export function toZodSchema<T extends Record<string, string>>(
  template: T
): z.ZodObject<{
  [K in keyof T]: z.ZodString | z.ZodEnum<[string, ...string[]]> | z.ZodEffects<z.ZodString>
}> {
  type SchemaShape = {
    [K in keyof T]: z.ZodString | z.ZodEnum<[string, ...string[]]> | z.ZodEffects<z.ZodString>
  }
  const shape = Object.entries(template).reduce<Partial<SchemaShape>>((acc, [key, value]) => {
    // Check if value contains pipe-separated options
    if (value.includes('|')) {
      const options = value
        .split('|')
        .map((opt) => opt.trim())
        .filter(Boolean) // Remove empty strings
      if (options.length >= 1) {
        acc[key as keyof T] = z.enum([options[0], ...options.slice(1)] as [string, ...string[]]).describe(value)
      } else {
        acc[key as keyof T] = z.string().describe(value)
      }
    } else {
      acc[key as keyof T] = z.string().describe(value)
    }
    return acc
  }, {})

  return z.object(shape as SchemaShape)
}

export function toJsonSchema(schema: Record<string, string>) {
  return zodToJsonSchema(toZodSchema(schema))
}
