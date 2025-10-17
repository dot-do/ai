/**
 * Parse agent configuration from various formats
 */
import type { AgentConfig, ParseOptions } from './types'
/**
 * Parse agents.md format
 */
export declare function parseAgentsMd(content: string): AgentConfig
/**
 * Parse .cursorrules format
 */
export declare function parseCursorRules(content: string): AgentConfig
/**
 * Parse CLAUDE.md format
 */
export declare function parseClaudeMd(content: string): AgentConfig
/**
 * Parse windsurf format
 */
export declare function parseWindsurf(content: string): AgentConfig
/**
 * Parse JSON format
 */
export declare function parseJson(content: string): AgentConfig
/**
 * Auto-detect format and parse
 */
export declare function parse(content: string, options?: ParseOptions): AgentConfig
//# sourceMappingURL=parser.d.ts.map
