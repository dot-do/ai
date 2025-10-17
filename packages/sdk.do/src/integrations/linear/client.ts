/**
 * Linear Client
 *
 * Auto-generated Integration client for Linear.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/linear
 */

import LinearClient from '@linear/sdk'
import {
  IssueCreateParams,
  IssueGetParams,
  IssueUpdateParams,
  IssueDeleteParams,
  IssueListParams,
  IssueSearchParams,
  ProjectCreateParams,
  ProjectGetParams,
  ProjectUpdateParams,
  ProjectDeleteParams,
  ProjectListParams,
  TeamGetParams,
  TeamListParams,
  TeamGetMembersParams,
  UserGetParams,
  UserListParams,
  CommentCreateParams,
  CommentGetParams,
  CommentUpdateParams,
  CommentDeleteParams,
  LabelCreateParams,
  LabelGetParams,
  LabelUpdateParams,
  LabelDeleteParams,
  LabelListParams,
  WorkflowStateGetParams,
  WorkflowStateListParams,
  CycleGetParams,
  CycleListParams,
  CycleActiveParams,
  MilestoneCreateParams,
  MilestoneGetParams,
  MilestoneUpdateParams,
  MilestoneDeleteParams,
} from './types.js'
import { LinearError } from './errors.js'

/**
 * Linear client options
 */
export interface LinearClientOptions {
  /** API key for authentication */
  apiKey: string
  /** Base URL override */
  baseUrl?: string
  /** Request timeout in ms */
  timeout?: number
  /** Retry attempts */
  retryAttempts?: number
}

/**
 * Linear Client
 *
 * Issue tracking and project management for high-performance teams
 */
export class LinearClient {
  private options: LinearClientOptions
  private sdk: LinearClient

  /**
   * Issue resource
   * Issues are the core work items in Linear
   */
  public issue: {
    /** Create a new issue */
    create: (params: IssueCreateParams) => Promise<Issue>
    /** Get an issue by ID */
    get: (params: IssueGetParams) => Promise<Issue>
    /** Update an issue */
    update: (params: IssueUpdateParams) => Promise<Issue>
    /** Delete (archive) an issue */
    delete: (params: IssueDeleteParams) => Promise<boolean>
    /** List issues with optional filters */
    list: (params: IssueListParams) => Promise<PaginatedResponse<Issue>>
    /** Search issues with query and filters */
    search: (params: IssueSearchParams) => Promise<PaginatedResponse<Issue>>
  }

  /**
   * Project resource
   * Projects group issues and track progress toward goals
   */
  public project: {
    /** Create a new project */
    create: (params: ProjectCreateParams) => Promise<Project>
    /** Get a project by ID */
    get: (params: ProjectGetParams) => Promise<Project>
    /** Update a project */
    update: (params: ProjectUpdateParams) => Promise<Project>
    /** Delete (archive) a project */
    delete: (params: ProjectDeleteParams) => Promise<boolean>
    /** List projects */
    list: (params: ProjectListParams) => Promise<PaginatedResponse<Project>>
  }

  /**
   * Team resource
   * Teams organize work and members in Linear
   */
  public team: {
    /** Get a team by ID */
    get: (params: TeamGetParams) => Promise<Team>
    /** List all teams */
    list: (params: TeamListParams) => Promise<PaginatedResponse<Team>>
    /** Get team members */
    getMembers: (params: TeamGetMembersParams) => Promise<TeamMember[]>
  }

  /**
   * User resource
   * Users are members of the organization
   */
  public user: {
    /** Get a user by ID */
    get: (params: UserGetParams) => Promise<User>
    /** List all users */
    list: (params: UserListParams) => Promise<PaginatedResponse<User>>
    /** Get the authenticated user */
    me: () => Promise<User>
  }

  /**
   * Comment resource
   * Comments on issues
   */
  public comment: {
    /** Create a new comment */
    create: (params: CommentCreateParams) => Promise<Comment>
    /** Get a comment by ID */
    get: (params: CommentGetParams) => Promise<Comment>
    /** Update a comment */
    update: (params: CommentUpdateParams) => Promise<Comment>
    /** Delete a comment */
    delete: (params: CommentDeleteParams) => Promise<boolean>
  }

  /**
   * Label resource
   * Labels categorize and organize issues
   */
  public label: {
    /** Create a new label */
    create: (params: LabelCreateParams) => Promise<IssueLabel>
    /** Get a label by ID */
    get: (params: LabelGetParams) => Promise<IssueLabel>
    /** Update a label */
    update: (params: LabelUpdateParams) => Promise<IssueLabel>
    /** Delete a label */
    delete: (params: LabelDeleteParams) => Promise<boolean>
    /** List labels */
    list: (params: LabelListParams) => Promise<PaginatedResponse<IssueLabel>>
  }

  /**
   * WorkflowState resource
   * Workflow states define the stages of issue progress
   */
  public workflowState: {
    /** Get a workflow state by ID */
    get: (params: WorkflowStateGetParams) => Promise<WorkflowState>
    /** List workflow states */
    list: (params: WorkflowStateListParams) => Promise<PaginatedResponse<WorkflowState>>
  }

  /**
   * Cycle resource
   * Cycles are time-boxed iterations for planning work
   */
  public cycle: {
    /** Get a cycle by ID */
    get: (params: CycleGetParams) => Promise<Cycle>
    /** List cycles */
    list: (params: CycleListParams) => Promise<PaginatedResponse<Cycle>>
    /** Get the active cycle for a team */
    active: (params: CycleActiveParams) => Promise<Cycle>
  }

  /**
   * Milestone resource
   * Milestones mark significant points in project timelines
   */
  public milestone: {
    /** Create a new milestone */
    create: (params: MilestoneCreateParams) => Promise<Milestone>
    /** Get a milestone by ID */
    get: (params: MilestoneGetParams) => Promise<Milestone>
    /** Update a milestone */
    update: (params: MilestoneUpdateParams) => Promise<Milestone>
    /** Delete a milestone */
    delete: (params: MilestoneDeleteParams) => Promise<boolean>
  }

  constructor(options: LinearClientOptions) {
    this.options = {
      baseUrl: 'undefined',
      timeout: 30000,
      retryAttempts: 3,
      ...options,
    }

    // Initialize SDK
    this.sdk = new LinearClient(this.options.apiKey, {})

    // Initialize resource namespaces
    this.issue = {
      create: this.issueCreate.bind(this),
      get: this.issueGet.bind(this),
      update: this.issueUpdate.bind(this),
      delete: this.issueDelete.bind(this),
      list: this.issueList.bind(this),
      search: this.issueSearch.bind(this),
    }
    this.project = {
      create: this.projectCreate.bind(this),
      get: this.projectGet.bind(this),
      update: this.projectUpdate.bind(this),
      delete: this.projectDelete.bind(this),
      list: this.projectList.bind(this),
    }
    this.team = {
      get: this.teamGet.bind(this),
      list: this.teamList.bind(this),
      getMembers: this.teamGetMembers.bind(this),
    }
    this.user = {
      get: this.userGet.bind(this),
      list: this.userList.bind(this),
      me: this.userMe.bind(this),
    }
    this.comment = {
      create: this.commentCreate.bind(this),
      get: this.commentGet.bind(this),
      update: this.commentUpdate.bind(this),
      delete: this.commentDelete.bind(this),
    }
    this.label = {
      create: this.labelCreate.bind(this),
      get: this.labelGet.bind(this),
      update: this.labelUpdate.bind(this),
      delete: this.labelDelete.bind(this),
      list: this.labelList.bind(this),
    }
    this.workflowState = {
      get: this.workflowStateGet.bind(this),
      list: this.workflowStateList.bind(this),
    }
    this.cycle = {
      get: this.cycleGet.bind(this),
      list: this.cycleList.bind(this),
      active: this.cycleActive.bind(this),
    }
    this.milestone = {
      create: this.milestoneCreate.bind(this),
      get: this.milestoneGet.bind(this),
      update: this.milestoneUpdate.bind(this),
      delete: this.milestoneDelete.bind(this),
    }
  }

  /**
   * Create a new issue
   * @param params - Operation parameters
   * @returns Issue
   */
  private async issueCreate(params: IssueCreateParams): Promise<Issue> {
    try {
      const result = await this.sdk.issues.createIssue(params)
      return result
    } catch (error) {
      throw LinearError.fromError(error)
    }
  }

  /**
   * Get an issue by ID
   * @param params - Operation parameters
   * @returns Issue
   */
  private async issueGet(params: IssueGetParams): Promise<Issue> {
    try {
      const result = await this.sdk.issues.issue(params)
      return result
    } catch (error) {
      throw LinearError.fromError(error)
    }
  }

  /**
   * Update an issue
   * @param params - Operation parameters
   * @returns Issue
   */
  private async issueUpdate(params: IssueUpdateParams): Promise<Issue> {
    try {
      const result = await this.sdk.issues.updateIssue(params)
      return result
    } catch (error) {
      throw LinearError.fromError(error)
    }
  }

  /**
   * Delete (archive) an issue
   * @param params - Operation parameters
   * @returns boolean
   */
  private async issueDelete(params: IssueDeleteParams): Promise<boolean> {
    try {
      const result = await this.sdk.issues.deleteIssue(params)
      return result
    } catch (error) {
      throw LinearError.fromError(error)
    }
  }

  /**
   * List issues with optional filters
   * @param params - Operation parameters
   * @returns PaginatedResponse<Issue>
   */
  private async issueList(params: IssueListParams): Promise<PaginatedResponse<Issue>> {
    try {
      const result = await this.sdk.issues.issues(params)
      return result
    } catch (error) {
      throw LinearError.fromError(error)
    }
  }

  /**
   * Search issues with query and filters
   * @param params - Operation parameters
   * @returns PaginatedResponse<Issue>
   */
  private async issueSearch(params: IssueSearchParams): Promise<PaginatedResponse<Issue>> {
    try {
      const result = await this.sdk.issues.issues(params)
      return result
    } catch (error) {
      throw LinearError.fromError(error)
    }
  }

  /**
   * Create a new project
   * @param params - Operation parameters
   * @returns Project
   */
  private async projectCreate(params: ProjectCreateParams): Promise<Project> {
    try {
      const result = await this.sdk.projects.createProject(params)
      return result
    } catch (error) {
      throw LinearError.fromError(error)
    }
  }

  /**
   * Get a project by ID
   * @param params - Operation parameters
   * @returns Project
   */
  private async projectGet(params: ProjectGetParams): Promise<Project> {
    try {
      const result = await this.sdk.projects.project(params)
      return result
    } catch (error) {
      throw LinearError.fromError(error)
    }
  }

  /**
   * Update a project
   * @param params - Operation parameters
   * @returns Project
   */
  private async projectUpdate(params: ProjectUpdateParams): Promise<Project> {
    try {
      const result = await this.sdk.projects.updateProject(params)
      return result
    } catch (error) {
      throw LinearError.fromError(error)
    }
  }

  /**
   * Delete (archive) a project
   * @param params - Operation parameters
   * @returns boolean
   */
  private async projectDelete(params: ProjectDeleteParams): Promise<boolean> {
    try {
      const result = await this.sdk.projects.deleteProject(params)
      return result
    } catch (error) {
      throw LinearError.fromError(error)
    }
  }

  /**
   * List projects
   * @param params - Operation parameters
   * @returns PaginatedResponse<Project>
   */
  private async projectList(params: ProjectListParams): Promise<PaginatedResponse<Project>> {
    try {
      const result = await this.sdk.projects.projects(params)
      return result
    } catch (error) {
      throw LinearError.fromError(error)
    }
  }

  /**
   * Get a team by ID
   * @param params - Operation parameters
   * @returns Team
   */
  private async teamGet(params: TeamGetParams): Promise<Team> {
    try {
      const result = await this.sdk.teams.team(params)
      return result
    } catch (error) {
      throw LinearError.fromError(error)
    }
  }

  /**
   * List all teams
   * @param params - Operation parameters
   * @returns PaginatedResponse<Team>
   */
  private async teamList(params: TeamListParams): Promise<PaginatedResponse<Team>> {
    try {
      const result = await this.sdk.teams.teams(params)
      return result
    } catch (error) {
      throw LinearError.fromError(error)
    }
  }

  /**
   * Get team members
   * @param params - Operation parameters
   * @returns TeamMember[]
   */
  private async teamGetMembers(params: TeamGetMembersParams): Promise<TeamMember[]> {
    try {
      const result = await this.sdk.teams.team.members(params)
      return result
    } catch (error) {
      throw LinearError.fromError(error)
    }
  }

  /**
   * Get a user by ID
   * @param params - Operation parameters
   * @returns User
   */
  private async userGet(params: UserGetParams): Promise<User> {
    try {
      const result = await this.sdk.users.user(params)
      return result
    } catch (error) {
      throw LinearError.fromError(error)
    }
  }

  /**
   * List all users
   * @param params - Operation parameters
   * @returns PaginatedResponse<User>
   */
  private async userList(params: UserListParams): Promise<PaginatedResponse<User>> {
    try {
      const result = await this.sdk.users.users(params)
      return result
    } catch (error) {
      throw LinearError.fromError(error)
    }
  }

  /**
   * Get the authenticated user
   * @returns User
   */
  private async userMe(): Promise<User> {
    try {
      const result = await this.sdk.users.viewer()
      return result
    } catch (error) {
      throw LinearError.fromError(error)
    }
  }

  /**
   * Create a new comment
   * @param params - Operation parameters
   * @returns Comment
   */
  private async commentCreate(params: CommentCreateParams): Promise<Comment> {
    try {
      const result = await this.sdk.comments.createComment(params)
      return result
    } catch (error) {
      throw LinearError.fromError(error)
    }
  }

  /**
   * Get a comment by ID
   * @param params - Operation parameters
   * @returns Comment
   */
  private async commentGet(params: CommentGetParams): Promise<Comment> {
    try {
      const result = await this.sdk.comments.comment(params)
      return result
    } catch (error) {
      throw LinearError.fromError(error)
    }
  }

  /**
   * Update a comment
   * @param params - Operation parameters
   * @returns Comment
   */
  private async commentUpdate(params: CommentUpdateParams): Promise<Comment> {
    try {
      const result = await this.sdk.comments.updateComment(params)
      return result
    } catch (error) {
      throw LinearError.fromError(error)
    }
  }

  /**
   * Delete a comment
   * @param params - Operation parameters
   * @returns boolean
   */
  private async commentDelete(params: CommentDeleteParams): Promise<boolean> {
    try {
      const result = await this.sdk.comments.deleteComment(params)
      return result
    } catch (error) {
      throw LinearError.fromError(error)
    }
  }

  /**
   * Create a new label
   * @param params - Operation parameters
   * @returns IssueLabel
   */
  private async labelCreate(params: LabelCreateParams): Promise<IssueLabel> {
    try {
      const result = await this.sdk.issueLabels.createIssueLabel(params)
      return result
    } catch (error) {
      throw LinearError.fromError(error)
    }
  }

  /**
   * Get a label by ID
   * @param params - Operation parameters
   * @returns IssueLabel
   */
  private async labelGet(params: LabelGetParams): Promise<IssueLabel> {
    try {
      const result = await this.sdk.issueLabels.issueLabel(params)
      return result
    } catch (error) {
      throw LinearError.fromError(error)
    }
  }

  /**
   * Update a label
   * @param params - Operation parameters
   * @returns IssueLabel
   */
  private async labelUpdate(params: LabelUpdateParams): Promise<IssueLabel> {
    try {
      const result = await this.sdk.issueLabels.updateIssueLabel(params)
      return result
    } catch (error) {
      throw LinearError.fromError(error)
    }
  }

  /**
   * Delete a label
   * @param params - Operation parameters
   * @returns boolean
   */
  private async labelDelete(params: LabelDeleteParams): Promise<boolean> {
    try {
      const result = await this.sdk.issueLabels.deleteIssueLabel(params)
      return result
    } catch (error) {
      throw LinearError.fromError(error)
    }
  }

  /**
   * List labels
   * @param params - Operation parameters
   * @returns PaginatedResponse<IssueLabel>
   */
  private async labelList(params: LabelListParams): Promise<PaginatedResponse<IssueLabel>> {
    try {
      const result = await this.sdk.issueLabels.issueLabels(params)
      return result
    } catch (error) {
      throw LinearError.fromError(error)
    }
  }

  /**
   * Get a workflow state by ID
   * @param params - Operation parameters
   * @returns WorkflowState
   */
  private async workflowStateGet(params: WorkflowStateGetParams): Promise<WorkflowState> {
    try {
      const result = await this.sdk.workflowStates.workflowState(params)
      return result
    } catch (error) {
      throw LinearError.fromError(error)
    }
  }

  /**
   * List workflow states
   * @param params - Operation parameters
   * @returns PaginatedResponse<WorkflowState>
   */
  private async workflowStateList(params: WorkflowStateListParams): Promise<PaginatedResponse<WorkflowState>> {
    try {
      const result = await this.sdk.workflowStates.workflowStates(params)
      return result
    } catch (error) {
      throw LinearError.fromError(error)
    }
  }

  /**
   * Get a cycle by ID
   * @param params - Operation parameters
   * @returns Cycle
   */
  private async cycleGet(params: CycleGetParams): Promise<Cycle> {
    try {
      const result = await this.sdk.cycles.cycle(params)
      return result
    } catch (error) {
      throw LinearError.fromError(error)
    }
  }

  /**
   * List cycles
   * @param params - Operation parameters
   * @returns PaginatedResponse<Cycle>
   */
  private async cycleList(params: CycleListParams): Promise<PaginatedResponse<Cycle>> {
    try {
      const result = await this.sdk.cycles.cycles(params)
      return result
    } catch (error) {
      throw LinearError.fromError(error)
    }
  }

  /**
   * Get the active cycle for a team
   * @param params - Operation parameters
   * @returns Cycle
   */
  private async cycleActive(params: CycleActiveParams): Promise<Cycle> {
    try {
      const result = await this.sdk.cycles.cycles(params)
      return result
    } catch (error) {
      throw LinearError.fromError(error)
    }
  }

  /**
   * Create a new milestone
   * @param params - Operation parameters
   * @returns Milestone
   */
  private async milestoneCreate(params: MilestoneCreateParams): Promise<Milestone> {
    try {
      const result = await this.sdk.projectMilestones.createProjectMilestone(params)
      return result
    } catch (error) {
      throw LinearError.fromError(error)
    }
  }

  /**
   * Get a milestone by ID
   * @param params - Operation parameters
   * @returns Milestone
   */
  private async milestoneGet(params: MilestoneGetParams): Promise<Milestone> {
    try {
      const result = await this.sdk.projectMilestones.projectMilestone(params)
      return result
    } catch (error) {
      throw LinearError.fromError(error)
    }
  }

  /**
   * Update a milestone
   * @param params - Operation parameters
   * @returns Milestone
   */
  private async milestoneUpdate(params: MilestoneUpdateParams): Promise<Milestone> {
    try {
      const result = await this.sdk.projectMilestones.updateProjectMilestone(params)
      return result
    } catch (error) {
      throw LinearError.fromError(error)
    }
  }

  /**
   * Delete a milestone
   * @param params - Operation parameters
   * @returns boolean
   */
  private async milestoneDelete(params: MilestoneDeleteParams): Promise<boolean> {
    try {
      const result = await this.sdk.projectMilestones.deleteProjectMilestone(params)
      return result
    } catch (error) {
      throw LinearError.fromError(error)
    }
  }
}
