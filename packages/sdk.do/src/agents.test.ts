/**
 * Tests for agents.do SDK
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { defineAgent, listAgents, getAgent, Agent } from './agents'
import type { AgentConfig, AgentTool } from './agents'

// Mock fetch globally
global.fetch = vi.fn()

describe('defineAgent', () => {
  it('should create an agent with valid config', () => {
    const agent = defineAgent({
      name: 'test-agent',
      description: 'Test agent',
      autonomyLevel: 'supervised',
      tools: [],
    })

    expect(agent).toBeInstanceOf(Agent)
    expect(agent.getConfig().name).toBe('test-agent')
  })

  it('should throw error for missing name', () => {
    expect(() =>
      defineAgent({
        name: '',
        description: 'Test',
        autonomyLevel: 'supervised',
        tools: [],
      })
    ).toThrow('Agent name is required')
  })

  it('should throw error for invalid name format', () => {
    expect(() =>
      defineAgent({
        name: 'Test_Agent',
        description: 'Test',
        autonomyLevel: 'supervised',
        tools: [],
      })
    ).toThrow('must be kebab-case')
  })

  it('should throw error for missing description', () => {
    expect(() =>
      defineAgent({
        name: 'test-agent',
        description: '',
        autonomyLevel: 'supervised',
        tools: [],
      })
    ).toThrow('description is required')
  })

  it('should throw error for invalid autonomy level', () => {
    expect(() =>
      defineAgent({
        name: 'test-agent',
        description: 'Test',
        autonomyLevel: 'invalid' as any,
        tools: [],
      })
    ).toThrow('Invalid autonomy level')
  })

  it('should throw error for tools without names', () => {
    expect(() =>
      defineAgent({
        name: 'test-agent',
        description: 'Test',
        autonomyLevel: 'supervised',
        tools: [{ name: '', description: 'Test' }],
      })
    ).toThrow('Tool name is required')
  })

  it('should throw error for tools without descriptions', () => {
    expect(() =>
      defineAgent({
        name: 'test-agent',
        description: 'Test',
        autonomyLevel: 'supervised',
        tools: [{ name: 'test', description: '' }],
      })
    ).toThrow('requires a description')
  })

  it('should throw error for invalid temperature', () => {
    expect(() =>
      defineAgent({
        name: 'test-agent',
        description: 'Test',
        autonomyLevel: 'supervised',
        tools: [],
        temperature: 1.5,
      })
    ).toThrow('Temperature must be between 0 and 1')
  })

  it('should throw error for invalid maxTokens', () => {
    expect(() =>
      defineAgent({
        name: 'test-agent',
        description: 'Test',
        autonomyLevel: 'supervised',
        tools: [],
        maxTokens: -1,
      })
    ).toThrow('maxTokens must be greater than 0')
  })

  it('should accept valid temperature', () => {
    const agent = defineAgent({
      name: 'test-agent',
      description: 'Test',
      autonomyLevel: 'supervised',
      tools: [],
      temperature: 0.7,
    })

    expect(agent.getConfig().temperature).toBe(0.7)
  })
})

describe('Agent.deploy', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should deploy agent successfully', async () => {
    const mockFetch = vi.mocked(fetch)
    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify({ id: 'agent-123', url: 'https://agents.do/agent-123' }), { status: 200 }))

    const agent = defineAgent({
      name: 'test-agent',
      description: 'Test agent',
      autonomyLevel: 'supervised',
      tools: [],
    })

    const result = await agent.deploy({ apiKey: 'test-key' })

    expect(result.id).toBe('agent-123')
    expect(result.url).toBe('https://agents.do/agent-123')
    expect(mockFetch).toHaveBeenCalledWith(
      'https://agents.do/deploy',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer test-key',
        }),
      })
    )
  })

  it('should use environment variable for API key', async () => {
    process.env.DO_API_KEY = 'env-key'

    const mockFetch = vi.mocked(fetch)
    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify({ id: 'agent-123', url: 'https://agents.do/agent-123' }), { status: 200 }))

    const agent = defineAgent({
      name: 'test-agent',
      description: 'Test',
      autonomyLevel: 'supervised',
      tools: [],
    })

    await agent.deploy()

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer env-key',
        }),
      })
    )

    delete process.env.DO_API_KEY
  })

  it('should throw error without API key', async () => {
    delete process.env.DO_API_KEY

    const agent = defineAgent({
      name: 'test-agent',
      description: 'Test',
      autonomyLevel: 'supervised',
      tools: [],
    })

    await expect(agent.deploy()).rejects.toThrow('API key is required')
  })

  it('should handle deployment failure', async () => {
    const mockFetch = vi.mocked(fetch)
    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify({ message: 'Deployment failed' }), { status: 500 }))

    const agent = defineAgent({
      name: 'test-agent',
      description: 'Test',
      autonomyLevel: 'supervised',
      tools: [],
    })

    await expect(agent.deploy({ apiKey: 'test-key' })).rejects.toThrow('Deployment failed')
  })

  it('should include custom options in deployment', async () => {
    const mockFetch = vi.mocked(fetch)
    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify({ id: 'agent-123', url: 'https://agents.do/agent-123' }), { status: 200 }))

    const agent = defineAgent({
      name: 'test-agent',
      description: 'Test',
      autonomyLevel: 'supervised',
      tools: [],
    })

    await agent.deploy({
      apiKey: 'test-key',
      environment: 'staging',
      customDomain: 'my-agent.example.com',
      logging: false,
    })

    const callArgs = mockFetch.mock.calls[0][1]
    const body = JSON.parse(callArgs?.body as string)

    expect(body.environment).toBe('staging')
    expect(body.customDomain).toBe('my-agent.example.com')
    expect(body.logging).toBe(false)
  })
})

describe('Agent.execute', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should execute agent successfully', async () => {
    const mockFetch = vi.mocked(fetch)

    // Mock deployment
    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify({ id: 'agent-123', url: 'https://agents.do/agent-123' }), { status: 200 }))

    // Mock execution
    mockFetch.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          id: 'exec-456',
          response: 'Hello! How can I help you?',
          actions: [],
          metadata: {
            startTime: '2025-10-11T00:00:00Z',
            endTime: '2025-10-11T00:00:01Z',
            duration: 1000,
            tokensUsed: 50,
            cost: 0.001,
          },
        }),
        { status: 200 }
      )
    )

    const agent = defineAgent({
      name: 'test-agent',
      description: 'Test',
      autonomyLevel: 'autonomous',
      tools: [],
    })

    await agent.deploy({ apiKey: 'test-key' })
    const result = await agent.execute({ input: 'Hello' })

    expect(result.response).toBe('Hello! How can I help you?')
    expect(result.metadata.duration).toBe(1000)
  })

  it('should throw error if not deployed', async () => {
    const agent = defineAgent({
      name: 'test-agent',
      description: 'Test',
      autonomyLevel: 'autonomous',
      tools: [],
    })

    await expect(agent.execute({ input: 'Hello' })).rejects.toThrow('must be deployed')
  })

  it('should pass context to execution', async () => {
    const mockFetch = vi.mocked(fetch)

    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify({ id: 'agent-123', url: 'https://agents.do/agent-123' }), { status: 200 }))

    mockFetch.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          id: 'exec-456',
          response: 'Response',
          actions: [],
          metadata: {
            startTime: '2025-10-11T00:00:00Z',
            endTime: '2025-10-11T00:00:01Z',
            duration: 1000,
            tokensUsed: 50,
            cost: 0.001,
          },
        }),
        { status: 200 }
      )
    )

    const agent = defineAgent({
      name: 'test-agent',
      description: 'Test',
      autonomyLevel: 'autonomous',
      tools: [],
    })

    await agent.deploy({ apiKey: 'test-key' })
    await agent.execute({
      input: 'Hello',
      context: { userId: 'user-123' },
      timeout: 30,
    })

    const callArgs = mockFetch.mock.calls[1][1]
    const body = JSON.parse(callArgs?.body as string)

    expect(body.input).toBe('Hello')
    expect(body.context).toEqual({ userId: 'user-123' })
    expect(body.timeout).toBe(30)
  })
})

describe('Agent.status', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should get agent status', async () => {
    const mockFetch = vi.mocked(fetch)

    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify({ id: 'agent-123', url: 'https://agents.do/agent-123' }), { status: 200 }))

    mockFetch.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          state: 'running',
          executions: 142,
          errors: 2,
          uptime: '5d 3h',
          lastExecution: '2025-10-11T00:00:00Z',
          version: '1.0.0',
          environment: 'production',
        }),
        { status: 200 }
      )
    )

    const agent = defineAgent({
      name: 'test-agent',
      description: 'Test',
      autonomyLevel: 'autonomous',
      tools: [],
    })

    await agent.deploy({ apiKey: 'test-key' })
    const status = await agent.status()

    expect(status.state).toBe('running')
    expect(status.executions).toBe(142)
    expect(status.errors).toBe(2)
  })
})

describe('Agent.metrics', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should get agent metrics', async () => {
    const mockFetch = vi.mocked(fetch)

    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify({ id: 'agent-123', url: 'https://agents.do/agent-123' }), { status: 200 }))

    mockFetch.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          avgResponseTime: 230,
          successRate: 0.98,
          totalExecutions: 1000,
          executions24h: 50,
          totalTokens: 50000,
          totalCost: 1.25,
          topTools: [
            { tool: 'search', count: 500 },
            { tool: 'email', count: 300 },
          ],
          errors: [{ type: 'timeout', count: 15 }],
          uptimePercentage: 99.9,
        }),
        { status: 200 }
      )
    )

    const agent = defineAgent({
      name: 'test-agent',
      description: 'Test',
      autonomyLevel: 'autonomous',
      tools: [],
    })

    await agent.deploy({ apiKey: 'test-key' })
    const metrics = await agent.metrics()

    expect(metrics.avgResponseTime).toBe(230)
    expect(metrics.successRate).toBe(0.98)
    expect(metrics.totalExecutions).toBe(1000)
  })

  it('should pass period parameter', async () => {
    const mockFetch = vi.mocked(fetch)

    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify({ id: 'agent-123', url: 'https://agents.do/agent-123' }), { status: 200 }))

    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify({}), { status: 200 }))

    const agent = defineAgent({
      name: 'test-agent',
      description: 'Test',
      autonomyLevel: 'autonomous',
      tools: [],
    })

    await agent.deploy({ apiKey: 'test-key' })
    await agent.metrics('7d')

    const url = mockFetch.mock.calls[1][0] as string
    expect(url).toContain('period=7d')
  })
})

describe('Agent.update', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should update agent configuration', async () => {
    const mockFetch = vi.mocked(fetch)

    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify({ id: 'agent-123', url: 'https://agents.do/agent-123' }), { status: 200 }))

    mockFetch.mockResolvedValueOnce(new Response(null, { status: 200 }))

    const agent = defineAgent({
      name: 'test-agent',
      description: 'Test',
      autonomyLevel: 'supervised',
      tools: [],
    })

    await agent.deploy({ apiKey: 'test-key' })
    await agent.update({ autonomyLevel: 'autonomous' })

    expect(agent.getConfig().autonomyLevel).toBe('autonomous')
  })

  it('should throw error if not deployed', async () => {
    const agent = defineAgent({
      name: 'test-agent',
      description: 'Test',
      autonomyLevel: 'autonomous',
      tools: [],
    })

    await expect(agent.update({ autonomyLevel: 'supervised' })).rejects.toThrow('must be deployed')
  })
})

describe('Agent state management', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should pause agent', async () => {
    const mockFetch = vi.mocked(fetch)

    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify({ id: 'agent-123', url: 'https://agents.do/agent-123' }), { status: 200 }))

    mockFetch.mockResolvedValueOnce(new Response(null, { status: 200 }))

    const agent = defineAgent({
      name: 'test-agent',
      description: 'Test',
      autonomyLevel: 'autonomous',
      tools: [],
    })

    await agent.deploy({ apiKey: 'test-key' })
    await agent.pause()

    const callArgs = mockFetch.mock.calls[1][1]
    const body = JSON.parse(callArgs?.body as string)

    expect(body.state).toBe('paused')
  })

  it('should resume agent', async () => {
    const mockFetch = vi.mocked(fetch)

    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify({ id: 'agent-123', url: 'https://agents.do/agent-123' }), { status: 200 }))

    mockFetch.mockResolvedValueOnce(new Response(null, { status: 200 }))

    const agent = defineAgent({
      name: 'test-agent',
      description: 'Test',
      autonomyLevel: 'autonomous',
      tools: [],
    })

    await agent.deploy({ apiKey: 'test-key' })
    await agent.resume()

    const callArgs = mockFetch.mock.calls[1][1]
    const body = JSON.parse(callArgs?.body as string)

    expect(body.state).toBe('running')
  })

  it('should stop agent', async () => {
    const mockFetch = vi.mocked(fetch)

    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify({ id: 'agent-123', url: 'https://agents.do/agent-123' }), { status: 200 }))

    mockFetch.mockResolvedValueOnce(new Response(null, { status: 200 }))

    const agent = defineAgent({
      name: 'test-agent',
      description: 'Test',
      autonomyLevel: 'autonomous',
      tools: [],
    })

    await agent.deploy({ apiKey: 'test-key' })
    await agent.stop()

    const callArgs = mockFetch.mock.calls[1][1]
    const body = JSON.parse(callArgs?.body as string)

    expect(body.state).toBe('stopped')
  })
})

describe('Agent.delete', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should delete agent', async () => {
    const mockFetch = vi.mocked(fetch)

    mockFetch.mockResolvedValueOnce(new Response(JSON.stringify({ id: 'agent-123', url: 'https://agents.do/agent-123' }), { status: 200 }))

    mockFetch.mockResolvedValueOnce(new Response(null, { status: 200 }))

    const agent = defineAgent({
      name: 'test-agent',
      description: 'Test',
      autonomyLevel: 'autonomous',
      tools: [],
    })

    await agent.deploy({ apiKey: 'test-key' })
    await agent.delete()

    expect(agent.getDeploymentId()).toBeUndefined()
  })

  it('should throw error if not deployed', async () => {
    const agent = defineAgent({
      name: 'test-agent',
      description: 'Test',
      autonomyLevel: 'autonomous',
      tools: [],
    })

    await expect(agent.delete()).rejects.toThrow('must be deployed')
  })
})

describe('listAgents', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should list all agents', async () => {
    const mockFetch = vi.mocked(fetch)

    mockFetch.mockResolvedValueOnce(
      new Response(
        JSON.stringify([
          { id: 'agent-1', name: 'agent-1', environment: 'production', state: 'running', url: 'https://agents.do/agent-1' },
          { id: 'agent-2', name: 'agent-2', environment: 'staging', state: 'paused', url: 'https://agents.do/agent-2' },
        ]),
        { status: 200 }
      )
    )

    const agents = await listAgents({ apiKey: 'test-key' })

    expect(agents).toHaveLength(2)
    expect(agents[0].name).toBe('agent-1')
    expect(agents[1].state).toBe('paused')
  })

  it('should throw error without API key', async () => {
    delete process.env.DO_API_KEY

    await expect(listAgents()).rejects.toThrow('API key is required')
  })
})

describe('getAgent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should get agent by ID', async () => {
    const mockFetch = vi.mocked(fetch)

    mockFetch.mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          id: 'agent-123',
          config: {
            name: 'test-agent',
            description: 'Test',
            autonomyLevel: 'autonomous',
            tools: [],
          },
          status: {
            state: 'running',
            executions: 100,
            errors: 0,
            uptime: '3d',
            version: '1.0.0',
            environment: 'production',
          },
        }),
        { status: 200 }
      )
    )

    const result = await getAgent('agent-123', { apiKey: 'test-key' })

    expect(result.agent).toBeInstanceOf(Agent)
    expect(result.agent.getConfig().name).toBe('test-agent')
    expect(result.status.state).toBe('running')
  })

  it('should throw error without API key', async () => {
    delete process.env.DO_API_KEY

    await expect(getAgent('agent-123')).rejects.toThrow('API key is required')
  })
})

describe('Agent autonomy levels', () => {
  it('should create supervised agent', () => {
    const agent = defineAgent({
      name: 'supervised-agent',
      description: 'Requires approval for all actions',
      autonomyLevel: 'supervised',
      tools: [],
    })

    expect(agent.getConfig().autonomyLevel).toBe('supervised')
  })

  it('should create semi-autonomous agent', () => {
    const agent = defineAgent({
      name: 'semi-agent',
      description: 'Auto-executes safe actions',
      autonomyLevel: 'semi-autonomous',
      tools: [],
    })

    expect(agent.getConfig().autonomyLevel).toBe('semi-autonomous')
  })

  it('should create autonomous agent', () => {
    const agent = defineAgent({
      name: 'auto-agent',
      description: 'Full autonomy',
      autonomyLevel: 'autonomous',
      tools: [],
    })

    expect(agent.getConfig().autonomyLevel).toBe('autonomous')
  })
})

describe('Agent tools', () => {
  it('should define tools with approval requirements', () => {
    const tools: AgentTool[] = [
      {
        name: 'search_database',
        description: 'Search customer database',
        requiresApproval: false,
      },
      {
        name: 'send_email',
        description: 'Send email to customer',
        requiresApproval: true,
      },
      {
        name: 'refund_payment',
        description: 'Process payment refund',
        requiresApproval: true,
        parameters: {
          type: 'object',
          properties: {
            amount: { type: 'number' },
            reason: { type: 'string' },
          },
        },
      },
    ]

    const agent = defineAgent({
      name: 'customer-support',
      description: 'Customer support agent',
      autonomyLevel: 'semi-autonomous',
      tools,
    })

    const config = agent.getConfig()
    expect(config.tools).toHaveLength(3)
    expect(config.tools[0].requiresApproval).toBe(false)
    expect(config.tools[1].requiresApproval).toBe(true)
    expect(config.tools[2].parameters).toBeDefined()
  })
})

describe('Agent rate limits', () => {
  it('should set rate limits', () => {
    const agent = defineAgent({
      name: 'rate-limited',
      description: 'Agent with rate limits',
      autonomyLevel: 'autonomous',
      tools: [],
      rateLimits: {
        perMinute: 10,
        perHour: 100,
        perDay: 1000,
      },
    })

    const config = agent.getConfig()
    expect(config.rateLimits?.perMinute).toBe(10)
    expect(config.rateLimits?.perHour).toBe(100)
    expect(config.rateLimits?.perDay).toBe(1000)
  })
})
