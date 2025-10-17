/**
 * Render agent configuration to various formats
 */
/**
 * Render to agents.md format
 */
export function renderAgentsMd(config) {
  const sections = []
  sections.push(`# ${config.name}\n`)
  if (config.description) {
    sections.push(`## Description\n\n${config.description}\n`)
  }
  if (config.instructions) {
    sections.push(`## Instructions\n\n${config.instructions}\n`)
  }
  if (config.context && config.context.length > 0) {
    sections.push(`## Context\n\n${config.context.join('\n')}\n`)
  }
  if (config.rules && config.rules.length > 0) {
    sections.push(`## Rules\n\n${config.rules.map((r) => `- ${r.description}`).join('\n')}\n`)
  }
  if (config.capabilities && config.capabilities.length > 0) {
    sections.push(`## Capabilities\n\n${config.capabilities.join('\n')}\n`)
  }
  if (config.examples && config.examples.length > 0) {
    sections.push(
      `## Examples\n\n${config.examples.map((e) => `### ${e.title || 'Example'}\n\n**Input:** ${e.input}\n\n**Output:** ${e.output}`).join('\n\n')}\n`
    )
  }
  return sections.join('\n')
}
/**
 * Render to .cursorrules format
 */
export function renderCursorRules(config) {
  const lines = []
  if (config.name) {
    lines.push(`# ${config.name}`)
    lines.push('')
  }
  if (config.description) {
    lines.push(config.description)
    lines.push('')
  }
  if (config.rules && config.rules.length > 0) {
    lines.push(...config.rules.map((r) => `- ${r.description}`))
    lines.push('')
  }
  if (config.instructions) {
    lines.push(config.instructions)
  }
  return lines.join('\n')
}
/**
 * Render to CLAUDE.md format
 */
export function renderClaudeMd(config) {
  const sections = []
  if (config.systemPrompt) {
    sections.push('<system_context>')
    sections.push(config.systemPrompt)
    sections.push('</system_context>')
    sections.push('')
  }
  if (config.rules && config.rules.length > 0) {
    sections.push('<behavior_guidelines>')
    sections.push('')
    sections.push(...config.rules.map((r) => `- ${r.description}`))
    sections.push('')
    sections.push('</behavior_guidelines>')
    sections.push('')
  }
  if (config.instructions) {
    sections.push(config.instructions)
    sections.push('')
  }
  if (config.examples && config.examples.length > 0) {
    sections.push('<examples>')
    sections.push('')
    config.examples.forEach((ex, i) => {
      sections.push(`<example id="${i + 1}">`)
      if (ex.title) sections.push(`<description>${ex.title}</description>`)
      sections.push(`<input>${ex.input}</input>`)
      sections.push(`<output>${ex.output}</output>`)
      sections.push('</example>')
      sections.push('')
    })
    sections.push('</examples>')
  }
  return sections.join('\n')
}
/**
 * Render to windsurf format
 */
export function renderWindsurf(config) {
  // Similar to agents.md
  return renderAgentsMd(config)
}
/**
 * Render to JSON format
 */
export function renderJson(config, pretty = false) {
  return JSON.stringify(config, null, pretty ? 2 : 0)
}
/**
 * Render agent config to specified format
 */
export function render(config, options) {
  switch (options.format) {
    case 'agents':
      return renderAgentsMd(config)
    case 'cursor':
      return renderCursorRules(config)
    case 'claude':
      return renderClaudeMd(config)
    case 'windsurf':
      return renderWindsurf(config)
    case 'json':
      return renderJson(config, options.pretty)
    default:
      throw new Error(`Unsupported format: ${options.format}`)
  }
}
//# sourceMappingURL=renderer.js.map
