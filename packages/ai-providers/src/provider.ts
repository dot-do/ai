import { languageModel } from './registry.js'

/**
 * Legacy model function for backward compatibility
 * @param modelId The model identifier in the format "provider/model"
 * @returns Language model instance
 */
export const model = (modelId: string) => {
  return languageModel(modelId)
}
