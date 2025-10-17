/**
 * Build functionality using mdxe
 */

import { compile } from 'mdxe'
import { readFile, writeFile, mkdir } from 'fs/promises'
import { dirname, join, basename } from 'path'
import type { BuildOptions } from './types'

export async function build(options: BuildOptions): Promise<void> {
  const { path, outDir = './dist', watch = false } = options

  console.log(`Building MDX files from ${path}...`)

  try {
    // Read the source file
    const source = await readFile(path, 'utf-8')

    // Compile using mdxe
    const result = await compile({ source, filepath: path })

    // Ensure output directory exists
    await mkdir(dirname(join(outDir, basename(path, '.mdx') + '.js')), { recursive: true })

    // Write the compiled result
    const outputPath = join(outDir, basename(path, '.mdx') + '.js')
    await writeFile(outputPath, result.code)

    console.log(`✓ Build completed successfully`)
    console.log(`  Output: ${outputPath}`)
  } catch (error) {
    console.error('✗ Build failed:', error)
    throw error
  }

  if (watch) {
    console.warn('Watch mode not yet implemented - please use a file watcher with the build command')
  }
}

export async function watchBuild(path: string, outDir?: string): Promise<void> {
  console.log(`Watching ${path} for changes...`)
  // Watch implementation would go here
  // This would use a file watcher library like chokidar
  throw new Error('Watch mode not yet implemented - please use a file watcher with the build command')
}
