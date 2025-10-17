/**
 * Bitbucket Client
 *
 * Auto-generated Integration client for Bitbucket.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/bitbucket
 */

import {
  RepositoryCreateParams,
  RepositoryGetParams,
  RepositoryUpdateParams,
  RepositoryDeleteParams,
  RepositoryListParams,
  PullRequestCreateParams,
  PullRequestGetParams,
  PullRequestUpdateParams,
  PullRequestMergeParams,
  PullRequestListParams,
  IssueCreateParams,
  IssueGetParams,
  IssueUpdateParams,
  IssueListParams,
  PipelineCreateParams,
  PipelineGetParams,
  PipelineStopParams,
  PipelineListParams,
} from './types.js'
import { BitbucketError } from './errors.js'

/**
 * Bitbucket client options
 */
export interface BitbucketClientOptions {
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
 * Bitbucket Client
 *
 * Git hosting and CI/CD pipelines for teams
 */
export class BitbucketClient {
  private options: BitbucketClientOptions

  /**
   * Repository resource
   * Git repository management
   */
  public repository: {
    /** undefined Repository */
    create: (params: RepositoryCreateParams) => Promise<Repository>
    /** undefined Repository */
    get: (params: RepositoryGetParams) => Promise<Repository>
    /** undefined Repository */
    update: (params: RepositoryUpdateParams) => Promise<Repository>
    /** undefined Repository */
    delete: (params: RepositoryDeleteParams) => Promise<boolean>
    /** undefined Repository */
    list: (params: RepositoryListParams) => Promise<Repository[]>
  }

  /**
   * PullRequest resource
   * Code review and pull requests
   */
  public pullRequest: {
    /** undefined PullRequest */
    create: (params: PullRequestCreateParams) => Promise<PullRequest>
    /** undefined PullRequest */
    get: (params: PullRequestGetParams) => Promise<PullRequest>
    /** undefined PullRequest */
    update: (params: PullRequestUpdateParams) => Promise<PullRequest>
    /** undefined PullRequest */
    merge: (params: PullRequestMergeParams) => Promise<PullRequest>
    /** undefined PullRequest */
    list: (params: PullRequestListParams) => Promise<PullRequest[]>
  }

  /**
   * Issue resource
   * Issue tracking
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
   * Pipeline resource
   * CI/CD pipeline management
   */
  public pipeline: {
    /** undefined Pipeline */
    create: (params: PipelineCreateParams) => Promise<Pipeline>
    /** undefined Pipeline */
    get: (params: PipelineGetParams) => Promise<Pipeline>
    /** undefined Pipeline */
    stop: (params: PipelineStopParams) => Promise<Pipeline>
    /** undefined Pipeline */
    list: (params: PipelineListParams) => Promise<Pipeline[]>
  }

  constructor(options: BitbucketClientOptions) {
    this.options = {
      baseUrl: 'https://api.bitbucket.org/2.0',
      timeout: 30000,
      retryAttempts: 3,
      ...options,
    }

    // Initialize resource namespaces
    this.repository = {
      create: this.repositoryCreate.bind(this),
      get: this.repositoryGet.bind(this),
      update: this.repositoryUpdate.bind(this),
      delete: this.repositoryDelete.bind(this),
      list: this.repositoryList.bind(this),
    }
    this.pullRequest = {
      create: this.pullRequestCreate.bind(this),
      get: this.pullRequestGet.bind(this),
      update: this.pullRequestUpdate.bind(this),
      merge: this.pullRequestMerge.bind(this),
      list: this.pullRequestList.bind(this),
    }
    this.issue = {
      create: this.issueCreate.bind(this),
      get: this.issueGet.bind(this),
      update: this.issueUpdate.bind(this),
      list: this.issueList.bind(this),
    }
    this.pipeline = {
      create: this.pipelineCreate.bind(this),
      get: this.pipelineGet.bind(this),
      stop: this.pipelineStop.bind(this),
      list: this.pipelineList.bind(this),
    }
  }

  /**
   * undefined Repository
   * @param params - Operation parameters
   * @returns Repository
   */
  private async repositoryCreate(params: RepositoryCreateParams): Promise<Repository> {
    try {
      const response = await this.request('POST', '/repositories/${params.workspace}/${params.repo_slug}', params)
      return response as Repository
    } catch (error) {
      throw BitbucketError.fromError(error)
    }
  }

  /**
   * undefined Repository
   * @param params - Operation parameters
   * @returns Repository
   */
  private async repositoryGet(params: RepositoryGetParams): Promise<Repository> {
    try {
      const response = await this.request('GET', '/repositories/${params.workspace}/${params.repo_slug}', params)
      return response as Repository
    } catch (error) {
      throw BitbucketError.fromError(error)
    }
  }

  /**
   * undefined Repository
   * @param params - Operation parameters
   * @returns Repository
   */
  private async repositoryUpdate(params: RepositoryUpdateParams): Promise<Repository> {
    try {
      const response = await this.request('PUT', '/repositories/${params.workspace}/${params.repo_slug}', params)
      return response as Repository
    } catch (error) {
      throw BitbucketError.fromError(error)
    }
  }

  /**
   * undefined Repository
   * @param params - Operation parameters
   * @returns boolean
   */
  private async repositoryDelete(params: RepositoryDeleteParams): Promise<boolean> {
    try {
      const response = await this.request('DELETE', '/repositories/${params.workspace}/${params.repo_slug}', params)
      return response as boolean
    } catch (error) {
      throw BitbucketError.fromError(error)
    }
  }

  /**
   * undefined Repository
   * @param params - Operation parameters
   * @returns Repository[]
   */
  private async repositoryList(params: RepositoryListParams): Promise<Repository[]> {
    try {
      const response = await this.request('GET', '/repositories/${params.workspace}', params)
      return response as Repository[]
    } catch (error) {
      throw BitbucketError.fromError(error)
    }
  }

  /**
   * undefined PullRequest
   * @param params - Operation parameters
   * @returns PullRequest
   */
  private async pullRequestCreate(params: PullRequestCreateParams): Promise<PullRequest> {
    try {
      const response = await this.request('POST', '/repositories/${params.workspace}/${params.repo_slug}/pullrequests', params)
      return response as PullRequest
    } catch (error) {
      throw BitbucketError.fromError(error)
    }
  }

  /**
   * undefined PullRequest
   * @param params - Operation parameters
   * @returns PullRequest
   */
  private async pullRequestGet(params: PullRequestGetParams): Promise<PullRequest> {
    try {
      const response = await this.request('GET', '/repositories/${params.workspace}/${params.repo_slug}/pullrequests/${params.pull_request_id}', params)
      return response as PullRequest
    } catch (error) {
      throw BitbucketError.fromError(error)
    }
  }

  /**
   * undefined PullRequest
   * @param params - Operation parameters
   * @returns PullRequest
   */
  private async pullRequestUpdate(params: PullRequestUpdateParams): Promise<PullRequest> {
    try {
      const response = await this.request('PUT', '/repositories/${params.workspace}/${params.repo_slug}/pullrequests/${params.pull_request_id}', params)
      return response as PullRequest
    } catch (error) {
      throw BitbucketError.fromError(error)
    }
  }

  /**
   * undefined PullRequest
   * @param params - Operation parameters
   * @returns PullRequest
   */
  private async pullRequestMerge(params: PullRequestMergeParams): Promise<PullRequest> {
    try {
      const response = await this.request('POST', '/repositories/${params.workspace}/${params.repo_slug}/pullrequests/${params.pull_request_id}/merge', params)
      return response as PullRequest
    } catch (error) {
      throw BitbucketError.fromError(error)
    }
  }

  /**
   * undefined PullRequest
   * @param params - Operation parameters
   * @returns PullRequest[]
   */
  private async pullRequestList(params: PullRequestListParams): Promise<PullRequest[]> {
    try {
      const response = await this.request('GET', '/repositories/${params.workspace}/${params.repo_slug}/pullrequests', params)
      return response as PullRequest[]
    } catch (error) {
      throw BitbucketError.fromError(error)
    }
  }

  /**
   * undefined Issue
   * @param params - Operation parameters
   * @returns Issue
   */
  private async issueCreate(params: IssueCreateParams): Promise<Issue> {
    try {
      const response = await this.request('POST', '/repositories/${params.workspace}/${params.repo_slug}/issues', params)
      return response as Issue
    } catch (error) {
      throw BitbucketError.fromError(error)
    }
  }

  /**
   * undefined Issue
   * @param params - Operation parameters
   * @returns Issue
   */
  private async issueGet(params: IssueGetParams): Promise<Issue> {
    try {
      const response = await this.request('GET', '/repositories/${params.workspace}/${params.repo_slug}/issues/${params.issue_id}', params)
      return response as Issue
    } catch (error) {
      throw BitbucketError.fromError(error)
    }
  }

  /**
   * undefined Issue
   * @param params - Operation parameters
   * @returns Issue
   */
  private async issueUpdate(params: IssueUpdateParams): Promise<Issue> {
    try {
      const response = await this.request('PUT', '/repositories/${params.workspace}/${params.repo_slug}/issues/${params.issue_id}', params)
      return response as Issue
    } catch (error) {
      throw BitbucketError.fromError(error)
    }
  }

  /**
   * undefined Issue
   * @param params - Operation parameters
   * @returns Issue[]
   */
  private async issueList(params: IssueListParams): Promise<Issue[]> {
    try {
      const response = await this.request('GET', '/repositories/${params.workspace}/${params.repo_slug}/issues', params)
      return response as Issue[]
    } catch (error) {
      throw BitbucketError.fromError(error)
    }
  }

  /**
   * undefined Pipeline
   * @param params - Operation parameters
   * @returns Pipeline
   */
  private async pipelineCreate(params: PipelineCreateParams): Promise<Pipeline> {
    try {
      const response = await this.request('POST', '/repositories/${params.workspace}/${params.repo_slug}/pipelines/', params)
      return response as Pipeline
    } catch (error) {
      throw BitbucketError.fromError(error)
    }
  }

  /**
   * undefined Pipeline
   * @param params - Operation parameters
   * @returns Pipeline
   */
  private async pipelineGet(params: PipelineGetParams): Promise<Pipeline> {
    try {
      const response = await this.request('GET', '/repositories/${params.workspace}/${params.repo_slug}/pipelines/${params.pipeline_uuid}', params)
      return response as Pipeline
    } catch (error) {
      throw BitbucketError.fromError(error)
    }
  }

  /**
   * undefined Pipeline
   * @param params - Operation parameters
   * @returns Pipeline
   */
  private async pipelineStop(params: PipelineStopParams): Promise<Pipeline> {
    try {
      const response = await this.request(
        'POST',
        '/repositories/${params.workspace}/${params.repo_slug}/pipelines/${params.pipeline_uuid}/stopPipeline',
        params
      )
      return response as Pipeline
    } catch (error) {
      throw BitbucketError.fromError(error)
    }
  }

  /**
   * undefined Pipeline
   * @param params - Operation parameters
   * @returns Pipeline[]
   */
  private async pipelineList(params: PipelineListParams): Promise<Pipeline[]> {
    try {
      const response = await this.request('GET', '/repositories/${params.workspace}/${params.repo_slug}/pipelines/', params)
      return response as Pipeline[]
    } catch (error) {
      throw BitbucketError.fromError(error)
    }
  }

  /**
   * Make HTTP request
   * @param method - HTTP method
   * @param path - Request path
   * @param data - Request data
   * @returns Response data
   */
  private async request(method: string, path: string, data?: any): Promise<any> {
    const url = `${this.options.baseUrl}${path}`
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.options.accessToken,
    }

    const config: RequestInit = {
      method,
      headers,
      signal: AbortSignal.timeout(this.options.timeout || 30000),
    }

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      config.body = JSON.stringify(data)
    }

    const response = await fetch(url, config)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return response.json()
  }
}
