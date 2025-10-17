vi.mock('ai-functions', () => ({
  generateObject: vi.fn(),
}))

vi.mock('ai-providers', () => ({
  model: vi.fn(),
}))

import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { AI } from './AI'
import { z } from 'zod'
import { clearResponseCache, defaultMockResponse } from './test-utils'

import { generateObject } from 'ai-functions'
import { model } from 'ai-providers'

describe('AI Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    clearResponseCache()

    vi.mocked(generateObject).mockResolvedValue(defaultMockResponse)
    vi.mocked(model).mockReturnValue({
      name: 'gpt-4o',
      provider: 'openai',
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should render without crashing', () => {
    expect(() => {
      render(
        <AI
          model="gpt-4o"
          schema={{
            title: 'string',
            content: 'string',
          }}
          prompt="Generate test content"
        >
          {() => <div>Content</div>}
        </AI>
      )
    }).not.toThrow()
  })

  describe('Basic Functionality', () => {
    it('should render with minimal required props', async () => {
      vi.mocked(generateObject).mockResolvedValueOnce({
        object: {
          title: 'Test Title',
        },
      })

      const schema = {
        title: 'string',
      }

      render(
        <AI model="gpt-4o" schema={schema} prompt="Generate a title">
          {(props) => <h1 data-testid="title">{props.title}</h1>}
        </AI>
      )

      await waitFor(() => {
        expect(screen.getByTestId('title')).toBeInTheDocument()
      })

      expect(generateObject).toHaveBeenCalledTimes(1)
      expect(generateObject).toHaveBeenCalledWith(
        expect.objectContaining({
          prompt: 'Generate a title',
          schema: expect.anything(),
        })
      )
    })

    it('should render with all configuration options', async () => {
      vi.mocked(generateObject).mockResolvedValueOnce({
        object: {
          title: 'Test Title',
          content: 'Test Content',
        },
      })

      render(
        <AI
          model="gpt-4o"
          schema={{
            title: 'string',
            content: 'string',
          }}
          prompt="Generate content"
          stream={false}
          output="object"
          cols={1}
        >
          {(props, { isStreaming }) => (
            <div data-testid="content">
              <h1>{props.title}</h1>
              <p>{props.content}</p>
              {isStreaming && <div>Loading...</div>}
            </div>
          )}
        </AI>
      )

      await waitFor(() => {
        expect(screen.getByTestId('content')).toBeInTheDocument()
      })
    })
  })

  describe('Schema Handling', () => {
    it('should work with simple object schema', async () => {
      vi.mocked(generateObject).mockResolvedValueOnce({
        object: {
          title: 'Test Title',
          views: 100,
          isPublished: true,
        },
      })

      render(
        <AI
          model="gpt-4o"
          schema={{
            title: 'string',
            views: 'number',
            isPublished: 'boolean',
          }}
          prompt="Generate an article metadata"
        >
          {(props) => (
            <div data-testid="metadata">
              <h1>{props.title}</h1>
              <p>Views: {props.views}</p>
              <p>Published: {props.isPublished ? 'Yes' : 'No'}</p>
            </div>
          )}
        </AI>
      )

      await waitFor(() => {
        expect(screen.getByTestId('metadata')).toBeInTheDocument()
      })
    })

    it('should work with Zod schema', async () => {
      vi.mocked(generateObject).mockResolvedValueOnce({
        object: {
          title: 'Test Title',
          content: 'Test Content',
          wordCount: 500,
        },
      })

      const ArticleSchema = z.object({
        title: z.string(),
        content: z.string(),
        wordCount: z.number(),
      })

      render(
        <AI model="gpt-4o" schema={ArticleSchema} prompt="Generate an article">
          {(props) => (
            <div data-testid="article">
              <h1>{props.title}</h1>
              <p>{props.content}</p>
              <span>Word count: {props.wordCount}</span>
            </div>
          )}
        </AI>
      )

      await waitFor(() => {
        expect(screen.getByTestId('article')).toBeInTheDocument()
      })
    })

    it('should handle pipe-separated enum values', async () => {
      vi.mocked(generateObject).mockResolvedValueOnce({
        object: {
          category: 'Technology',
        },
      })

      render(
        <AI
          model="gpt-4o"
          schema={{
            category: 'Technology | Business | Science | Health',
          }}
          prompt="Generate a category"
        >
          {(props) => <div data-testid="category">{props.category}</div>}
        </AI>
      )

      await waitFor(() => {
        expect(screen.getByTestId('category')).toBeInTheDocument()
        const category = screen.getByTestId('category').textContent
        expect(['Technology', 'Business', 'Science', 'Health']).toContain(category)
      })
    })
  })

  describe('Output Formats', () => {
    it('should handle object output format', async () => {
      vi.mocked(generateObject).mockResolvedValueOnce({
        object: {
          title: 'Test Title',
          content: 'Test Content',
        },
      })

      render(
        <AI
          model="gpt-4o"
          schema={{
            title: 'string',
            content: 'string',
          }}
          prompt="Generate an article"
          output="object"
        >
          {(props) => (
            <div data-testid="article">
              <h1>{props.title}</h1>
              <p>{props.content}</p>
            </div>
          )}
        </AI>
      )

      await waitFor(() => {
        expect(screen.getByTestId('article')).toBeInTheDocument()
      })
    })

    it('should handle array output with grid layout', async () => {
      vi.mocked(generateObject).mockResolvedValueOnce({
        object: [
          { title: 'Item 1', description: 'Description 1' },
          { title: 'Item 2', description: 'Description 2' },
          { title: 'Item 3', description: 'Description 3' },
        ],
      })

      render(
        <AI
          model="gpt-4o"
          schema={{
            title: 'string',
            description: 'string',
          }}
          prompt="Generate a list of items"
          output="array"
          cols={3}
        >
          {(props) => (
            <div data-testid="item">
              <h3>{props.title}</h3>
              <p>{props.description}</p>
            </div>
          )}
        </AI>
      )

      await waitFor(() => {
        expect(screen.getAllByTestId('item').length).toBe(3)
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle schema validation errors', async () => {
      vi.mocked(generateObject).mockRejectedValueOnce(
        new z.ZodError([
          {
            code: 'invalid_type',
            expected: 'string',
            received: 'undefined',
            path: ['title'],
            message: 'Required',
          },
        ])
      )

      vi.spyOn(console, 'error').mockImplementation(() => {})

      render(
        <AI
          model="gpt-4o"
          schema={z.object({
            title: z.string(),
            content: z.string(),
          })}
          prompt="Generate invalid content"
        >
          {(props, { error }) => (
            <div>
              {error ? (
                <div data-testid="error">Error: {error.message}</div>
              ) : (
                <div>
                  <h1>{props.title}</h1>
                  <p>{props.content}</p>
                </div>
              )}
            </div>
          )}
        </AI>
      )

      await waitFor(() => {
        expect(screen.getByTestId('error')).toBeInTheDocument()
      })
    })

    it('should handle API failures', async () => {
      const apiError = new Error('API request failed')
      vi.mocked(generateObject).mockRejectedValueOnce(apiError)

      render(
        <AI
          model="gpt-4o"
          schema={{
            title: 'string',
            content: 'string',
          }}
          prompt="Generate content that fails"
        >
          {(props, { error }) => (
            <div>
              {error ? (
                <div data-testid="api-error">Error: {error.message}</div>
              ) : (
                <div>
                  <h1>{props.title}</h1>
                  <p>{props.content}</p>
                </div>
              )}
            </div>
          )}
        </AI>
      )

      await waitFor(() => {
        expect(screen.getByTestId('api-error')).toBeInTheDocument()
        expect(screen.getByTestId('api-error').textContent).toContain('API request failed')
      })
    })

    it('should handle malformed responses', async () => {
      vi.mocked(generateObject).mockRejectedValueOnce(new Error('Failed to parse AI response as JSON'))

      render(
        <AI
          model="gpt-4o"
          schema={{
            title: 'string',
            content: 'string',
          }}
          prompt="Generate malformed content"
        >
          {(props, { error }) => (
            <div>
              {error ? (
                <div data-testid="malformed-error">Error: {error.message}</div>
              ) : (
                <div>
                  <h1>{props.title}</h1>
                  <p>{props.content}</p>
                </div>
              )}
            </div>
          )}
        </AI>
      )

      await waitFor(() => {
        expect(screen.getByTestId('malformed-error')).toBeInTheDocument()
        expect(screen.getByTestId('malformed-error').textContent).toContain('Failed to parse')
      })
    })
  })

  describe('Streaming Mode', () => {
    it('should set isStreaming state during API call', async () => {
      let streamingState = false

      vi.mocked(generateObject).mockImplementationOnce(async () => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              object: { title: 'Test', content: 'Content' },
            })
          }, 100)
        })
      })

      render(
        <AI
          model="gpt-4o"
          schema={{
            title: 'string',
            content: 'string',
          }}
          prompt="Generate streaming content"
          stream={true}
        >
          {(props, { isStreaming }) => {
            streamingState = isStreaming
            return <div data-testid="streaming">{isStreaming ? 'Loading...' : props.title}</div>
          }}
        </AI>
      )

      expect(streamingState).toBe(true)

      await waitFor(() => {
        expect(screen.getByTestId('streaming')).not.toHaveTextContent('Loading...')
      })

      expect(streamingState).toBe(false)
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty results', async () => {
      vi.mocked(generateObject).mockResolvedValueOnce({
        object: {},
      })

      render(
        <AI
          model="gpt-4o"
          schema={{
            title: 'string',
            content: 'string',
          }}
          prompt="Generate empty content"
        >
          {(props) => (
            <div data-testid="empty">
              <h1>{props.title || 'No Title'}</h1>
              <p>{props.content || 'No Content'}</p>
            </div>
          )}
        </AI>
      )

      await waitFor(() => {
        expect(screen.getByTestId('empty')).toBeInTheDocument()
        expect(screen.getByTestId('empty').textContent).toContain('No Title')
        expect(screen.getByTestId('empty').textContent).toContain('No Content')
      })
    })

    it('should handle invalid inputs', async () => {
      render(
        <AI
          model="invalid-model"
          schema={{
            title: 'string',
          }}
          prompt="Generate with invalid model"
        >
          {(props, { error }) => <div data-testid="invalid-input">{error ? `Error: ${error.message}` : props.title}</div>}
        </AI>
      )

      await waitFor(() => {
        expect(screen.getByTestId('invalid-input')).toBeInTheDocument()
      })
    })
  })
})
