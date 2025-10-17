/**
 * React components for rendering agent configurations
 */
import type { AgentConfig, Rule, Example, Tool } from './types'
export interface AgentConfigProps {
  config: AgentConfig
  format?: 'full' | 'compact'
}
export declare function AgentConfigComponent({ config, format }: AgentConfigProps): import('react/jsx-runtime').JSX.Element
export declare function RuleList({ rules }: { rules: Rule[] }): import('react/jsx-runtime').JSX.Element
export declare function ToolList({ tools }: { tools: Tool[] }): import('react/jsx-runtime').JSX.Element
export declare function ExampleList({ examples }: { examples: Example[] }): import('react/jsx-runtime').JSX.Element
/**
 * Compact view for agent config card
 */
export declare function AgentCard({ config }: { config: AgentConfig }): import('react/jsx-runtime').JSX.Element
/**
 * Interactive editor component
 */
export declare function AgentEditor({
  config,
  onChange,
}: {
  config: AgentConfig
  onChange: (config: AgentConfig) => void
}): import('react/jsx-runtime').JSX.Element
export type { AgentConfig, Rule, Example, Tool } from './types'
//# sourceMappingURL=react.d.ts.map
