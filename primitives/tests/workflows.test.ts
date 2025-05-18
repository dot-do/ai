import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ai, tag, list, AI } from '../workflows'
import { generateObject, generateText } from 'ai'

vi.mock('ai', () => ({
  generateObject: vi.fn(),
  generateText: vi.fn()
}))

describe('AI Workflows', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('ai proxy object', () => {
    it('should call generateObject with the correct parameters', async () => {
      const mockObject = { result: 'success' }
      ;(generateObject as any).mockResolvedValue({ object: mockObject })

      const result = await (ai as any).testFunction({ param: 'value' })

      expect(generateObject).toHaveBeenCalledWith(
        expect.objectContaining({
          prompt: 'Execute function: testFunction with input: {"param":"value"}',
          output: 'no-schema'
        })
      )

      expect(result).toEqual(mockObject)
    })

    it('should handle errors when calling generateObject', async () => {
      const mockError = new Error('Test error')
      ;(generateObject as any).mockRejectedValue(mockError)

      await expect((ai as any).testFunction({ param: 'value' })).rejects.toThrow('Test error')
    })
  })

  describe('tag function', () => {
    it('should call generateText with the correct parameters', async () => {
      const mockText = 'Generated text'
      ;(generateText as any).mockResolvedValue({ text: mockText })

      const result = await tag`Summarize this topic: ${'AI'}`()

      expect(generateText).toHaveBeenCalledWith(
        expect.objectContaining({
          prompt: 'Summarize this topic: AI'
        })
      )

      expect(result).toEqual(mockText)
    })

    it('should handle errors when calling generateText', async () => {
      const mockError = new Error('Test error')
      ;(generateText as any).mockRejectedValue(mockError)

      await expect(tag`Summarize this topic: ${'AI'}`()).rejects.toThrow('Test error')
    })
  })

  describe('list function', () => {
    it('should call generateText and parse the result into an array', async () => {
      const mockText = '1. Item one\n2. Item two\n3. Item three'
      ;(generateText as any).mockResolvedValue({ text: mockText })

      const result = await list`three items`()

      expect(generateText).toHaveBeenCalledWith(
        expect.objectContaining({
          prompt: 'Generate a numbered list of three items'
        })
      )

      expect(result).toEqual(['Item one', 'Item two', 'Item three'])
    })

    it('should handle errors when calling generateText', async () => {
      const mockError = new Error('Test error')
      ;(generateText as any).mockRejectedValue(mockError)

      await expect(list`three items`()).rejects.toThrow('Test error')
    })
  })

  describe('AI function', () => {
    it('should return the provided definition', () => {
      const definition = { name: 'test', description: 'test definition' }
      const result = AI(definition)
      expect(result).toEqual(definition)
    })
  })
})
