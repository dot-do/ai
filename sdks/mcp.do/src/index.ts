/**
 * mcp.do SDK - Model Context Protocol integration testing
 *
 * This SDK provides utilities for testing MCP server integration with database.do,
 * ensuring that the `do` tool exposed via MCP can properly interact with the
 * Payload CMS Durable Objects database.
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'

export interface McpClientConfig {
  command: string
  args?: string[]
  env?: Record<string, string>
}

export interface McpTool {
  name: string
  description?: string
  inputSchema: {
    type: string
    properties?: Record<string, any>
    required?: string[]
  }
}

export interface McpResource {
  uri: string
  name: string
  description?: string
  mimeType?: string
}

export interface McpPrompt {
  name: string
  description?: string
  arguments?: Array<{
    name: string
    description?: string
    required?: boolean
  }>
}

export interface ExecuteToolResult {
  content: Array<{
    type: string
    text?: string
    [key: string]: any
  }>
  isError?: boolean
}

export class McpClient {
  private client: Client
  private transport: StdioClientTransport
  private connected: boolean = false

  constructor(private config: McpClientConfig) {
    this.transport = new StdioClientTransport({
      command: config.command,
      args: config.args || [],
      env: config.env,
    })

    this.client = new Client(
      {
        name: 'mcp.do-test-client',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
          resources: {},
          prompts: {},
        },
      }
    )
  }

  /**
   * Connect to MCP server
   */
  async connect(): Promise<void> {
    if (this.connected) {
      throw new Error('Already connected')
    }

    await this.client.connect(this.transport)
    this.connected = true
  }

  /**
   * Disconnect from MCP server
   */
  async disconnect(): Promise<void> {
    if (!this.connected) {
      return
    }

    await this.client.close()
    this.connected = false
  }

  /**
   * List available tools
   */
  async listTools(): Promise<McpTool[]> {
    this.ensureConnected()

    const response = await this.client.listTools()
    return response.tools as McpTool[]
  }

  /**
   * List available resources
   */
  async listResources(): Promise<McpResource[]> {
    this.ensureConnected()

    const response = await this.client.listResources()
    return response.resources as McpResource[]
  }

  /**
   * List available prompts
   */
  async listPrompts(): Promise<McpPrompt[]> {
    this.ensureConnected()

    const response = await this.client.listPrompts()
    return response.prompts as McpPrompt[]
  }

  /**
   * Read a resource
   */
  async readResource(uri: string): Promise<any> {
    this.ensureConnected()

    const response = await this.client.readResource({ uri })
    return response.contents
  }

  /**
   * Get a prompt
   */
  async getPrompt(name: string, args?: Record<string, string>): Promise<any> {
    this.ensureConnected()

    const response = await this.client.getPrompt({
      name,
      arguments: args,
    })

    return response
  }

  /**
   * Execute a tool
   */
  async executeTool(name: string, args: Record<string, any>): Promise<ExecuteToolResult> {
    this.ensureConnected()

    const response = await this.client.callTool({
      name,
      arguments: args,
    })

    return response as ExecuteToolResult
  }

  /**
   * Execute TypeScript code via the `do` tool
   */
  async executeTypescript(script: string): Promise<any> {
    const result = await this.executeTool('do', { script })

    if (result.isError) {
      throw new Error(result.content[0]?.text || 'Unknown error')
    }

    // Parse JSON response
    const text = result.content[0]?.text
    if (!text) {
      return null
    }

    try {
      return JSON.parse(text)
    } catch {
      return text
    }
  }

  /**
   * Health check
   */
  async health(): Promise<{ status: string; tools: number; resources: number; prompts: number }> {
    const tools = await this.listTools()
    const resources = await this.listResources()
    const prompts = await this.listPrompts()

    return {
      status: 'healthy',
      tools: tools.length,
      resources: resources.length,
      prompts: prompts.length,
    }
  }

  private ensureConnected(): void {
    if (!this.connected) {
      throw new Error('Not connected. Call connect() first.')
    }
  }
}

/**
 * Create an MCP client
 */
export function createClient(config: McpClientConfig): McpClient {
  return new McpClient(config)
}
