import { Manager } from 'ai-management'
import { Agent } from 'autonomous-agents'
import { ProjectConfig, ProjectManagement, ApprovalConfig, ApprovalRequest, ApprovalResult, TaskConfig, Task, ProgressUpdate, ProjectStatus } from './types'
import { createTask } from './task'
import { requestSlackApproval } from './approvals/slack'
import { requestGitHubApproval } from './approvals/github'
import { updateProgress as updateMetricsProgress, getProjectStatus, initializeProjectMetrics } from './tracking/metrics'
import { integrateWithAIManagement, integrateWithAutonomousAgents, integrateWithBusinessAsCode } from './utils/integrations'
import crypto from 'crypto'

/**
 * Creates a project management instance for AI-driven project management with human approval workflows
 * @param config The project configuration
 * @returns A project management instance
 */
export function Project(config: ProjectConfig): ProjectManagement {
  const manager = Manager({
    name: config.name,
    description: config.description,
    objectives: config.objectives || {},
    agents: {},
    initialPlans: [],
  })

  const workstreams = config.workstreams || []

  let approvalConfig: ApprovalConfig = {
    methods: [],
    defaultApprovers: [],
  }

  const tasks: Record<string, Task> = {}

  const projectManagement: ProjectManagement = {
    async createTask(taskConfig: TaskConfig): Promise<Task> {
      const workstream = workstreams.find((ws) => ws.name === taskConfig.workstream)

      if (!workstream) {
        throw new Error(`Workstream "${taskConfig.workstream}" not found`)
      }

      let assignTo = taskConfig.assignTo

      if (!assignTo) {
        if (workstream.assigneeType === 'human') {
          assignTo = 'human'
        } else if (workstream.assigneeType === 'ai') {
          assignTo = 'agent'
        } else {
          assignTo = Math.random() > 0.5 ? 'human' : 'agent'
        }
      }

      const task = await createTask({
        ...taskConfig,
        assignTo,
      })

      tasks[task.id] = task

      if (assignTo === 'agent' && workstream.agentTypes && workstream.agentTypes.length > 0) {
        integrateWithAutonomousAgents(taskConfig)
      }

      return task
    },

    configureApprovals(config: ApprovalConfig): void {
      approvalConfig = config
    },

    async requestApproval(request: ApprovalRequest): Promise<ApprovalResult> {
      if (!tasks[request.taskId]) {
        throw new Error(`Task with ID "${request.taskId}" not found`)
      }

      if (!approvalConfig.methods.includes(request.method)) {
        throw new Error(`Approval method "${request.method}" is not configured`)
      }

      let result: ApprovalResult

      if (request.method === 'slack') {
        result = await requestSlackApproval(request)
      } else if (request.method === 'github') {
        result = await requestGitHubApproval(request)
      } else {
        throw new Error(`Unsupported approval method: ${request.method}`)
      }

      if (result.approved) {
        tasks[request.taskId].status = 'approved'
      } else {
        tasks[request.taskId].status = 'rejected'
      }

      return result
    },

    async updateProgress(update: ProgressUpdate): Promise<void> {
      await manager.updateKeyResultProgress(update.objectiveKey, update.keyResultIndex, update.progress)

      const updateWithProjectId: ProgressUpdate = {
        ...update,
        projectId: crypto.randomUUID(), // In a real implementation, this would be the actual project ID
      }

      await updateMetricsProgress(updateWithProjectId)
    },

    async getStatus(): Promise<ProjectStatus> {
      const progress = await manager.getOverallProgress()

      const projectId = crypto.randomUUID()

      try {
        await initializeProjectMetrics(projectId, config.name, config.description, config.objectives || {})
      } catch (error) {
        console.warn('Error initializing project metrics:', error)
      }

      const status = await getProjectStatus(projectId)

      return {
        ...status,
        tasks: Object.values(tasks),
        progress,
      }
    },
  }

  integrateWithAIManagement(config)
  integrateWithBusinessAsCode(config)

  return projectManagement
}
