import { ParsedModel } from './types.js'
import { aliases } from './aliases.js'

/**
 * Parse a model reference string with capabilities and constraints
 *
 * Supports the following formats:
 * - `provider/model` - Standard format (e.g., "openai/gpt-5")
 * - `model` - Short name with alias resolution (e.g., "gpt-5" → "openai/gpt-5")
 * - `provider/model(capabilities)` - With capabilities (e.g., "openai/gpt-5(vision,function-calling)")
 * - `provider/model(cost<0.001,latency<100)` - With provider constraints
 *
 * @param modelReference - Model reference string to parse
 * @returns Parsed model with provider, model name, capabilities, and constraints
 *
 * @example
 * ```ts
 * parse('openai/gpt-5')
 * // { original: 'openai/gpt-5', author: 'openai', model: 'gpt-5' }
 *
 * parse('gpt-5(vision,function-calling)')
 * // {
 * //   original: 'gpt-5(vision,function-calling)',
 * //   author: 'openai',
 * //   model: 'gpt-5',
 * //   capabilities: { vision: true, 'function-calling': true }
 * // }
 *
 * parse('anthropic/claude-sonnet(cost<0.001)')
 * // {
 * //   original: 'anthropic/claude-sonnet(cost<0.001)',
 * //   author: 'anthropic',
 * //   model: 'claude-sonnet',
 * //   providerConstraints: [{ field: 'cost', type: 'lt', value: '0.001' }]
 * // }
 * ```
 */
export function parse(modelReference: string): ParsedModel {
  const result: ParsedModel = {
    original: modelReference,
  }

  let cleanReference = modelReference
  const capabilitiesMatch = modelReference.match(/\((.*?)\)/)

  if (capabilitiesMatch) {
    cleanReference = modelReference.replace(/\(.*?\)/, '')

    const capabilitiesStr = capabilitiesMatch[1]
    const capabilities: Record<string, boolean> = {}
    const providerConstraints: Array<{ field: string; type: string; value: string }> = []

    capabilitiesStr.split(',').forEach((item) => {
      const constraintMatch = item.match(/([a-zA-Z]+)([<>=]+)(.+)/)

      if (constraintMatch) {
        const [_, field, operator, value] = constraintMatch
        let type = 'eq'

        if (operator === '<') type = 'lt'
        else if (operator === '>') type = 'gt'
        else if (operator === '<=') type = 'lte'
        else if (operator === '>=') type = 'gte'
        else if (operator === '!=') type = 'neq'

        providerConstraints.push({ field, type, value })
      } else {
        capabilities[item.trim()] = true
      }
    })

    if (Object.keys(capabilities).length > 0) {
      result.capabilities = capabilities
    }

    if (providerConstraints.length > 0) {
      result.providerConstraints = providerConstraints
    }
  }

  if (cleanReference.includes('/')) {
    const [author, model] = cleanReference.split('/')
    result.author = author
    result.model = model
  } else {
    // Check aliases first
    if (aliases[cleanReference]) {
      if (aliases[cleanReference].includes('/')) {
        const [author, model] = aliases[cleanReference].split('/')
        result.author = author
        result.model = model
      } else {
        result.model = aliases[cleanReference]
      }
    } else {
      result.model = cleanReference
    }
  }

  return result
}

/**
 * Get the full model identifier from a parsed model
 *
 * @param parsed - Parsed model object
 * @returns Full model identifier in format "provider/model"
 *
 * @example
 * ```ts
 * const parsed = parse('gpt-5')
 * getModelId(parsed) // "openai/gpt-5"
 * ```
 */
export function getModelId(parsed: ParsedModel): string {
  if (parsed.author && parsed.model) {
    return `${parsed.author}/${parsed.model}`
  }
  return parsed.model || parsed.original
}
