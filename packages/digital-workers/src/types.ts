/**
 * Agent configuration interface copied from autonomous-agents
 */
export interface AgentConfig {
  name: string
  url: string
  role: string
  objective: string
  keyResults: string[]
  integrations: string[]
  triggers: string[]
  searches: string[]
  actions: string[]
  [key: string]: any
}

/**
 * Autonomous agent interface copied from autonomous-agents
 */
export interface AutonomousAgent {
  config: AgentConfig
  execute: (input: Record<string, any>, options?: any) => Promise<any>
  do: any // Proxy for dynamic method invocation
  [key: string]: any // Allow dynamic properties for event handlers
}

/**
 * Plan structure for worker tasks
 */
export interface Plan {
  name: string
  description?: string
  steps: string[]
  status?: 'pending' | 'in_progress' | 'completed' | 'failed'
  progress?: number
  startedAt?: string
  completedAt?: string
}

/**
 * Configuration for Slack integration
 */
export interface SlackConfig {
  token: string
  channels?: string[]
  botName?: string
  botIcon?: string
}

/**
 * Configuration for Microsoft Teams integration
 */
export interface TeamsConfig {
  token: string
  channels?: string[]
  botName?: string
  webhookUrl?: string
  useAdaptiveCards?: boolean
  callbackUrl?: string
  channelId?: string
}

/**
 * Configuration for Email integration
 */
export interface EmailConfig {
  smtp: string
  address: string
  name?: string
  signature?: string
}

/**
 * Configuration for Phone/SMS integration
 */
export interface PhoneConfig {
  provider: 'twilio' | 'vonage' | 'messagebird' | string
  accountId: string
  authToken: string
  phoneNumber: string
}

/**
 * Configuration for communication channels
 */
export interface WorkerCommunicationConfig {
  slack?: SlackConfig
  teams?: TeamsConfig
  email?: EmailConfig
  phone?: PhoneConfig
  [key: string]: any
}

/**
 * OKR target configuration
 */
export interface OkrTarget {
  target: string
  weight: number
  currentValue?: any
  lastUpdated?: string
}

/**
 * Configuration for the event loop and KPI tracking
 */
export interface WorkerEventLoopConfig {
  frequency: string // Cron expression
  kpis: string[]
  okrs: Record<string, OkrTarget>
  evaluationStrategy?: 'simple' | 'weighted' | 'custom'
  customEvaluator?: (kpis: Record<string, any>, okrs: Record<string, OkrTarget>) => Promise<any>
}

/**
 * Configuration options for creating a worker
 */
export interface WorkerConfig {
  name: string
  description: string
  url?: string
  role?: string
  id?: string
  initialContext?: Record<string, any>
  initialPlans?: Plan[]
  communication?: WorkerCommunicationConfig
  eventLoop?: WorkerEventLoopConfig
  searches?: string[]
  actions?: string[]
  [key: string]: any
}

/**
 * The worker instance returned by the Worker function
 */
export interface WorkerInstance {
  id: string
  agent: AutonomousAgent
  context: Record<string, any>
  plans: Plan[]
  execute: (input: any) => Promise<any>
  updateContext: (newContext: any) => Promise<void>
  sendMessage: (channel: string, message: any) => Promise<void>
  evaluateKpis: () => Promise<any>
  [key: string]: any
}
