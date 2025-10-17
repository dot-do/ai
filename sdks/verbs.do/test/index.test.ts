import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  VerbsClient,
  createClient,
  list,
  get,
  create,
  update,
  deleteVerb,
  search,
  related,
  categories,
  toOpenAITool,
  toAnthropicTool,
  toLangChainTool,
  toOpenAITools,
  toAnthropicTools,
  toLangChainTools,
  getONETVerbs,
  getVerbsByONETCode,
  getVerbsBySchemaOrgType,
  getVerbsByCategory,
  type Verb,
} from '../src/index'

// Mock fetch
global.fetch = vi.fn()

const mockVerb: Verb = {
  id: '1',
  type: 'Verb',
  name: 'manage',
  label: 'Manage',
  description: 'Organize and direct activities',
  category: 'Management',
  source: 'onet',
  relatedNouns: ['team', 'project', 'resource'],
  relatedVerbs: ['organize', 'coordinate', 'direct'],
  aliases: ['administrate', 'oversee'],
  metadata: {
    onetCode: '11-1021.00',
    frequency: 100,
    difficulty: 'intermediate',
  },
}

describe('VerbsClient', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('constructor', () => {
    it('should create client with default config', () => {
      const client = new VerbsClient()
      expect(client).toBeInstanceOf(VerbsClient)
    })

    it('should create client with custom config', () => {
      const client = new VerbsClient({
        baseUrl: 'https://custom.do',
        timeout: 5000,
        headers: { 'X-Custom': 'header' },
      })
      expect(client).toBeInstanceOf(VerbsClient)
    })
  })

  describe('list', () => {
    it('should list verbs without filters', async () => {
      const mockResponse = {
        verbs: [mockVerb],
        total: 1,
        limit: 100,
        offset: 0,
      }

      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      )

      const client = new VerbsClient()
      const result = await client.list()

      expect(result).toEqual(mockResponse)
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/verbs?'), expect.any(Object))
    })

    it('should list verbs with filters', async () => {
      const mockResponse = {
        verbs: [mockVerb],
        total: 1,
        limit: 50,
        offset: 0,
      }

      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      )

      const client = new VerbsClient()
      const result = await client.list({
        category: 'Management',
        source: 'onet',
        limit: 50,
        offset: 0,
      })

      expect(result).toEqual(mockResponse)
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('category=Management'),
        expect.any(Object),
      )
    })
  })

  describe('get', () => {
    it('should get a verb by name', async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(JSON.stringify(mockVerb), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      )

      const client = new VerbsClient()
      const result = await client.get('manage')

      expect(result).toEqual(mockVerb)
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/verbs/manage'), expect.any(Object))
    })

    it('should return null for non-existent verb', async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        new Response('Not found', {
          status: 404,
        }),
      )

      const client = new VerbsClient()
      const result = await client.get('nonexistent')

      expect(result).toBeNull()
    })
  })

  describe('create', () => {
    it('should create a new verb', async () => {
      const createRequest = {
        name: 'orchestrate',
        description: 'Coordinate multiple activities',
        category: 'Management',
        relatedNouns: ['team', 'project'],
      }

      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(JSON.stringify({ ...mockVerb, ...createRequest }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      )

      const client = new VerbsClient()
      const result = await client.create(createRequest)

      expect(result.name).toBe('orchestrate')
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/verbs'),
        expect.objectContaining({
          method: 'POST',
        }),
      )
    })
  })

  describe('update', () => {
    it('should update a verb', async () => {
      const updateRequest = {
        description: 'Updated description',
      }

      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(JSON.stringify({ ...mockVerb, ...updateRequest }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      )

      const client = new VerbsClient()
      const result = await client.update('manage', updateRequest)

      expect(result.description).toBe('Updated description')
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/verbs/manage'),
        expect.objectContaining({
          method: 'PATCH',
        }),
      )
    })
  })

  describe('delete', () => {
    it('should delete a verb', async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(null, {
          status: 204,
        }),
      )

      const client = new VerbsClient()
      await client.delete('manage')

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/verbs/manage'),
        expect.objectContaining({
          method: 'DELETE',
        }),
      )
    })
  })

  describe('search', () => {
    it('should search verbs', async () => {
      const mockResponse = {
        results: [
          {
            id: '1',
            name: 'manage',
            label: 'Manage',
            description: 'Organize and direct activities',
            category: 'Management',
            source: 'onet' as const,
            relevance: 0.95,
          },
        ],
        total: 1,
        query: 'manage',
      }

      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      )

      const client = new VerbsClient()
      const result = await client.search({ q: 'manage', limit: 10 })

      expect(result).toEqual(mockResponse)
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/verbs/search'),
        expect.objectContaining({
          method: 'POST',
        }),
      )
    })
  })

  describe('related', () => {
    it('should get all related entities', async () => {
      const mockResponse = {
        verb: 'manage',
        related: {
          nouns: [
            {
              id: '1',
              name: 'team',
              label: 'Team',
              relationship: 'object',
              frequency: 100,
            },
          ],
          verbs: [
            {
              id: '2',
              name: 'organize',
              label: 'Organize',
              similarity: 0.9,
            },
          ],
        },
      }

      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      )

      const client = new VerbsClient()
      const result = await client.related('manage')

      expect(result).toEqual(mockResponse)
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/verbs/manage/related'),
        expect.any(Object),
      )
    })

    it('should get only related nouns', async () => {
      const mockResponse = {
        verb: 'manage',
        related: {
          nouns: [
            {
              id: '1',
              name: 'team',
              label: 'Team',
              relationship: 'object',
              frequency: 100,
            },
          ],
        },
      }

      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      )

      const client = new VerbsClient()
      const result = await client.related('manage', 'nouns')

      expect(result.related.nouns).toBeDefined()
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('type=nouns'),
        expect.any(Object),
      )
    })
  })

  describe('categories', () => {
    it('should list all categories', async () => {
      const mockResponse = {
        categories: [
          {
            name: 'Management',
            count: 50,
            description: 'Verbs related to management',
          },
        ],
        total: 1,
      }

      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      )

      const client = new VerbsClient()
      const result = await client.categories()

      expect(result).toEqual(mockResponse)
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/verbs/categories'),
        expect.any(Object),
      )
    })
  })

  describe('health', () => {
    it('should get health status', async () => {
      const mockResponse = {
        status: 'healthy',
        version: '1.0.0',
        timestamp: Date.now(),
      }

      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(JSON.stringify(mockResponse), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      )

      const client = new VerbsClient()
      const result = await client.health()

      expect(result.status).toBe('healthy')
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/'), expect.any(Object))
    })
  })
})

describe('Convenience functions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should export createClient', () => {
    const client = createClient()
    expect(client).toBeInstanceOf(VerbsClient)
  })

  it('should export convenience functions', () => {
    expect(typeof list).toBe('function')
    expect(typeof get).toBe('function')
    expect(typeof create).toBe('function')
    expect(typeof update).toBe('function')
    expect(typeof deleteVerb).toBe('function')
    expect(typeof search).toBe('function')
    expect(typeof related).toBe('function')
    expect(typeof categories).toBe('function')
  })
})

describe('LLM Integration', () => {
  it('should convert to OpenAI tool format', () => {
    const tool = toOpenAITool(mockVerb)

    expect(tool.type).toBe('function')
    expect(tool.function.name).toBe('manage')
    expect(tool.function.description).toBe('Organize and direct activities')
    expect(tool.function.parameters.type).toBe('object')
    expect(tool.function.parameters.properties.team).toBeDefined()
    expect(tool.function.parameters.properties.project).toBeDefined()
  })

  it('should convert to Anthropic tool format', () => {
    const tool = toAnthropicTool(mockVerb)

    expect(tool.name).toBe('manage')
    expect(tool.description).toBe('Organize and direct activities')
    expect(tool.input_schema.type).toBe('object')
    expect(tool.input_schema.properties.team).toBeDefined()
  })

  it('should convert to LangChain tool format', () => {
    const tool = toLangChainTool(mockVerb)

    expect(tool.name).toBe('manage')
    expect(tool.description).toBe('Organize and direct activities')
    expect(tool.schema.type).toBe('object')
    expect(tool.schema.properties.team).toBeDefined()
  })

  it('should convert multiple verbs to OpenAI tools', () => {
    const tools = toOpenAITools([mockVerb, mockVerb])
    expect(tools).toHaveLength(2)
    expect(tools[0].type).toBe('function')
  })

  it('should convert multiple verbs to Anthropic tools', () => {
    const tools = toAnthropicTools([mockVerb, mockVerb])
    expect(tools).toHaveLength(2)
    expect(tools[0].name).toBe('manage')
  })

  it('should convert multiple verbs to LangChain tools', () => {
    const tools = toLangChainTools([mockVerb, mockVerb])
    expect(tools).toHaveLength(2)
    expect(tools[0].name).toBe('manage')
  })
})

describe('O*NET Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should get O*NET verbs', async () => {
    const mockResponse = {
      verbs: [mockVerb],
      total: 1,
      limit: 100,
      offset: 0,
    }

    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(mockResponse), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    const result = await getONETVerbs()
    expect(result).toHaveLength(1)
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('source=onet'),
      expect.any(Object),
    )
  })

  it('should get verbs by O*NET code', async () => {
    const mockResponse = {
      verbs: [mockVerb],
      total: 1,
      limit: 100,
      offset: 0,
    }

    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(mockResponse), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    const result = await getVerbsByONETCode('11-1021.00')
    expect(result).toHaveLength(1)
    expect(result[0].metadata.onetCode).toBe('11-1021.00')
  })

  it('should get verbs by Schema.org type', async () => {
    const schemaVerb = {
      ...mockVerb,
      source: 'schema.org' as const,
      metadata: {
        ...mockVerb.metadata,
        schemaOrgType: 'OrganizeAction',
      },
    }

    const mockResponse = {
      verbs: [schemaVerb],
      total: 1,
      limit: 100,
      offset: 0,
    }

    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(mockResponse), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    const result = await getVerbsBySchemaOrgType('OrganizeAction')
    expect(result).toHaveLength(1)
    expect(result[0].metadata.schemaOrgType).toBe('OrganizeAction')
  })

  it('should get verbs by category', async () => {
    const mockResponse = {
      verbs: [mockVerb],
      total: 1,
      limit: 100,
      offset: 0,
    }

    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(mockResponse), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    const result = await getVerbsByCategory('Management')
    expect(result).toHaveLength(1)
    expect(result[0].category).toBe('Management')
  })
})
