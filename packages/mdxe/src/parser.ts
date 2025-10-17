/**
 * MDXLD Worker Parser
 */

import { readFile } from 'fs/promises'
import { parseMDXLD, validateLinkedData } from 'mdxld'
import type { MDXLDWorker, WorkerFrontmatter } from './types.js'

/**
 * Parse an MDXLD worker file from disk
 *
 * @param filePath - Absolute or relative path to the .mdx worker file
 * @returns Parsed worker containing frontmatter, content, and file path
 * @throws Error if the file cannot be read, has invalid YAML frontmatter,
 *         or does not have $type: Worker
 *
 * @example
 * ```typescript
 * const worker = await parseWorker('./workers/my-worker/worker.mdx')
 * console.log(worker.frontmatter.name) // 'my-worker'
 * ```
 */
export async function parseWorker(filePath: string): Promise<MDXLDWorker> {
  const content = await readFile(filePath, 'utf-8')
  const parsed = parseMDXLD(content)

  // Validate it's a Worker type
  if (parsed.data.$type !== 'Worker') {
    throw new Error(`Expected $type: Worker, got: ${parsed.data.$type}`)
  }

  // Validate linked data
  const validation = validateLinkedData(parsed.data, {
    requireType: true,
  })

  if (!validation.valid) {
    throw new Error(`Invalid worker frontmatter: ${validation.errors.join(', ')}`)
  }

  // Normalize compatibility_date to string (mdxld may parse as Date)
  const frontmatter = parsed.data as WorkerFrontmatter
  const compatDate = (frontmatter as unknown as Record<string, unknown>).compatibility_date
  if (compatDate) {
    if (compatDate instanceof Date) {
      const isoDate = compatDate.toISOString().split('T')[0]
      // Validate the conversion produced a valid date format
      if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) {
        throw new Error(`Failed to normalize compatibility_date: invalid format after conversion`)
      }
      frontmatter.compatibility_date = isoDate
    } else if (typeof compatDate !== 'string') {
      throw new Error(`Invalid compatibility_date type: expected Date or string, got ${typeof compatDate}`)
    }
  }

  return {
    frontmatter,
    content: parsed.content,
    filePath,
  }
}

/**
 * Validate worker configuration for required fields and correct formats
 *
 * @param frontmatter - Worker frontmatter to validate
 * @returns Validation result with valid flag and array of error messages
 *
 * @remarks
 * Checks for:
 * - Required fields: name, main, compatibility_date
 * - Date format: YYYY-MM-DD for compatibility_date
 *
 * @example
 * ```typescript
 * const validation = validateWorkerConfig(worker.frontmatter)
 * if (!validation.valid) {
 *   console.error('Errors:', validation.errors)
 * }
 * ```
 */
export function validateWorkerConfig(frontmatter: WorkerFrontmatter): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  // Required fields
  if (!frontmatter.name) {
    errors.push('Missing required field: name')
  }

  if (!frontmatter.main) {
    errors.push('Missing required field: main')
  }

  if (!frontmatter.compatibility_date) {
    errors.push('Missing required field: compatibility_date')
  }

  // Validate date format (YYYY-MM-DD)
  if (frontmatter.compatibility_date) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(frontmatter.compatibility_date)) {
      errors.push(`Invalid compatibility_date format: ${frontmatter.compatibility_date} (expected YYYY-MM-DD)`)
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}
