/**
 * Parse agent configuration from various formats
 */
/**
 * Parse agents.md format
 */
export function parseAgentsMd(content) {
  const config = {
    name: 'Agent',
    instructions: '',
    context: [],
    rules: [],
    examples: [],
  }
  const lines = content.split('\n')
  let currentSection = null
  let buffer = []
  for (const line of lines) {
    // Check for markdown headers
    if (line.startsWith('# ')) {
      config.name = line.slice(2).trim()
      continue
    }
    if (line.startsWith('## ')) {
      // Save previous section
      if (currentSection && buffer.length > 0) {
        saveSection(config, currentSection, buffer.join('\n'))
        buffer = []
      }
      currentSection = line.slice(3).trim().toLowerCase()
      continue
    }
    buffer.push(line)
  }
  // Save final section
  if (currentSection && buffer.length > 0) {
    saveSection(config, currentSection, buffer.join('\n'))
  }
  return config
}
/**
 * Parse .cursorrules format
 */
export function parseCursorRules(content) {
  const config = {
    name: 'Cursor Agent',
    rules: [],
  }
  const lines = content.split('\n')
  let currentRule = ''
  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
      if (currentRule) {
        config.rules.push({ description: currentRule.trim() })
      }
      currentRule = trimmed.slice(1).trim()
    } else if (trimmed) {
      currentRule += ' ' + trimmed
    } else if (currentRule) {
      config.rules.push({ description: currentRule.trim() })
      currentRule = ''
    }
  }
  if (currentRule) {
    config.rules.push({ description: currentRule.trim() })
  }
  return config
}
/**
 * Parse CLAUDE.md format
 */
export function parseClaudeMd(content) {
  const config = {
    name: 'Claude Agent',
    instructions: content,
    context: [],
    rules: [],
  }
  // Extract system context if present
  const systemContextMatch = content.match(/<system_context>([\s\S]*?)<\/system_context>/)
  if (systemContextMatch) {
    config.systemPrompt = systemContextMatch[1].trim()
  }
  // Extract behavior guidelines
  const behaviorMatch = content.match(/<behavior_guidelines>([\s\S]*?)<\/behavior_guidelines>/)
  if (behaviorMatch) {
    const behaviors = behaviorMatch[1]
      .trim()
      .split('\n')
      .filter((l) => l.trim().startsWith('-'))
    config.rules = behaviors.map((b) => ({ description: b.trim().slice(1).trim() }))
  }
  return config
}
/**
 * Parse windsurf format
 */
export function parseWindsurf(content) {
  // Similar to agents.md but with windsurf-specific conventions
  return parseAgentsMd(content)
}
/**
 * Parse JSON format
 */
export function parseJson(content) {
  return JSON.parse(content)
}
/**
 * Auto-detect format and parse
 */
export function parse(content, options = {}) {
  if (options.format) {
    return parseByFormat(content, options.format)
  }
  // Auto-detect format
  if (content.trim().startsWith('{')) {
    return parseJson(content)
  }
  if (content.includes('<system_context>') || content.includes('<behavior_guidelines>')) {
    return parseClaudeMd(content)
  }
  if (content.includes('## ')) {
    return parseAgentsMd(content)
  }
  // Default to cursor rules format
  return parseCursorRules(content)
}
function parseByFormat(content, format) {
  switch (format) {
    case 'agents':
      return parseAgentsMd(content)
    case 'cursor':
      return parseCursorRules(content)
    case 'claude':
      return parseClaudeMd(content)
    case 'windsurf':
      return parseWindsurf(content)
    case 'json':
      return parseJson(content)
    default:
      throw new Error(`Unsupported format: ${format}`)
  }
}
function saveSection(config, section, content) {
  const trimmed = content.trim()
  if (!trimmed) return
  switch (section) {
    case 'description':
    case 'overview':
      config.description = trimmed
      break
    case 'instructions':
    case 'system prompt':
    case 'prompt':
      config.instructions = trimmed
      break
    case 'context':
      config.context = trimmed.split('\n').filter((l) => l.trim())
      break
    case 'rules':
    case 'guidelines':
      const rules = trimmed.split('\n').filter((l) => l.trim().startsWith('-') || l.trim().startsWith('*'))
      config.rules = rules.map((r) => ({ description: r.trim().slice(1).trim() }))
      break
    case 'examples':
      // Parse examples from markdown
      config.examples.push({
        input: trimmed,
        output: '',
      })
      break
    case 'tools':
    case 'capabilities':
      config.capabilities = trimmed.split('\n').filter((l) => l.trim())
      break
    default:
      // Store in metadata
      if (!config.metadata) config.metadata = {}
      config.metadata[section] = trimmed
  }
}
//# sourceMappingURL=parser.js.map
