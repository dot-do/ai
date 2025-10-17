/**
 * React components for rendering agent configurations
 */

import type { ChangeEvent } from 'react'
import type { AgentConfig, Rule, Example, Tool } from './types'

export interface AgentConfigProps {
  config: AgentConfig
  format?: 'full' | 'compact'
}

export function AgentConfigComponent({ config }: AgentConfigProps) {
  return (
    <div className="agent-config">
      <h1>{config.name}</h1>
      {config.version && <div className="version">Version {config.version}</div>}
      {config.description && (
        <section className="description">
          <h2>Description</h2>
          <p>{config.description}</p>
        </section>
      )}
      {config.instructions && (
        <section className="instructions">
          <h2>Instructions</h2>
          <pre>{config.instructions}</pre>
        </section>
      )}
      {config.rules && config.rules.length > 0 && (
        <section className="rules">
          <h2>Rules</h2>
          <RuleList rules={config.rules} />
        </section>
      )}
      {config.capabilities && config.capabilities.length > 0 && (
        <section className="capabilities">
          <h2>Capabilities</h2>
          <ul>
            {config.capabilities.map((cap, i) => (
              <li key={i}>{cap}</li>
            ))}
          </ul>
        </section>
      )}
      {config.tools && config.tools.length > 0 && (
        <section className="tools">
          <h2>Tools</h2>
          <ToolList tools={config.tools} />
        </section>
      )}
      {config.examples && config.examples.length > 0 && (
        <section className="examples">
          <h2>Examples</h2>
          <ExampleList examples={config.examples} />
        </section>
      )}
    </div>
  )
}

export function RuleList({ rules }: { rules: Rule[] }) {
  const grouped = groupBy(rules, (r) => r.category || 'general')

  return (
    <div className="rule-list">
      {Object.entries(grouped).map(([category, categoryRules]) => (
        <div key={category} className="rule-category">
          <h3>{category}</h3>
          <ul>
            {categoryRules.map((rule, i) => (
              <li key={i} className={`priority-${rule.priority || 'medium'}`}>
                {rule.description}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export function ToolList({ tools }: { tools: Tool[] }) {
  return (
    <div className="tool-list">
      {tools.map((tool, i) => (
        <div key={i} className="tool">
          <h4>{tool.name}</h4>
          <p>{tool.description}</p>
          {tool.parameters && (
            <details>
              <summary>Parameters</summary>
              <pre>{JSON.stringify(tool.parameters, null, 2)}</pre>
            </details>
          )}
        </div>
      ))}
    </div>
  )
}

export function ExampleList({ examples }: { examples: Example[] }) {
  return (
    <div className="example-list">
      {examples.map((example, i) => (
        <div key={i} className="example">
          {example.title && <h4>{example.title}</h4>}
          <div className="example-input">
            <strong>Input:</strong>
            <pre>{example.input}</pre>
          </div>
          <div className="example-output">
            <strong>Output:</strong>
            <pre>{example.output}</pre>
          </div>
          {example.context && (
            <div className="example-context">
              <em>{example.context}</em>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

/**
 * Compact view for agent config card
 */
export function AgentCard({ config }: { config: AgentConfig }) {
  return (
    <div className="agent-card">
      <h3>{config.name}</h3>
      {config.description && <p className="description">{config.description}</p>}
      <div className="meta">
        {config.model && <span className="model">{config.model}</span>}
        {config.rules && <span className="rule-count">{config.rules.length} rules</span>}
        {config.capabilities && <span className="capability-count">{config.capabilities.length} capabilities</span>}
      </div>
    </div>
  )
}

/**
 * Interactive editor component
 */
export function AgentEditor({ config, onChange }: { config: AgentConfig; onChange: (config: AgentConfig) => void }) {
  const updateField = (field: keyof AgentConfig, value: any) => {
    onChange({ ...config, [field]: value })
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target as any
    updateField(target.name as keyof AgentConfig, target.value)
  }

  const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target as any
    updateField(target.name as keyof AgentConfig, target.value)
  }

  return (
    <div className="agent-editor">
      <div className="field">
        <label>Name</label>
        <input type="text" name="name" value={config.name} onChange={handleInputChange} />
      </div>
      <div className="field">
        <label>Description</label>
        <textarea name="description" value={config.description || ''} onChange={handleTextareaChange} />
      </div>
      <div className="field">
        <label>Instructions</label>
        <textarea name="instructions" value={config.instructions || ''} onChange={handleTextareaChange} rows={10} />
      </div>
      <div className="field">
        <label>Model</label>
        <input type="text" name="model" value={config.model || ''} onChange={handleInputChange} />
      </div>
    </div>
  )
}

// Utility function
function groupBy<T>(arr: T[], fn: (item: T) => string): Record<string, T[]> {
  return arr.reduce(
    (acc, item) => {
      const key = fn(item)
      if (!acc[key]) acc[key] = []
      acc[key].push(item)
      return acc
    },
    {} as Record<string, T[]>
  )
}

// Export all components
export type { AgentConfig, Rule, Example, Tool } from './types'
