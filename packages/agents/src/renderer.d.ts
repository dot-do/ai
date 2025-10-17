/**
 * Render agent configuration to various formats
 */
import type { AgentConfig, RenderOptions } from './types'
/**
 * Render to agents.md format
 */
export declare function renderAgentsMd(config: AgentConfig): string
/**
 * Render to .cursorrules format
 */
export declare function renderCursorRules(config: AgentConfig): string
/**
 * Render to CLAUDE.md format
 */
export declare function renderClaudeMd(config: AgentConfig): string
/**
 * Render to windsurf format
 */
export declare function renderWindsurf(config: AgentConfig): string
/**
 * Render to JSON format
 */
export declare function renderJson(config: AgentConfig, pretty?: boolean): string
/**
 * Render agent config to specified format
 */
export declare function render(config: AgentConfig, options: RenderOptions): string
//# sourceMappingURL=renderer.d.ts.map
