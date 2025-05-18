import type { AIInstance, AIWorkflowDefinition } from 'workflows.do'

// TODO: actually implement this using the payload backend for executing functions and workflows
export const ai: AIInstance = {
  
}

export const AI: (definition: AIWorkflowDefinition) => AIInstance = (definition: AIWorkflowDefinition) => {
  return definition
}


