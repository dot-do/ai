import type { AIInstance, AIWorkflowDefinition } from 'workflows.do'
import { generateObject, generateText } from 'ai'
import { model } from './lib/ai'

interface AIConfig {
  model?: string
  system?: string
  temperature?: number
  seed?: number
}

function createTaggedTemplate(strings: TemplateStringsArray, ...values: any[]) {
  const text = strings.reduce((acc, str, i) => acc + str + (values[i] || ''), '');
  
  return async (config?: AIConfig) => {
    try {
      const result = await generateText({
        model: model(config?.model || 'google/gemini-2.5-pro-preview'),
        prompt: text,
        system: config?.system
      });
      
      return result.text;
    } catch (error) {
      console.error('Error generating text:', error);
      throw error;
    }
  };
}

function createListGenerator(strings: TemplateStringsArray, ...values: any[]) {
  const text = strings.reduce((acc, str, i) => acc + str + (values[i] || ''), '');
  
  return async (config?: AIConfig) => {
    try {
      const result = await generateText({
        model: model(config?.model || 'google/gemini-2.5-pro-preview'),
        prompt: `Generate a numbered list of ${text}`,
        system: config?.system
      });
      
      const lines = result.text.split('\n');
      const items = lines
        .filter(line => /^\d+\./.test(line.trim())) // Filter lines that start with a number and period
        .map(line => line.replace(/^\d+\.\s*/, '').trim()); // Remove the number and period
      
      return items;
    } catch (error) {
      console.error('Error generating list:', error);
      throw error;
    }
  };
}

export const ai = new Proxy({} as any, {
  get: (target, prop) => {
    // Handle special properties to avoid Promise-related issues
    if (prop === 'then' || prop === 'catch' || prop === Symbol.toStringTag || prop === 'toString') {
      return undefined;
    }
    
    // Handle tag property for template literals
    if (prop === 'tag') {
      return createTaggedTemplate;
    }
    
    // Handle list property for array generation
    if (prop === 'list') {
      return createListGenerator;
    }
    
    return async (input: any, config?: AIConfig) => {
      try {
        const result = await generateObject({
          model: model(config?.model || 'google/gemini-2.5-pro-preview'),
          prompt: `Execute function: ${String(prop)} with input: ${JSON.stringify(input)}`,
          system: config?.system,
          output: 'no-schema'
        });
        
        return result.object;
      } catch (error) {
        console.error(`Error executing ${String(prop)}:`, error);
        throw error;
      }
    };
  }
}) as AIInstance;

export const tag = createTaggedTemplate;

export const list = createListGenerator;

export const AI: (definition: AIWorkflowDefinition) => AIInstance = (definition: AIWorkflowDefinition) => {
  return definition;
}
