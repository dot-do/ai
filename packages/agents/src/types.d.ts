/**
 * Universal agent configuration types
 * Supports multiple AI assistant formats: Claude, Cursor, Windsurf, etc.
 */
export interface AgentConfig {
  name: string
  version?: string
  description?: string
  model?: string
  instructions?: string
  systemPrompt?: string
  context?: string[]
  tools?: Tool[]
  files?: string[]
  rules?: Rule[]
  capabilities?: string[]
  constraints?: string[]
  examples?: Example[]
  metadata?: Record<string, any>
}
export interface Tool {
  name: string
  description: string
  parameters?: Record<string, any>
  enabled?: boolean
}
export interface Rule {
  id?: string
  description: string
  priority?: 'high' | 'medium' | 'low'
  category?: string
}
export interface Example {
  title?: string
  input: string
  output: string
  context?: string
}
export type AgentFormat = 'claude' | 'cursor' | 'windsurf' | 'agents' | 'agentkit' | 'json'
export interface AgentRenderer {
  format: AgentFormat
  render(config: AgentConfig): string
}
export interface ParseOptions {
  format?: AgentFormat
  strict?: boolean
}
export interface RenderOptions {
  format: AgentFormat
  pretty?: boolean
}
//# sourceMappingURL=types.d.ts.map
