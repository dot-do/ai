/**
 * Notion Client
 *
 * Auto-generated Integration client for Notion.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/notion
 */

import Client from '@notionhq/client'
import {
  PageCreateParams,
  PageGetParams,
  PageUpdateParams,
  PageArchiveParams,
  PageListParams,
  PageSearchParams,
  DatabaseCreateParams,
  DatabaseGetParams,
  DatabaseUpdateParams,
  DatabaseQueryParams,
  DatabaseArchiveParams,
  BlockGetParams,
  BlockUpdateParams,
  BlockDeleteParams,
  BlockAppendParams,
  BlockGetChildrenParams,
  UserGetParams,
  UserListParams,
  CommentCreateParams,
  CommentListParams,
  SearchQueryParams,
} from './types.js'
import { NotionError } from './errors.js'

/**
 * Notion client options
 */
export interface NotionClientOptions {
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
 * Notion Client
 *
 * All-in-one workspace for notes, wikis, projects, and databases
 */
export class NotionClient {
  private options: NotionClientOptions
  private sdk: Client

  /**
   * Page resource
   * Notion pages with properties and content
   */
  public page: {
    /** undefined Page */
    create: (params: PageCreateParams) => Promise<Page>
    /** undefined Page */
    get: (params: PageGetParams) => Promise<Page>
    /** undefined Page */
    update: (params: PageUpdateParams) => Promise<Page>
    /** undefined Page */
    archive: (params: PageArchiveParams) => Promise<Page>
    /** undefined Page */
    list: (params: PageListParams) => Promise<PaginatedResponse<Page | PartialPage>>
    /** undefined Page */
    search: (params: PageSearchParams) => Promise<SearchResult>
  }

  /**
   * Database resource
   * Notion databases with schema and entries
   */
  public database: {
    /** undefined Database */
    create: (params: DatabaseCreateParams) => Promise<Database>
    /** undefined Database */
    get: (params: DatabaseGetParams) => Promise<Database>
    /** undefined Database */
    update: (params: DatabaseUpdateParams) => Promise<Database>
    /** undefined Database */
    query: (params: DatabaseQueryParams) => Promise<PaginatedResponse<Page | PartialPage>>
    /** undefined Database */
    archive: (params: DatabaseArchiveParams) => Promise<Database>
  }

  /**
   * Block resource
   * Content blocks within pages (paragraphs, headings, lists, etc.)
   */
  public block: {
    /** undefined Block */
    get: (params: BlockGetParams) => Promise<Block>
    /** undefined Block */
    update: (params: BlockUpdateParams) => Promise<Block>
    /** undefined Block */
    delete: (params: BlockDeleteParams) => Promise<Block>
    /** undefined Block */
    append: (params: BlockAppendParams) => Promise<PaginatedResponse<Block | PartialBlock>>
    /** undefined Block */
    getChildren: (params: BlockGetChildrenParams) => Promise<PaginatedResponse<Block | PartialBlock>>
  }

  /**
   * User resource
   * Users and bots in the workspace
   */
  public user: {
    /** undefined User */
    get: (params: UserGetParams) => Promise<User>
    /** undefined User */
    list: (params: UserListParams) => Promise<PaginatedResponse<User | PartialUser>>
    /** undefined User */
    getMe: () => Promise<User>
  }

  /**
   * Comment resource
   * Comments on pages and discussions
   */
  public comment: {
    /** undefined Comment */
    create: (params: CommentCreateParams) => Promise<Comment>
    /** undefined Comment */
    list: (params: CommentListParams) => Promise<PaginatedResponse<Comment>>
  }

  /**
   * Search resource
   * Universal search across pages and databases
   */
  public search: {
    /** undefined Search */
    query: (params: SearchQueryParams) => Promise<SearchResult>
  }

  constructor(options: NotionClientOptions) {
    this.options = {
      baseUrl: 'undefined',
      timeout: 30000,
      retryAttempts: 3,
      ...options,
    }

    // Initialize SDK
    this.sdk = new Client({
      accessToken: this.options.accessToken,
    })

    // Initialize resource namespaces
    this.page = {
      create: this.pageCreate.bind(this),
      get: this.pageGet.bind(this),
      update: this.pageUpdate.bind(this),
      archive: this.pageArchive.bind(this),
      list: this.pageList.bind(this),
      search: this.pageSearch.bind(this),
    }
    this.database = {
      create: this.databaseCreate.bind(this),
      get: this.databaseGet.bind(this),
      update: this.databaseUpdate.bind(this),
      query: this.databaseQuery.bind(this),
      archive: this.databaseArchive.bind(this),
    }
    this.block = {
      get: this.blockGet.bind(this),
      update: this.blockUpdate.bind(this),
      delete: this.blockDelete.bind(this),
      append: this.blockAppend.bind(this),
      getChildren: this.blockGetChildren.bind(this),
    }
    this.user = {
      get: this.userGet.bind(this),
      list: this.userList.bind(this),
      getMe: this.userGetMe.bind(this),
    }
    this.comment = {
      create: this.commentCreate.bind(this),
      list: this.commentList.bind(this),
    }
    this.search = {
      query: this.searchQuery.bind(this),
    }
  }

  /**
   * undefined Page
   * @param params - Operation parameters
   * @returns Page
   */
  private async pageCreate(params: PageCreateParams): Promise<Page> {
    try {
      const result = await this.sdk.pages.create(params)
      return result
    } catch (error) {
      throw NotionError.fromError(error)
    }
  }

  /**
   * undefined Page
   * @param params - Operation parameters
   * @returns Page
   */
  private async pageGet(params: PageGetParams): Promise<Page> {
    try {
      const result = await this.sdk.pages.retrieve(params)
      return result
    } catch (error) {
      throw NotionError.fromError(error)
    }
  }

  /**
   * undefined Page
   * @param params - Operation parameters
   * @returns Page
   */
  private async pageUpdate(params: PageUpdateParams): Promise<Page> {
    try {
      const result = await this.sdk.pages.update(params)
      return result
    } catch (error) {
      throw NotionError.fromError(error)
    }
  }

  /**
   * undefined Page
   * @param params - Operation parameters
   * @returns Page
   */
  private async pageArchive(params: PageArchiveParams): Promise<Page> {
    try {
      const result = await this.sdk.pages.update(params)
      return result
    } catch (error) {
      throw NotionError.fromError(error)
    }
  }

  /**
   * undefined Page
   * @param params - Operation parameters
   * @returns PaginatedResponse<Page | PartialPage>
   */
  private async pageList(params: PageListParams): Promise<PaginatedResponse<Page | PartialPage>> {
    try {
      const result = await this.sdk.pages.search(params)
      return result
    } catch (error) {
      throw NotionError.fromError(error)
    }
  }

  /**
   * undefined Page
   * @param params - Operation parameters
   * @returns SearchResult
   */
  private async pageSearch(params: PageSearchParams): Promise<SearchResult> {
    try {
      const result = await this.sdk.pages.search(params)
      return result
    } catch (error) {
      throw NotionError.fromError(error)
    }
  }

  /**
   * undefined Database
   * @param params - Operation parameters
   * @returns Database
   */
  private async databaseCreate(params: DatabaseCreateParams): Promise<Database> {
    try {
      const result = await this.sdk.databases.create(params)
      return result
    } catch (error) {
      throw NotionError.fromError(error)
    }
  }

  /**
   * undefined Database
   * @param params - Operation parameters
   * @returns Database
   */
  private async databaseGet(params: DatabaseGetParams): Promise<Database> {
    try {
      const result = await this.sdk.databases.retrieve(params)
      return result
    } catch (error) {
      throw NotionError.fromError(error)
    }
  }

  /**
   * undefined Database
   * @param params - Operation parameters
   * @returns Database
   */
  private async databaseUpdate(params: DatabaseUpdateParams): Promise<Database> {
    try {
      const result = await this.sdk.databases.update(params)
      return result
    } catch (error) {
      throw NotionError.fromError(error)
    }
  }

  /**
   * undefined Database
   * @param params - Operation parameters
   * @returns PaginatedResponse<Page | PartialPage>
   */
  private async databaseQuery(params: DatabaseQueryParams): Promise<PaginatedResponse<Page | PartialPage>> {
    try {
      const result = await this.sdk.databases.query(params)
      return result
    } catch (error) {
      throw NotionError.fromError(error)
    }
  }

  /**
   * undefined Database
   * @param params - Operation parameters
   * @returns Database
   */
  private async databaseArchive(params: DatabaseArchiveParams): Promise<Database> {
    try {
      const result = await this.sdk.databases.update(params)
      return result
    } catch (error) {
      throw NotionError.fromError(error)
    }
  }

  /**
   * undefined Block
   * @param params - Operation parameters
   * @returns Block
   */
  private async blockGet(params: BlockGetParams): Promise<Block> {
    try {
      const result = await this.sdk.blocks.retrieve(params)
      return result
    } catch (error) {
      throw NotionError.fromError(error)
    }
  }

  /**
   * undefined Block
   * @param params - Operation parameters
   * @returns Block
   */
  private async blockUpdate(params: BlockUpdateParams): Promise<Block> {
    try {
      const result = await this.sdk.blocks.update(params)
      return result
    } catch (error) {
      throw NotionError.fromError(error)
    }
  }

  /**
   * undefined Block
   * @param params - Operation parameters
   * @returns Block
   */
  private async blockDelete(params: BlockDeleteParams): Promise<Block> {
    try {
      const result = await this.sdk.blocks.delete(params)
      return result
    } catch (error) {
      throw NotionError.fromError(error)
    }
  }

  /**
   * undefined Block
   * @param params - Operation parameters
   * @returns PaginatedResponse<Block | PartialBlock>
   */
  private async blockAppend(params: BlockAppendParams): Promise<PaginatedResponse<Block | PartialBlock>> {
    try {
      const result = await this.sdk.blocks.children.append(params)
      return result
    } catch (error) {
      throw NotionError.fromError(error)
    }
  }

  /**
   * undefined Block
   * @param params - Operation parameters
   * @returns PaginatedResponse<Block | PartialBlock>
   */
  private async blockGetChildren(params: BlockGetChildrenParams): Promise<PaginatedResponse<Block | PartialBlock>> {
    try {
      const result = await this.sdk.blocks.children.list(params)
      return result
    } catch (error) {
      throw NotionError.fromError(error)
    }
  }

  /**
   * undefined User
   * @param params - Operation parameters
   * @returns User
   */
  private async userGet(params: UserGetParams): Promise<User> {
    try {
      const result = await this.sdk.users.retrieve(params)
      return result
    } catch (error) {
      throw NotionError.fromError(error)
    }
  }

  /**
   * undefined User
   * @param params - Operation parameters
   * @returns PaginatedResponse<User | PartialUser>
   */
  private async userList(params: UserListParams): Promise<PaginatedResponse<User | PartialUser>> {
    try {
      const result = await this.sdk.users.list(params)
      return result
    } catch (error) {
      throw NotionError.fromError(error)
    }
  }

  /**
   * undefined User
   * @returns User
   */
  private async userGetMe(): Promise<User> {
    try {
      const result = await this.sdk.users.me()
      return result
    } catch (error) {
      throw NotionError.fromError(error)
    }
  }

  /**
   * undefined Comment
   * @param params - Operation parameters
   * @returns Comment
   */
  private async commentCreate(params: CommentCreateParams): Promise<Comment> {
    try {
      const result = await this.sdk.comments.create(params)
      return result
    } catch (error) {
      throw NotionError.fromError(error)
    }
  }

  /**
   * undefined Comment
   * @param params - Operation parameters
   * @returns PaginatedResponse<Comment>
   */
  private async commentList(params: CommentListParams): Promise<PaginatedResponse<Comment>> {
    try {
      const result = await this.sdk.comments.list(params)
      return result
    } catch (error) {
      throw NotionError.fromError(error)
    }
  }

  /**
   * undefined Search
   * @param params - Operation parameters
   * @returns SearchResult
   */
  private async searchQuery(params: SearchQueryParams): Promise<SearchResult> {
    try {
      const result = await this.sdk.search.search(params)
      return result
    } catch (error) {
      throw NotionError.fromError(error)
    }
  }
}
