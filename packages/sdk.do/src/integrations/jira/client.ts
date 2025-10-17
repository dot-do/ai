/**
 * Jira Client
 *
 * Auto-generated Integration client for Jira.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/jira
 */

import JiraApi from 'jira-client'
import {
  IssueCreateParams,
  IssueGetParams,
  IssueUpdateParams,
  IssueDeleteParams,
  IssueListParams,
  ProjectCreateParams,
  ProjectGetParams,
  ProjectUpdateParams,
  ProjectDeleteParams,
  ProjectListParams,
  SprintCreateParams,
  SprintGetParams,
  SprintUpdateParams,
  SprintDeleteParams,
  SprintListParams,
  BoardCreateParams,
  BoardGetParams,
  BoardDeleteParams,
  BoardListParams,
} from './types.js'
import { JiraError } from './errors.js'

/**
 * Jira client options
 */
export interface JiraClientOptions {
  /** OAuth2 access token */
  accessToken: string
  /** Base URL override */
  baseUrl?: string
  /** Request timeout in ms */
  timeout?: number
  /** Retry attempts */
  retryAttempts?: number
}

/**
 * Jira Client
 *
 * Agile project management and issue tracking platform
 */
export class JiraClient {
  private options: JiraClientOptions
  private sdk: JiraApi

  /**
   * Issue resource
   * Jira issue tracking
   */
  public issue: {
    /** undefined Issue */
    create: (params: IssueCreateParams) => Promise<Issue>
    /** undefined Issue */
    get: (params: IssueGetParams) => Promise<Issue>
    /** undefined Issue */
    update: (params: IssueUpdateParams) => Promise<Issue>
    /** undefined Issue */
    delete: (params: IssueDeleteParams) => Promise<boolean>
    /** undefined Issue */
    list: (params: IssueListParams) => Promise<Issue[]>
  }

  /**
   * Project resource
   * Jira project management
   */
  public project: {
    /** undefined Project */
    create: (params: ProjectCreateParams) => Promise<Project>
    /** undefined Project */
    get: (params: ProjectGetParams) => Promise<Project>
    /** undefined Project */
    update: (params: ProjectUpdateParams) => Promise<Project>
    /** undefined Project */
    delete: (params: ProjectDeleteParams) => Promise<boolean>
    /** undefined Project */
    list: (params: ProjectListParams) => Promise<Project[]>
  }

  /**
   * Sprint resource
   * Agile sprint management
   */
  public sprint: {
    /** undefined Sprint */
    create: (params: SprintCreateParams) => Promise<Sprint>
    /** undefined Sprint */
    get: (params: SprintGetParams) => Promise<Sprint>
    /** undefined Sprint */
    update: (params: SprintUpdateParams) => Promise<Sprint>
    /** undefined Sprint */
    delete: (params: SprintDeleteParams) => Promise<boolean>
    /** undefined Sprint */
    list: (params: SprintListParams) => Promise<Sprint[]>
  }

  /**
   * Board resource
   * Agile board management
   */
  public board: {
    /** undefined Board */
    create: (params: BoardCreateParams) => Promise<Board>
    /** undefined Board */
    get: (params: BoardGetParams) => Promise<Board>
    /** undefined Board */
    delete: (params: BoardDeleteParams) => Promise<boolean>
    /** undefined Board */
    list: (params: BoardListParams) => Promise<Board[]>
  }

  constructor(options: JiraClientOptions) {
    this.options = {
      baseUrl: 'undefined',
      timeout: 30000,
      retryAttempts: 3,
      ...options,
    }

    // Initialize SDK
    this.sdk = new JiraApi({
      accessToken: this.options.accessToken,
    })

    // Initialize resource namespaces
    this.issue = {
      create: this.issueCreate.bind(this),
      get: this.issueGet.bind(this),
      update: this.issueUpdate.bind(this),
      delete: this.issueDelete.bind(this),
      list: this.issueList.bind(this),
    }
    this.project = {
      create: this.projectCreate.bind(this),
      get: this.projectGet.bind(this),
      update: this.projectUpdate.bind(this),
      delete: this.projectDelete.bind(this),
      list: this.projectList.bind(this),
    }
    this.sprint = {
      create: this.sprintCreate.bind(this),
      get: this.sprintGet.bind(this),
      update: this.sprintUpdate.bind(this),
      delete: this.sprintDelete.bind(this),
      list: this.sprintList.bind(this),
    }
    this.board = {
      create: this.boardCreate.bind(this),
      get: this.boardGet.bind(this),
      delete: this.boardDelete.bind(this),
      list: this.boardList.bind(this),
    }
  }

  /**
   * undefined Issue
   * @param params - Operation parameters
   * @returns Issue
   */
  private async issueCreate(params: IssueCreateParams): Promise<Issue> {
    try {
      const result = await this.sdk.issues.POST(params)
      return result
    } catch (error) {
      throw JiraError.fromError(error)
    }
  }

  /**
   * undefined Issue
   * @param params - Operation parameters
   * @returns Issue
   */
  private async issueGet(params: IssueGetParams): Promise<Issue> {
    try {
      const result = await this.sdk.issues.GET(params)
      return result
    } catch (error) {
      throw JiraError.fromError(error)
    }
  }

  /**
   * undefined Issue
   * @param params - Operation parameters
   * @returns Issue
   */
  private async issueUpdate(params: IssueUpdateParams): Promise<Issue> {
    try {
      const result = await this.sdk.issues.PUT(params)
      return result
    } catch (error) {
      throw JiraError.fromError(error)
    }
  }

  /**
   * undefined Issue
   * @param params - Operation parameters
   * @returns boolean
   */
  private async issueDelete(params: IssueDeleteParams): Promise<boolean> {
    try {
      const result = await this.sdk.issues.DELETE(params)
      return result
    } catch (error) {
      throw JiraError.fromError(error)
    }
  }

  /**
   * undefined Issue
   * @param params - Operation parameters
   * @returns Issue[]
   */
  private async issueList(params: IssueListParams): Promise<Issue[]> {
    try {
      const result = await this.sdk.issues.GET(params)
      return result
    } catch (error) {
      throw JiraError.fromError(error)
    }
  }

  /**
   * undefined Project
   * @param params - Operation parameters
   * @returns Project
   */
  private async projectCreate(params: ProjectCreateParams): Promise<Project> {
    try {
      const result = await this.sdk.projects.POST(params)
      return result
    } catch (error) {
      throw JiraError.fromError(error)
    }
  }

  /**
   * undefined Project
   * @param params - Operation parameters
   * @returns Project
   */
  private async projectGet(params: ProjectGetParams): Promise<Project> {
    try {
      const result = await this.sdk.projects.GET(params)
      return result
    } catch (error) {
      throw JiraError.fromError(error)
    }
  }

  /**
   * undefined Project
   * @param params - Operation parameters
   * @returns Project
   */
  private async projectUpdate(params: ProjectUpdateParams): Promise<Project> {
    try {
      const result = await this.sdk.projects.PUT(params)
      return result
    } catch (error) {
      throw JiraError.fromError(error)
    }
  }

  /**
   * undefined Project
   * @param params - Operation parameters
   * @returns boolean
   */
  private async projectDelete(params: ProjectDeleteParams): Promise<boolean> {
    try {
      const result = await this.sdk.projects.DELETE(params)
      return result
    } catch (error) {
      throw JiraError.fromError(error)
    }
  }

  /**
   * undefined Project
   * @param params - Operation parameters
   * @returns Project[]
   */
  private async projectList(params: ProjectListParams): Promise<Project[]> {
    try {
      const result = await this.sdk.projects.GET(params)
      return result
    } catch (error) {
      throw JiraError.fromError(error)
    }
  }

  /**
   * undefined Sprint
   * @param params - Operation parameters
   * @returns Sprint
   */
  private async sprintCreate(params: SprintCreateParams): Promise<Sprint> {
    try {
      const result = await this.sdk.sprints.POST(params)
      return result
    } catch (error) {
      throw JiraError.fromError(error)
    }
  }

  /**
   * undefined Sprint
   * @param params - Operation parameters
   * @returns Sprint
   */
  private async sprintGet(params: SprintGetParams): Promise<Sprint> {
    try {
      const result = await this.sdk.sprints.GET(params)
      return result
    } catch (error) {
      throw JiraError.fromError(error)
    }
  }

  /**
   * undefined Sprint
   * @param params - Operation parameters
   * @returns Sprint
   */
  private async sprintUpdate(params: SprintUpdateParams): Promise<Sprint> {
    try {
      const result = await this.sdk.sprints.PUT(params)
      return result
    } catch (error) {
      throw JiraError.fromError(error)
    }
  }

  /**
   * undefined Sprint
   * @param params - Operation parameters
   * @returns boolean
   */
  private async sprintDelete(params: SprintDeleteParams): Promise<boolean> {
    try {
      const result = await this.sdk.sprints.DELETE(params)
      return result
    } catch (error) {
      throw JiraError.fromError(error)
    }
  }

  /**
   * undefined Sprint
   * @param params - Operation parameters
   * @returns Sprint[]
   */
  private async sprintList(params: SprintListParams): Promise<Sprint[]> {
    try {
      const result = await this.sdk.sprints.GET(params)
      return result
    } catch (error) {
      throw JiraError.fromError(error)
    }
  }

  /**
   * undefined Board
   * @param params - Operation parameters
   * @returns Board
   */
  private async boardCreate(params: BoardCreateParams): Promise<Board> {
    try {
      const result = await this.sdk.boards.POST(params)
      return result
    } catch (error) {
      throw JiraError.fromError(error)
    }
  }

  /**
   * undefined Board
   * @param params - Operation parameters
   * @returns Board
   */
  private async boardGet(params: BoardGetParams): Promise<Board> {
    try {
      const result = await this.sdk.boards.GET(params)
      return result
    } catch (error) {
      throw JiraError.fromError(error)
    }
  }

  /**
   * undefined Board
   * @param params - Operation parameters
   * @returns boolean
   */
  private async boardDelete(params: BoardDeleteParams): Promise<boolean> {
    try {
      const result = await this.sdk.boards.DELETE(params)
      return result
    } catch (error) {
      throw JiraError.fromError(error)
    }
  }

  /**
   * undefined Board
   * @param params - Operation parameters
   * @returns Board[]
   */
  private async boardList(params: BoardListParams): Promise<Board[]> {
    try {
      const result = await this.sdk.boards.GET(params)
      return result
    } catch (error) {
      throw JiraError.fromError(error)
    }
  }
}
