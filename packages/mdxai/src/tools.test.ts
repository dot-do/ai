/**
 * Basic tests for mdxai tools
 */

import { describe, it, expect } from 'vitest'
import { tools } from './tools'

describe('Tools', () => {
  it('should export all expected tools', () => {
    expect(tools).toBeDefined()
    expect(tools.mdxe_compile).toBeDefined()
    expect(tools.mdxe_render).toBeDefined()
    expect(tools.mdxe_validate).toBeDefined()
    expect(tools.mdxdb_read).toBeDefined()
    expect(tools.mdxdb_write).toBeDefined()
    expect(tools.list).toBeDefined()
    expect(tools.todo).toBeDefined()
    expect(tools.forEach).toBeDefined()
    expect(tools.generate).toBeDefined()
  })

  it('todo tool should manage tasks', async () => {
    // Add a todo
    const addResult = await tools.todo.execute({ action: 'add', task: 'Test task' })
    expect(addResult.success).toBe(true)
    expect(addResult.id).toBeDefined()

    // List todos
    const listResult = await tools.todo.execute({ action: 'list' })
    expect(listResult.success).toBe(true)
    expect(listResult.todos).toBeDefined()
    expect(Array.isArray(listResult.todos)).toBe(true)
    expect(listResult.todos.length).toBeGreaterThan(0)

    // Complete a todo
    const completeResult = await tools.todo.execute({ action: 'complete', id: addResult.id })
    expect(completeResult.success).toBe(true)

    // Remove a todo
    const removeResult = await tools.todo.execute({ action: 'remove', id: addResult.id })
    expect(removeResult.success).toBe(true)
  })

  it('forEach tool should return iteration info', async () => {
    const result = await tools.forEach.execute({
      items: ['file1.mdx', 'file2.mdx'],
      operation: 'validate files',
    })
    expect(result.success).toBe(true)
    expect(result.items).toEqual(['file1.mdx', 'file2.mdx'])
    expect(result.operation).toBe('validate files')
  })

  it('generate tool should return format info', async () => {
    const result = await tools.generate.execute({
      prompt: 'Generate content',
      format: 'markdown',
    })
    expect(result.success).toBe(true)
    expect(result.format).toBe('markdown')
  })
})
