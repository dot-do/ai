/**
 * OneDrive Client
 *
 * Auto-generated Integration client for OneDrive.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/onedrive
 */

import Client from '@microsoft/microsoft-graph-client'
import {
  FileUploadParams,
  FileGetParams,
  FileDownloadParams,
  FileUpdateParams,
  FileDeleteParams,
  FileCopyParams,
  FileMoveParams,
  FolderCreateParams,
  FolderGetParams,
  FolderListParams,
  FolderDeleteParams,
  SharedLinkCreateParams,
  SharedLinkListParams,
  SharedLinkDeleteParams,
  SubscriptionCreateParams,
  SubscriptionGetParams,
  SubscriptionUpdateParams,
  SubscriptionDeleteParams,
} from './types.js'
import { OnedriveError } from './errors.js'

/**
 * OneDrive client options
 */
export interface OnedriveClientOptions {
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
 * OneDrive Client
 *
 * Microsoft cloud storage and file synchronization service
 */
export class OnedriveClient {
  private options: OnedriveClientOptions
  private sdk: Client

  /**
   * Drive resource
   * Access user drives
   */
  public drive: {
    /** undefined Drive */
    get: () => Promise<Drive>
    /** undefined Drive */
    list: () => Promise<Drive[]>
  }

  /**
   * File resource
   * Upload, download, and manage files
   */
  public file: {
    /** undefined File */
    upload: (params: FileUploadParams) => Promise<File>
    /** undefined File */
    get: (params: FileGetParams) => Promise<File>
    /** undefined File */
    download: (params: FileDownloadParams) => Promise<Buffer>
    /** undefined File */
    update: (params: FileUpdateParams) => Promise<File>
    /** undefined File */
    delete: (params: FileDeleteParams) => Promise<boolean>
    /** undefined File */
    copy: (params: FileCopyParams) => Promise<File>
    /** undefined File */
    move: (params: FileMoveParams) => Promise<File>
  }

  /**
   * Folder resource
   * Create and manage folders
   */
  public folder: {
    /** undefined Folder */
    create: (params: FolderCreateParams) => Promise<Folder>
    /** undefined Folder */
    get: (params: FolderGetParams) => Promise<Folder>
    /** undefined Folder */
    list: (params: FolderListParams) => Promise<array>
    /** undefined Folder */
    delete: (params: FolderDeleteParams) => Promise<boolean>
  }

  /**
   * SharedLink resource
   * Create and manage sharing permissions
   */
  public sharedLink: {
    /** undefined SharedLink */
    create: (params: SharedLinkCreateParams) => Promise<SharedLink>
    /** undefined SharedLink */
    list: (params: SharedLinkListParams) => Promise<SharedLink[]>
    /** undefined SharedLink */
    delete: (params: SharedLinkDeleteParams) => Promise<boolean>
  }

  /**
   * Subscription resource
   * Create and manage webhook subscriptions
   */
  public subscription: {
    /** undefined Subscription */
    create: (params: SubscriptionCreateParams) => Promise<Subscription>
    /** undefined Subscription */
    get: (params: SubscriptionGetParams) => Promise<Subscription>
    /** undefined Subscription */
    list: () => Promise<Subscription[]>
    /** undefined Subscription */
    update: (params: SubscriptionUpdateParams) => Promise<Subscription>
    /** undefined Subscription */
    delete: (params: SubscriptionDeleteParams) => Promise<boolean>
  }

  constructor(options: OnedriveClientOptions) {
    this.options = {
      baseUrl: 'https://graph.microsoft.com/v1.0',
      timeout: 30000,
      retryAttempts: 3,
      ...options,
    }

    // Initialize SDK
    this.sdk = new Client({
      accessToken: this.options.accessToken,
    })

    // Initialize resource namespaces
    this.drive = {
      get: this.driveGet.bind(this),
      list: this.driveList.bind(this),
    }
    this.file = {
      upload: this.fileUpload.bind(this),
      get: this.fileGet.bind(this),
      download: this.fileDownload.bind(this),
      update: this.fileUpdate.bind(this),
      delete: this.fileDelete.bind(this),
      copy: this.fileCopy.bind(this),
      move: this.fileMove.bind(this),
    }
    this.folder = {
      create: this.folderCreate.bind(this),
      get: this.folderGet.bind(this),
      list: this.folderList.bind(this),
      delete: this.folderDelete.bind(this),
    }
    this.sharedLink = {
      create: this.sharedLinkCreate.bind(this),
      list: this.sharedLinkList.bind(this),
      delete: this.sharedLinkDelete.bind(this),
    }
    this.subscription = {
      create: this.subscriptionCreate.bind(this),
      get: this.subscriptionGet.bind(this),
      list: this.subscriptionList.bind(this),
      update: this.subscriptionUpdate.bind(this),
      delete: this.subscriptionDelete.bind(this),
    }
  }

  /**
   * undefined Drive
   * @returns Drive
   */
  private async driveGet(): Promise<Drive> {
    try {
      const result = await this.sdk.drives.GET()
      return result
    } catch (error) {
      throw OnedriveError.fromError(error)
    }
  }

  /**
   * undefined Drive
   * @returns Drive[]
   */
  private async driveList(): Promise<Drive[]> {
    try {
      const result = await this.sdk.drives.GET()
      return result
    } catch (error) {
      throw OnedriveError.fromError(error)
    }
  }

  /**
   * undefined File
   * @param params - Operation parameters
   * @returns File
   */
  private async fileUpload(params: FileUploadParams): Promise<File> {
    try {
      const result = await this.sdk.files.PUT(params)
      return result
    } catch (error) {
      throw OnedriveError.fromError(error)
    }
  }

  /**
   * undefined File
   * @param params - Operation parameters
   * @returns File
   */
  private async fileGet(params: FileGetParams): Promise<File> {
    try {
      const result = await this.sdk.files.GET(params)
      return result
    } catch (error) {
      throw OnedriveError.fromError(error)
    }
  }

  /**
   * undefined File
   * @param params - Operation parameters
   * @returns Buffer
   */
  private async fileDownload(params: FileDownloadParams): Promise<Buffer> {
    try {
      const result = await this.sdk.files.GET(params)
      return result
    } catch (error) {
      throw OnedriveError.fromError(error)
    }
  }

  /**
   * undefined File
   * @param params - Operation parameters
   * @returns File
   */
  private async fileUpdate(params: FileUpdateParams): Promise<File> {
    try {
      const result = await this.sdk.files.PATCH(params)
      return result
    } catch (error) {
      throw OnedriveError.fromError(error)
    }
  }

  /**
   * undefined File
   * @param params - Operation parameters
   * @returns boolean
   */
  private async fileDelete(params: FileDeleteParams): Promise<boolean> {
    try {
      const result = await this.sdk.files.DELETE(params)
      return result
    } catch (error) {
      throw OnedriveError.fromError(error)
    }
  }

  /**
   * undefined File
   * @param params - Operation parameters
   * @returns File
   */
  private async fileCopy(params: FileCopyParams): Promise<File> {
    try {
      const result = await this.sdk.files.POST(params)
      return result
    } catch (error) {
      throw OnedriveError.fromError(error)
    }
  }

  /**
   * undefined File
   * @param params - Operation parameters
   * @returns File
   */
  private async fileMove(params: FileMoveParams): Promise<File> {
    try {
      const result = await this.sdk.files.PATCH(params)
      return result
    } catch (error) {
      throw OnedriveError.fromError(error)
    }
  }

  /**
   * undefined Folder
   * @param params - Operation parameters
   * @returns Folder
   */
  private async folderCreate(params: FolderCreateParams): Promise<Folder> {
    try {
      const result = await this.sdk.folders.POST(params)
      return result
    } catch (error) {
      throw OnedriveError.fromError(error)
    }
  }

  /**
   * undefined Folder
   * @param params - Operation parameters
   * @returns Folder
   */
  private async folderGet(params: FolderGetParams): Promise<Folder> {
    try {
      const result = await this.sdk.folders.GET(params)
      return result
    } catch (error) {
      throw OnedriveError.fromError(error)
    }
  }

  /**
   * undefined Folder
   * @param params - Operation parameters
   * @returns array
   */
  private async folderList(params: FolderListParams): Promise<array> {
    try {
      const result = await this.sdk.folders.GET(params)
      return result
    } catch (error) {
      throw OnedriveError.fromError(error)
    }
  }

  /**
   * undefined Folder
   * @param params - Operation parameters
   * @returns boolean
   */
  private async folderDelete(params: FolderDeleteParams): Promise<boolean> {
    try {
      const result = await this.sdk.folders.DELETE(params)
      return result
    } catch (error) {
      throw OnedriveError.fromError(error)
    }
  }

  /**
   * undefined SharedLink
   * @param params - Operation parameters
   * @returns SharedLink
   */
  private async sharedLinkCreate(params: SharedLinkCreateParams): Promise<SharedLink> {
    try {
      const result = await this.sdk.sharedLinks.POST(params)
      return result
    } catch (error) {
      throw OnedriveError.fromError(error)
    }
  }

  /**
   * undefined SharedLink
   * @param params - Operation parameters
   * @returns SharedLink[]
   */
  private async sharedLinkList(params: SharedLinkListParams): Promise<SharedLink[]> {
    try {
      const result = await this.sdk.sharedLinks.GET(params)
      return result
    } catch (error) {
      throw OnedriveError.fromError(error)
    }
  }

  /**
   * undefined SharedLink
   * @param params - Operation parameters
   * @returns boolean
   */
  private async sharedLinkDelete(params: SharedLinkDeleteParams): Promise<boolean> {
    try {
      const result = await this.sdk.sharedLinks.DELETE(params)
      return result
    } catch (error) {
      throw OnedriveError.fromError(error)
    }
  }

  /**
   * undefined Subscription
   * @param params - Operation parameters
   * @returns Subscription
   */
  private async subscriptionCreate(params: SubscriptionCreateParams): Promise<Subscription> {
    try {
      const result = await this.sdk.subscriptions.POST(params)
      return result
    } catch (error) {
      throw OnedriveError.fromError(error)
    }
  }

  /**
   * undefined Subscription
   * @param params - Operation parameters
   * @returns Subscription
   */
  private async subscriptionGet(params: SubscriptionGetParams): Promise<Subscription> {
    try {
      const result = await this.sdk.subscriptions.GET(params)
      return result
    } catch (error) {
      throw OnedriveError.fromError(error)
    }
  }

  /**
   * undefined Subscription
   * @returns Subscription[]
   */
  private async subscriptionList(): Promise<Subscription[]> {
    try {
      const result = await this.sdk.subscriptions.GET()
      return result
    } catch (error) {
      throw OnedriveError.fromError(error)
    }
  }

  /**
   * undefined Subscription
   * @param params - Operation parameters
   * @returns Subscription
   */
  private async subscriptionUpdate(params: SubscriptionUpdateParams): Promise<Subscription> {
    try {
      const result = await this.sdk.subscriptions.PATCH(params)
      return result
    } catch (error) {
      throw OnedriveError.fromError(error)
    }
  }

  /**
   * undefined Subscription
   * @param params - Operation parameters
   * @returns boolean
   */
  private async subscriptionDelete(params: SubscriptionDeleteParams): Promise<boolean> {
    try {
      const result = await this.sdk.subscriptions.DELETE(params)
      return result
    } catch (error) {
      throw OnedriveError.fromError(error)
    }
  }
}
