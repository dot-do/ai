/**
 * GitHub Client
 *
 * Auto-generated Integration client for GitHub.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/github
 */

import Octokit from '@octokit/rest'
import {
  RepositoryGetParams,
  RepositoryListParams,
  RepositoryCreateParams,
  RepositoryUpdateParams,
  RepositoryDeleteParams,
  IssueListParams,
  IssueGetParams,
  IssueCreateParams,
  IssueUpdateParams,
  IssueLockParams,
  IssueAddLabelsParams,
  PullRequestListParams,
  PullRequestGetParams,
  PullRequestCreateParams,
  PullRequestUpdateParams,
  PullRequestMergeParams,
  ContentGetParams,
  ContentCreateOrUpdateParams,
  ContentDeleteParams,
  BranchListParams,
  BranchGetParams,
  BranchCreateParams,
} from './types.js'
import { GithubError } from './errors.js'

/**
 * GitHub client options
 */
export interface GithubClientOptions {
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
 * GitHub Client
 *
 * Source control, collaboration, and development platform for software projects
 */
export class GithubClient {
  private options: GithubClientOptions
  private sdk: Octokit

  /**
   * Repository resource
   */
  public repository: {
    /** undefined Repository */
    get: (params: RepositoryGetParams) => Promise<Repository>
    /** undefined Repository */
    list: (params: RepositoryListParams) => Promise<Repository[]>
    /** undefined Repository */
    create: (params: RepositoryCreateParams) => Promise<Repository>
    /** undefined Repository */
    update: (params: RepositoryUpdateParams) => Promise<Repository>
    /** undefined Repository */
    delete: (params: RepositoryDeleteParams) => Promise<void>
  }

  /**
   * Issue resource
   */
  public issue: {
    /** undefined Issue */
    list: (params: IssueListParams) => Promise<Issue[]>
    /** undefined Issue */
    get: (params: IssueGetParams) => Promise<Issue>
    /** undefined Issue */
    create: (params: IssueCreateParams) => Promise<Issue>
    /** undefined Issue */
    update: (params: IssueUpdateParams) => Promise<Issue>
    /** undefined Issue */
    lock: (params: IssueLockParams) => Promise<void>
    /** undefined Issue */
    addLabels: (params: IssueAddLabelsParams) => Promise<Label[]>
  }

  /**
   * PullRequest resource
   */
  public pullRequest: {
    /** undefined PullRequest */
    list: (params: PullRequestListParams) => Promise<PullRequest[]>
    /** undefined PullRequest */
    get: (params: PullRequestGetParams) => Promise<PullRequest>
    /** undefined PullRequest */
    create: (params: PullRequestCreateParams) => Promise<PullRequest>
    /** undefined PullRequest */
    update: (params: PullRequestUpdateParams) => Promise<PullRequest>
    /** undefined PullRequest */
    merge: (params: PullRequestMergeParams) => Promise<MergeResult>
  }

  /**
   * Content resource
   */
  public content: {
    /** undefined Content */
    get: (params: ContentGetParams) => Promise<Content>
    /** undefined Content */
    createOrUpdate: (params: ContentCreateOrUpdateParams) => Promise<ContentOperation>
    /** undefined Content */
    delete: (params: ContentDeleteParams) => Promise<ContentOperation>
  }

  /**
   * Branch resource
   */
  public branch: {
    /** undefined Branch */
    list: (params: BranchListParams) => Promise<Branch[]>
    /** undefined Branch */
    get: (params: BranchGetParams) => Promise<Branch>
    /** undefined Branch */
    create: (params: BranchCreateParams) => Promise<Reference>
  }

  constructor(options: GithubClientOptions) {
    this.options = {
      baseUrl: 'undefined',
      timeout: 30000,
      retryAttempts: 3,
      ...options,
    }

    // Initialize SDK
    this.sdk = new Octokit(this.options.apiKey, {})

    // Initialize resource namespaces
    this.repository = {
      get: this.repositoryGet.bind(this),
      list: this.repositoryList.bind(this),
      create: this.repositoryCreate.bind(this),
      update: this.repositoryUpdate.bind(this),
      delete: this.repositoryDelete.bind(this),
    }
    this.issue = {
      list: this.issueList.bind(this),
      get: this.issueGet.bind(this),
      create: this.issueCreate.bind(this),
      update: this.issueUpdate.bind(this),
      lock: this.issueLock.bind(this),
      addLabels: this.issueAddLabels.bind(this),
    }
    this.pullRequest = {
      list: this.pullRequestList.bind(this),
      get: this.pullRequestGet.bind(this),
      create: this.pullRequestCreate.bind(this),
      update: this.pullRequestUpdate.bind(this),
      merge: this.pullRequestMerge.bind(this),
    }
    this.content = {
      get: this.contentGet.bind(this),
      createOrUpdate: this.contentCreateOrUpdate.bind(this),
      delete: this.contentDelete.bind(this),
    }
    this.branch = {
      list: this.branchList.bind(this),
      get: this.branchGet.bind(this),
      create: this.branchCreate.bind(this),
    }
  }

  /**
   * undefined Repository
   * @param params - Operation parameters
   * @returns Repository
   */
  private async repositoryGet(params: RepositoryGetParams): Promise<Repository> {
    try {
      const result = await this.sdk.repos.get(params)
      return result
    } catch (error) {
      throw GithubError.fromError(error)
    }
  }

  /**
   * undefined Repository
   * @param params - Operation parameters
   * @returns Repository[]
   */
  private async repositoryList(params: RepositoryListParams): Promise<Repository[]> {
    try {
      const result = await this.sdk.repos.listForAuthenticatedUser(params)
      return result
    } catch (error) {
      throw GithubError.fromError(error)
    }
  }

  /**
   * undefined Repository
   * @param params - Operation parameters
   * @returns Repository
   */
  private async repositoryCreate(params: RepositoryCreateParams): Promise<Repository> {
    try {
      const result = await this.sdk.repos.createForAuthenticatedUser(params)
      return result
    } catch (error) {
      throw GithubError.fromError(error)
    }
  }

  /**
   * undefined Repository
   * @param params - Operation parameters
   * @returns Repository
   */
  private async repositoryUpdate(params: RepositoryUpdateParams): Promise<Repository> {
    try {
      const result = await this.sdk.repos.update(params)
      return result
    } catch (error) {
      throw GithubError.fromError(error)
    }
  }

  /**
   * undefined Repository
   * @param params - Operation parameters
   * @returns void
   */
  private async repositoryDelete(params: RepositoryDeleteParams): Promise<void> {
    try {
      const result = await this.sdk.repos.delete(params)
      return result
    } catch (error) {
      throw GithubError.fromError(error)
    }
  }

  /**
   * undefined Issue
   * @param params - Operation parameters
   * @returns Issue[]
   */
  private async issueList(params: IssueListParams): Promise<Issue[]> {
    try {
      const result = await this.sdk.issues.listForRepo(params)
      return result
    } catch (error) {
      throw GithubError.fromError(error)
    }
  }

  /**
   * undefined Issue
   * @param params - Operation parameters
   * @returns Issue
   */
  private async issueGet(params: IssueGetParams): Promise<Issue> {
    try {
      const result = await this.sdk.issues.get(params)
      return result
    } catch (error) {
      throw GithubError.fromError(error)
    }
  }

  /**
   * undefined Issue
   * @param params - Operation parameters
   * @returns Issue
   */
  private async issueCreate(params: IssueCreateParams): Promise<Issue> {
    try {
      const result = await this.sdk.issues.create(params)
      return result
    } catch (error) {
      throw GithubError.fromError(error)
    }
  }

  /**
   * undefined Issue
   * @param params - Operation parameters
   * @returns Issue
   */
  private async issueUpdate(params: IssueUpdateParams): Promise<Issue> {
    try {
      const result = await this.sdk.issues.update(params)
      return result
    } catch (error) {
      throw GithubError.fromError(error)
    }
  }

  /**
   * undefined Issue
   * @param params - Operation parameters
   * @returns void
   */
  private async issueLock(params: IssueLockParams): Promise<void> {
    try {
      const result = await this.sdk.issues.lock(params)
      return result
    } catch (error) {
      throw GithubError.fromError(error)
    }
  }

  /**
   * undefined Issue
   * @param params - Operation parameters
   * @returns Label[]
   */
  private async issueAddLabels(params: IssueAddLabelsParams): Promise<Label[]> {
    try {
      const result = await this.sdk.issues.addLabels(params)
      return result
    } catch (error) {
      throw GithubError.fromError(error)
    }
  }

  /**
   * undefined PullRequest
   * @param params - Operation parameters
   * @returns PullRequest[]
   */
  private async pullRequestList(params: PullRequestListParams): Promise<PullRequest[]> {
    try {
      const result = await this.sdk.pulls.list(params)
      return result
    } catch (error) {
      throw GithubError.fromError(error)
    }
  }

  /**
   * undefined PullRequest
   * @param params - Operation parameters
   * @returns PullRequest
   */
  private async pullRequestGet(params: PullRequestGetParams): Promise<PullRequest> {
    try {
      const result = await this.sdk.pulls.get(params)
      return result
    } catch (error) {
      throw GithubError.fromError(error)
    }
  }

  /**
   * undefined PullRequest
   * @param params - Operation parameters
   * @returns PullRequest
   */
  private async pullRequestCreate(params: PullRequestCreateParams): Promise<PullRequest> {
    try {
      const result = await this.sdk.pulls.create(params)
      return result
    } catch (error) {
      throw GithubError.fromError(error)
    }
  }

  /**
   * undefined PullRequest
   * @param params - Operation parameters
   * @returns PullRequest
   */
  private async pullRequestUpdate(params: PullRequestUpdateParams): Promise<PullRequest> {
    try {
      const result = await this.sdk.pulls.update(params)
      return result
    } catch (error) {
      throw GithubError.fromError(error)
    }
  }

  /**
   * undefined PullRequest
   * @param params - Operation parameters
   * @returns MergeResult
   */
  private async pullRequestMerge(params: PullRequestMergeParams): Promise<MergeResult> {
    try {
      const result = await this.sdk.pulls.merge(params)
      return result
    } catch (error) {
      throw GithubError.fromError(error)
    }
  }

  /**
   * undefined Content
   * @param params - Operation parameters
   * @returns Content
   */
  private async contentGet(params: ContentGetParams): Promise<Content> {
    try {
      const result = await this.sdk.repos.getContent(params)
      return result
    } catch (error) {
      throw GithubError.fromError(error)
    }
  }

  /**
   * undefined Content
   * @param params - Operation parameters
   * @returns ContentOperation
   */
  private async contentCreateOrUpdate(params: ContentCreateOrUpdateParams): Promise<ContentOperation> {
    try {
      const result = await this.sdk.repos.createOrUpdateFileContents(params)
      return result
    } catch (error) {
      throw GithubError.fromError(error)
    }
  }

  /**
   * undefined Content
   * @param params - Operation parameters
   * @returns ContentOperation
   */
  private async contentDelete(params: ContentDeleteParams): Promise<ContentOperation> {
    try {
      const result = await this.sdk.repos.deleteFile(params)
      return result
    } catch (error) {
      throw GithubError.fromError(error)
    }
  }

  /**
   * undefined Branch
   * @param params - Operation parameters
   * @returns Branch[]
   */
  private async branchList(params: BranchListParams): Promise<Branch[]> {
    try {
      const result = await this.sdk.repos.listBranches(params)
      return result
    } catch (error) {
      throw GithubError.fromError(error)
    }
  }

  /**
   * undefined Branch
   * @param params - Operation parameters
   * @returns Branch
   */
  private async branchGet(params: BranchGetParams): Promise<Branch> {
    try {
      const result = await this.sdk.repos.getBranch(params)
      return result
    } catch (error) {
      throw GithubError.fromError(error)
    }
  }

  /**
   * undefined Branch
   * @param params - Operation parameters
   * @returns Reference
   */
  private async branchCreate(params: BranchCreateParams): Promise<Reference> {
    try {
      const result = await this.sdk.repos.git.createRef(params)
      return result
    } catch (error) {
      throw GithubError.fromError(error)
    }
  }
}
