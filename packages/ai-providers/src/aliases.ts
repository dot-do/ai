/**
 * Model aliases for common short names
 * Maps friendly names to full provider/model identifiers
 */
export const aliases: Record<string, string> = {
  // Current models (per CLAUDE.md)
  gemini: 'google/gemini-2.5-pro',
  'claude-sonnet': 'anthropic/claude-sonnet-4.5',
  'gpt-5': 'openai/gpt-5',
  'gpt-5-mini': 'openai/gpt-5-mini',
  'gpt-5-nano': 'openai/gpt-5-nano',
  'gpt-5-codex': 'openai/gpt-5-codex',
  'llama-4': 'meta/llama-4',
  'grok-4': 'xai/grok-4',

  // OpenAI models
  'dall-e-3': 'openai/dall-e-3',
  'dall-e-2': 'openai/dall-e-2',
  whisper: 'openai/whisper',
  'tts-1': 'openai/tts-1',
  'tts-1-hd': 'openai/tts-1-hd',

  // Google models
  'gemini-pro': 'google/gemini-1.5-pro',
  'gemini-flash': 'google/gemini-1.5-flash',
  'palm-2': 'google/palm-2',
  'gemma-7b': 'google/gemma-7b',
  'gemma-2b': 'google/gemma-2b',

  // Meta models
  'llama-3-70b': 'meta/llama-3-70b',
  'llama-3-8b': 'meta/llama-3-8b',
  'llama-2-70b': 'meta/llama-2-70b',
  'llama-2-13b': 'meta/llama-2-13b',
  'llama-2-7b': 'meta/llama-2-7b',

  // Mistral models
  'mistral-large': 'mistral/mistral-large',
  'mistral-medium': 'mistral/mistral-medium',
  'mistral-small': 'mistral/mistral-small',
  'mistral-7b': 'mistral/mistral-7b',
  'mixtral-8x7b': 'mistral/mixtral-8x7b',
  'mixtral-8x22b': 'mistral/mixtral-8x22b',

  // Cohere models
  'command-r': 'cohere/command-r',
  'command-r-plus': 'cohere/command-r-plus',
  command: 'cohere/command',
  'embed-english': 'cohere/embed-english',
  'embed-multilingual': 'cohere/embed-multilingual',

  // Stability AI models
  'stable-diffusion-3': 'stability/stable-diffusion-3',
  'stable-diffusion-xl': 'stability/stable-diffusion-xl',
  'stable-diffusion-2': 'stability/stable-diffusion-2',

  // DeepSeek models
  r1: 'deepseek/deepseek-r1',
  'deepseek-coder': 'deepseek/deepseek-coder',
  'deepseek-math': 'deepseek/deepseek-math',

  // AI21 models
  'j2-ultra': 'ai21/j2-ultra',
  'j2-mid': 'ai21/j2-mid',
  'j2-light': 'ai21/j2-light',

  // Midjourney models
  'midjourney-v6': 'midjourney/v6',
  'midjourney-v5': 'midjourney/v5',
  'midjourney-v4': 'midjourney/v4',
}
