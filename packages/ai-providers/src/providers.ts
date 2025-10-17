/**
 * Get human-readable provider name from slug
 *
 * @param provider - Provider slug (e.g., "openai", "anthropic")
 * @returns Human-readable provider name
 *
 * @example
 * ```ts
 * getProviderName('openai') // "OpenAI"
 * getProviderName('anthropic') // "Anthropic"
 * getProviderName('google') // "Google AI Studio"
 * ```
 */
export function getProviderName(provider: string): string {
  switch (provider.toLowerCase()) {
    case 'openai':
      return 'OpenAI'
    case 'anthropic':
      return 'Anthropic'
    case 'google':
      return 'Google AI Studio'
    case 'vertex':
    case 'googlevertex':
      return 'Google Vertex AI'
    case 'meta':
      return 'Meta AI'
    case 'xai':
      return 'xAI'
    case 'cohere':
      return 'Cohere'
    case 'ai21':
      return 'AI21 Labs'
    case 'mistral':
      return 'Mistral AI'
    case 'stability':
      return 'Stability AI'
    case 'deepseek':
      return 'DeepSeek'
    case 'midjourney':
      return 'Midjourney'
    case 'huggingface':
      return 'Hugging Face'
    case 'amazon':
    case 'bedrock':
      return 'Amazon Bedrock'
    case 'azure':
      return 'Microsoft Azure'
    case 'nvidia':
      return 'Nvidia'
    case 'replicate':
      return 'Replicate'
    case 'perplexity':
      return 'Perplexity'
    case 'together':
      return 'Together AI'
    case 'groq':
      return 'Groq'
    case 'fireworks':
      return 'Fireworks AI'
    case 'deepinfra':
      return 'DeepInfra'
    case 'cerebras':
      return 'Cerebras'
    case 'luma':
      return 'Luma AI'
    case 'fal':
      return 'Fal AI'
    case 'elevenlabs':
      return 'ElevenLabs'
    case 'assemblyai':
      return 'AssemblyAI'
    case 'deepgram':
      return 'Deepgram'
    case 'gladia':
      return 'Gladia'
    case 'lmnt':
      return 'LMNT'
    case 'hume':
      return 'Hume AI'
    case 'revai':
      return 'Rev AI'
    default:
      // Capitalize first letter
      return provider.charAt(0).toUpperCase() + provider.slice(1)
  }
}

/**
 * List of all supported provider slugs
 */
export const providerSlugs = [
  'openai',
  'anthropic',
  'google',
  'googleVertex',
  'meta',
  'xai',
  'cohere',
  'ai21',
  'mistral',
  'stability',
  'deepseek',
  'midjourney',
  'huggingface',
  'bedrock',
  'azure',
  'nvidia',
  'replicate',
  'perplexity',
  'together',
  'groq',
  'fireworks',
  'deepinfra',
  'cerebras',
  'luma',
  'fal',
  'elevenlabs',
  'assemblyai',
  'deepgram',
  'gladia',
  'lmnt',
  'hume',
  'revai',
] as const

/**
 * Type for supported provider slugs
 */
export type ProviderSlug = (typeof providerSlugs)[number]
