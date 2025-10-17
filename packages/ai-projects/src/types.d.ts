declare module 'ai-management' {
  export interface ManagerConfig {
    name?: string
    objectives: Record<string, any>
    agents: Record<string, any>
    initialPlans: any[]
  }

  export function Manager(config: ManagerConfig): any
}

declare module 'autonomous-agents' {
  export interface AgentConfig {
    name?: string
    role?: string
    objective?: string
    keyResults?: any[]
  }

  export function Agent(config: AgentConfig): any
}

declare module 'business-as-code' {
  export interface BusinessConfig {
    name?: string
    description?: string
  }

  export function Business(config: BusinessConfig): any
}

declare module 'ai-business' {}
