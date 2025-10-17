export interface ProjectConfig {
  name: string
  description: string
  objectives?: Record<string, Objective>
  workstreams: Workstream[]
}

export interface Objective {
  name: string
  description: string
  keyResults: KeyResult[]
}

export interface KeyResult {
  name: string
  description: string
  target: number
  current: number
  unit: string
}

export interface Workstream {
  name: string
  assigneeType: 'human' | 'ai' | 'mixed'
  roles?: string[]
  agentTypes?: string[]
}

export interface TaskConfig {
  title: string
  description: string
  workstream: string
  assignTo?: 'human' | 'agent'
  priority?: 'low' | 'medium' | 'high'
  dueDate?: Date
  dependencies?: string[] // IDs of tasks that this task depends on
}

export interface Task {
  id: string
  config: TaskConfig
  status: TaskStatus
  assignee?: string
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
  result?: any
}

export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'blocked' | 'approved' | 'rejected'

export interface ApprovalConfig {
  methods: ('slack' | 'github')[]
  slackChannel?: string
  githubRepo?: string
  defaultApprovers: string[]
}

export interface ApprovalRequest {
  taskId: string
  result: any
  method: 'slack' | 'github'
  approvers: string[]
  message: string
}

export interface ApprovalResult {
  approved: boolean
  approvedBy?: string
  approvedAt?: Date
  comments?: string
}

export interface ProjectManagement {
  createTask: (config: TaskConfig) => Promise<Task>
  configureApprovals: (config: ApprovalConfig) => void
  requestApproval: (request: ApprovalRequest) => Promise<ApprovalResult>
  updateProgress: (update: ProgressUpdate) => Promise<void>
  getStatus: () => Promise<ProjectStatus>
}

export interface ProgressUpdate {
  projectId: string
  objectiveKey: string
  keyResultIndex: number
  progress: number
}

export interface ProjectStatus {
  name: string
  description: string
  objectives: Record<string, ObjectiveStatus>
  tasks: Task[]
  progress: number
}

export interface ObjectiveStatus {
  name: string
  description: string
  keyResults: KeyResultStatus[]
  progress: number
}

export interface KeyResultStatus {
  name: string
  description: string
  target: number
  current: number
  unit: string
  progress: number
}
