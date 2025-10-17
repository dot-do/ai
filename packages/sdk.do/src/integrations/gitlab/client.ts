/**
 * GitLab Client
 *
 * Auto-generated Integration client for GitLab.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/gitlab
 */

import Gitlab from '@gitbeaker/rest'
import {
  ProjectCreateParams,
  ProjectGetParams,
  ProjectUpdateParams,
  ProjectDeleteParams,
  ProjectListParams,
  IssueCreateParams,
  IssueGetParams,
  IssueUpdateParams,
  IssueListParams,
  MergeRequestCreateParams,
  MergeRequestGetParams,
  MergeRequestUpdateParams,
  MergeRequestMergeParams,
  MergeRequestListParams,
  PipelineCreateParams,
  PipelineGetParams,
  PipelineCancelParams,
  PipelineRetryParams,
  PipelineListParams,
} from './types.js'
import { GitlabError } from './errors.js'

/**
 * GitLab client options
 */
export interface GitlabClientOptions {
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
 * GitLab Client
 *
 * DevSecOps platform for repository management and CI/CD
 */
export class GitlabClient {
  private options: GitlabClientOptions
  private sdk: Gitlab

  /**
   * Project resource
   * Repository and project management
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
   * Issue resource
   * Project issue tracking
   */
  public issue: {
    /** undefined Issue */
    create: (params: IssueCreateParams) => Promise<Issue>
    /** undefined Issue */
    get: (params: IssueGetParams) => Promise<Issue>
    /** undefined Issue */
    update: (params: IssueUpdateParams) => Promise<Issue>
    /** undefined Issue */
    list: (params: IssueListParams) => Promise<Issue[]>
  }

  /**
   * MergeRequest resource
   * Code review and merge requests
   */
  public mergeRequest: {
    /** undefined MergeRequest */
    create: (params: MergeRequestCreateParams) => Promise<MergeRequest>
    /** undefined MergeRequest */
    get: (params: MergeRequestGetParams) => Promise<MergeRequest>
    /** undefined MergeRequest */
    update: (params: MergeRequestUpdateParams) => Promise<MergeRequest>
    /** undefined MergeRequest */
    merge: (params: MergeRequestMergeParams) => Promise<MergeRequest>
    /** undefined MergeRequest */
    list: (params: MergeRequestListParams) => Promise<MergeRequest[]>
  }

  /**
   * Pipeline resource
   * CI/CD pipeline management
   */
  public pipeline: {
    /** undefined Pipeline */
    create: (params: PipelineCreateParams) => Promise<Pipeline>
    /** undefined Pipeline */
    get: (params: PipelineGetParams) => Promise<Pipeline>
    /** undefined Pipeline */
    cancel: (params: PipelineCancelParams) => Promise<Pipeline>
    /** undefined Pipeline */
    retry: (params: PipelineRetryParams) => Promise<Pipeline>
    /** undefined Pipeline */
    list: (params: PipelineListParams) => Promise<Pipeline[]>
  }

  constructor(options: GitlabClientOptions) {
    this.options = {
      baseUrl: 'undefined',
      timeout: 30000,
      retryAttempts: 3,
      ...options,
    }

    // Initialize SDK
    this.sdk = new Gitlab({
      accessToken: this.options.accessToken,
    })

    // Initialize resource namespaces
    this.project = {
      create: this.projectCreate.bind(this),
      get: this.projectGet.bind(this),
      update: this.projectUpdate.bind(this),
      delete: this.projectDelete.bind(this),
      list: this.projectList.bind(this),
    }
    this.issue = {
      create: this.issueCreate.bind(this),
      get: this.issueGet.bind(this),
      update: this.issueUpdate.bind(this),
      list: this.issueList.bind(this),
    }
    this.mergeRequest = {
      create: this.mergeRequestCreate.bind(this),
      get: this.mergeRequestGet.bind(this),
      update: this.mergeRequestUpdate.bind(this),
      merge: this.mergeRequestMerge.bind(this),
      list: this.mergeRequestList.bind(this),
    }
    this.pipeline = {
      create: this.pipelineCreate.bind(this),
      get: this.pipelineGet.bind(this),
      cancel: this.pipelineCancel.bind(this),
      retry: this.pipelineRetry.bind(this),
      list: this.pipelineList.bind(this),
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
      throw GitlabError.fromError(error)
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
      throw GitlabError.fromError(error)
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
      throw GitlabError.fromError(error)
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
      throw GitlabError.fromError(error)
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
      throw GitlabError.fromError(error)
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
      throw GitlabError.fromError(error)
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
      throw GitlabError.fromError(error)
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
      throw GitlabError.fromError(error)
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
      throw GitlabError.fromError(error)
    }
  }

  /**
   * undefined MergeRequest
   * @param params - Operation parameters
   * @returns MergeRequest
   */
  private async mergeRequestCreate(params: MergeRequestCreateParams): Promise<MergeRequest> {
    try {
      const result = await this.sdk.mergeRequests.POST(params)
      return result
    } catch (error) {
      throw GitlabError.fromError(error)
    }
  }

  /**
   * undefined MergeRequest
   * @param params - Operation parameters
   * @returns MergeRequest
   */
  private async mergeRequestGet(params: MergeRequestGetParams): Promise<MergeRequest> {
    try {
      const result = await this.sdk.mergeRequests.GET(params)
      return result
    } catch (error) {
      throw GitlabError.fromError(error)
    }
  }

  /**
   * undefined MergeRequest
   * @param params - Operation parameters
   * @returns MergeRequest
   */
  private async mergeRequestUpdate(params: MergeRequestUpdateParams): Promise<MergeRequest> {
    try {
      const result = await this.sdk.mergeRequests.PUT(params)
      return result
    } catch (error) {
      throw GitlabError.fromError(error)
    }
  }

  /**
   * undefined MergeRequest
   * @param params - Operation parameters
   * @returns MergeRequest
   */
  private async mergeRequestMerge(params: MergeRequestMergeParams): Promise<MergeRequest> {
    try {
      const result = await this.sdk.mergeRequests.PUT(params)
      return result
    } catch (error) {
      throw GitlabError.fromError(error)
    }
  }

  /**
   * undefined MergeRequest
   * @param params - Operation parameters
   * @returns MergeRequest[]
   */
  private async mergeRequestList(params: MergeRequestListParams): Promise<MergeRequest[]> {
    try {
      const result = await this.sdk.mergeRequests.GET(params)
      return result
    } catch (error) {
      throw GitlabError.fromError(error)
    }
  }

  /**
   * undefined Pipeline
   * @param params - Operation parameters
   * @returns Pipeline
   */
  private async pipelineCreate(params: PipelineCreateParams): Promise<Pipeline> {
    try {
      const result = await this.sdk.pipelines.POST(params)
      return result
    } catch (error) {
      throw GitlabError.fromError(error)
    }
  }

  /**
   * undefined Pipeline
   * @param params - Operation parameters
   * @returns Pipeline
   */
  private async pipelineGet(params: PipelineGetParams): Promise<Pipeline> {
    try {
      const result = await this.sdk.pipelines.GET(params)
      return result
    } catch (error) {
      throw GitlabError.fromError(error)
    }
  }

  /**
   * undefined Pipeline
   * @param params - Operation parameters
   * @returns Pipeline
   */
  private async pipelineCancel(params: PipelineCancelParams): Promise<Pipeline> {
    try {
      const result = await this.sdk.pipelines.POST(params)
      return result
    } catch (error) {
      throw GitlabError.fromError(error)
    }
  }

  /**
   * undefined Pipeline
   * @param params - Operation parameters
   * @returns Pipeline
   */
  private async pipelineRetry(params: PipelineRetryParams): Promise<Pipeline> {
    try {
      const result = await this.sdk.pipelines.POST(params)
      return result
    } catch (error) {
      throw GitlabError.fromError(error)
    }
  }

  /**
   * undefined Pipeline
   * @param params - Operation parameters
   * @returns Pipeline[]
   */
  private async pipelineList(params: PipelineListParams): Promise<Pipeline[]> {
    try {
      const result = await this.sdk.pipelines.GET(params)
      return result
    } catch (error) {
      throw GitlabError.fromError(error)
    }
  }
}
