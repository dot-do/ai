/**
 * Test functionality using mdxe
 */

import { validate } from 'mdxe'
import { readFile } from 'fs/promises'
import type { TestOptions } from './types'

export async function test(options: TestOptions): Promise<void> {
  const { path, watch = false } = options

  console.log(`Running tests for ${path}...`)

  try {
    // Read the file content
    const source = await readFile(path, 'utf-8')

    // Validate using mdxe
    const result = await validate({ source, filepath: path })

    if (result.valid) {
      console.log('✓ All tests passed')
    } else {
      console.error('✗ Tests failed:')
      result.errors?.forEach((error) => {
        console.error(`  - Line ${error.line}:${error.column} - ${error.message}`)
      })
      throw new Error('Tests failed')
    }
  } catch (error) {
    console.error('✗ Test execution failed:', error)
    throw error
  }

  if (watch) {
    console.warn('Watch mode not yet implemented')
  }
}
