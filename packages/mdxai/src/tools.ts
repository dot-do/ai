/**
 * Tools for the mdxai agent
 */

import { tool } from 'ai'
import { z } from 'zod'
import { compile, render, validate } from 'mdxe'
import { readFile, writeFile, readdir } from 'fs/promises'
import { join, extname, resolve, normalize } from 'path'
import matter from 'gray-matter'
import type { Frontmatter } from './types'

/**
 * Validate and normalize a file path
 * Prevents directory traversal attacks
 */
function validatePath(path: string): string {
  // Normalize the path to prevent directory traversal
  const normalized = normalize(path)

  // Check for suspicious patterns
  if (normalized.includes('..') || normalized.startsWith('/etc') || normalized.startsWith('/sys')) {
    throw new Error(`Invalid path: ${path}`)
  }

  // Resolve to absolute path
  return resolve(normalized)
}

/**
 * MDX compilation tool
 */
export const mdxeCompileTool = tool({
  description: 'Compile an MDX file to JavaScript',
  parameters: z.object({
    path: z.string().describe('Path to the MDX file'),
  }),
  execute: async ({ path }) => {
    try {
      const validPath = validatePath(path)
      const source = await readFile(validPath, 'utf-8')
      const result = await compile({ source, filepath: validPath })
      return { success: true, result }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : String(error) }
    }
  },
})

/**
 * MDX render tool
 */
export const mdxeRenderTool = tool({
  description: 'Render an MDX file to HTML',
  parameters: z.object({
    path: z.string().describe('Path to the MDX file'),
  }),
  execute: async ({ path }) => {
    try {
      const validPath = validatePath(path)
      const source = await readFile(validPath, 'utf-8')
      const result = await render({ source, filepath: validPath })
      return { success: true, html: result }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : String(error) }
    }
  },
})

/**
 * MDX validate tool
 */
export const mdxeValidateTool = tool({
  description: 'Validate an MDX file for syntax errors',
  parameters: z.object({
    path: z.string().describe('Path to the MDX file'),
  }),
  execute: async ({ path }) => {
    try {
      const validPath = validatePath(path)
      const source = await readFile(validPath, 'utf-8')
      const result = await validate({ source, filepath: validPath })
      return { success: true, valid: result.valid, errors: result.errors }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : String(error) }
    }
  },
})

/**
 * Read file tool (for mdxdb-like functionality)
 */
export const mdxdbReadTool = tool({
  description: 'Read a markdown/MDX file and parse frontmatter',
  parameters: z.object({
    path: z.string().describe('Path to the file'),
  }),
  execute: async ({ path }) => {
    try {
      const validPath = validatePath(path)
      const content = await readFile(validPath, 'utf-8')
      const { data: frontmatter, content: body } = matter(content)
      return { success: true, frontmatter: frontmatter as Frontmatter, body }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : String(error) }
    }
  },
})

/**
 * Write file tool (for mdxdb-like functionality)
 */
export const mdxdbWriteTool = tool({
  description: 'Write content to a markdown/MDX file with frontmatter',
  parameters: z.object({
    path: z.string().describe('Path to the file'),
    frontmatter: z.record(z.unknown()).optional().describe('Frontmatter data'),
    body: z.string().describe('Content body'),
  }),
  execute: async ({ path, frontmatter, body }) => {
    try {
      const validPath = validatePath(path)
      const content = matter.stringify(body, (frontmatter || {}) as Frontmatter)
      await writeFile(validPath, content, 'utf-8')
      return { success: true, path: validPath }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : String(error) }
    }
  },
})

/**
 * List files tool
 */
export const listTool = tool({
  description: 'List files in a directory with optional filtering',
  parameters: z.object({
    path: z.string().describe('Directory path'),
    extension: z.string().optional().describe('Filter by file extension (e.g., .md, .mdx)'),
  }),
  execute: async ({ path, extension }) => {
    try {
      const validPath = validatePath(path)
      const entries = await readdir(validPath, { withFileTypes: true })
      let files = entries.filter((entry) => entry.isFile()).map((entry) => join(validPath, entry.name))

      if (extension) {
        files = files.filter((file) => extname(file) === extension)
      }

      return { success: true, files }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : String(error) }
    }
  },
})

/**
 * Todo management tool
 */
const todos: Array<{ id: string; task: string; completed: boolean }> = []
let todoCounter = 0

export const todoTool = tool({
  description: 'Manage todo items - add, list, complete, or remove tasks',
  parameters: z.object({
    action: z.enum(['add', 'list', 'complete', 'remove']).describe('Action to perform'),
    task: z.string().optional().describe('Task description (for add action)'),
    id: z.string().optional().describe('Task ID (for complete/remove actions)'),
  }),
  execute: async ({ action, task, id }) => {
    switch (action) {
      case 'add':
        if (!task) return { success: false, error: 'Task description required for add action' }
        const newId = `todo-${++todoCounter}`
        todos.push({ id: newId, task, completed: false })
        return { success: true, id: newId, todos }

      case 'list':
        return { success: true, todos }

      case 'complete':
        if (!id) return { success: false, error: 'Task ID required for complete action' }
        const todoToComplete = todos.find((t) => t.id === id)
        if (!todoToComplete) return { success: false, error: 'Todo not found' }
        todoToComplete.completed = true
        return { success: true, todos }

      case 'remove':
        if (!id) return { success: false, error: 'Task ID required for remove action' }
        const index = todos.findIndex((t) => t.id === id)
        if (index === -1) return { success: false, error: 'Todo not found' }
        todos.splice(index, 1)
        return { success: true, todos }

      default:
        return { success: false, error: 'Invalid action' }
    }
  },
})

/**
 * ForEach tool for iteration
 */
export const forEachTool = tool({
  description: 'Iterate over a list of items and return results',
  parameters: z.object({
    items: z.array(z.string()).describe('Items to iterate over'),
    operation: z.string().describe('Description of operation to perform on each item'),
  }),
  execute: async ({ items, operation }) => {
    // This tool returns items for the AI to process
    // The AI will need to call other tools for each item
    return {
      success: true,
      items,
      operation,
      message: `Ready to process ${items.length} items: ${operation}`,
    }
  },
})

/**
 * Generate tool - delegates to simpler generation function
 */
export const generateTool = tool({
  description: 'Generate content using AI - supports both structured objects (with schema) and markdown text',
  parameters: z.object({
    prompt: z.string().describe('Generation prompt'),
    schemaPath: z.string().optional().describe('Path to file with schema in frontmatter (for structured generation)'),
    format: z.enum(['object', 'markdown']).optional().describe('Output format - object for structured data, markdown for text'),
  }),
  execute: async ({ prompt, schemaPath, format }) => {
    // This is a placeholder that returns instructions for the AI
    // The actual implementation will be handled by the agent calling generateObject or generateText
    return {
      success: true,
      prompt,
      schemaPath,
      format: format || (schemaPath ? 'object' : 'markdown'),
      message: 'Use generateObject with schema or generateText based on format',
    }
  },
})

/**
 * All tools available to the agent
 */
export const tools = {
  mdxe_compile: mdxeCompileTool,
  mdxe_render: mdxeRenderTool,
  mdxe_validate: mdxeValidateTool,
  mdxdb_read: mdxdbReadTool,
  mdxdb_write: mdxdbWriteTool,
  list: listTool,
  todo: todoTool,
  forEach: forEachTool,
  generate: generateTool,
}

export type Tools = typeof tools
