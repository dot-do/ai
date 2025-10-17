/**
 * mdxai - Simplified AI-powered MDX development tool
 *
 * Built with:
 * - Bun runtime
 * - React Ink for CLI
 * - AI SDK with OpenRouter (defaults to GPT-4o)
 * - Integration with mdxe, mdxdb, and mdxui
 * - Agentic architecture with tools
 */

// Agent exports (main API)
export { MdxAgent, createAgent } from './agent'
export type { AgentOptions, AgentResult } from './agent'

// Claude Agents SDK integration
export { ClaudeAgent, createClaudeAgent } from './claude-agent'
export type { ClaudeAgentConfig } from './claude-agent'

// Legacy AI exports (for backward compatibility)
export { MdxAI, createAI } from './ai'

// Build/test/deploy exports
export { build, watch } from './build'
export { test } from './test'
export { deploy } from './deploy'

// Tools exports
export { tools } from './tools'
export type { Tools } from './tools'

// Type exports
export type { MdxAIConfig, GenerateOptions, GenerateResult, BuildOptions, TestOptions, DeployOptions } from './types'

// Re-export mdxe functionality
export { compile, compileSync, render, validate, createWorkerLoader } from 'mdxe'

// Re-export mdxui types
export type * from 'mdxui/types'
