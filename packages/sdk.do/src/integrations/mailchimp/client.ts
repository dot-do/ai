/**
 * Mailchimp Client
 *
 * Auto-generated Integration client for Mailchimp.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/mailchimp
 */

import Mailchimp from '@mailchimp/mailchimp_marketing'
import {
  CampaignCreateParams,
  CampaignGetParams,
  CampaignUpdateParams,
  CampaignDeleteParams,
  CampaignListParams,
  ListCreateParams,
  ListGetParams,
  ListUpdateParams,
  ListDeleteParams,
  ListListParams,
  MemberCreateParams,
  MemberGetParams,
  MemberUpdateParams,
  MemberDeleteParams,
  MemberListParams,
  TemplateCreateParams,
  TemplateGetParams,
  TemplateUpdateParams,
  TemplateDeleteParams,
  TemplateListParams,
} from './types.js'
import { MailchimpError } from './errors.js'

/**
 * Mailchimp client options
 */
export interface MailchimpClientOptions {
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
 * Mailchimp Client
 *
 * Email marketing platform for campaigns and audience management
 */
export class MailchimpClient {
  private options: MailchimpClientOptions
  private sdk: Mailchimp

  /**
   * Campaign resource
   * Create and manage email campaigns
   */
  public campaign: {
    /** undefined Campaign */
    create: (params: CampaignCreateParams) => Promise<Campaign>
    /** undefined Campaign */
    get: (params: CampaignGetParams) => Promise<Campaign>
    /** undefined Campaign */
    update: (params: CampaignUpdateParams) => Promise<Campaign>
    /** undefined Campaign */
    delete: (params: CampaignDeleteParams) => Promise<boolean>
    /** undefined Campaign */
    list: (params: CampaignListParams) => Promise<Campaign[]>
  }

  /**
   * List resource
   * Manage audience lists
   */
  public list: {
    /** undefined List */
    create: (params: ListCreateParams) => Promise<List>
    /** undefined List */
    get: (params: ListGetParams) => Promise<List>
    /** undefined List */
    update: (params: ListUpdateParams) => Promise<List>
    /** undefined List */
    delete: (params: ListDeleteParams) => Promise<boolean>
    /** undefined List */
    list: (params: ListListParams) => Promise<List[]>
  }

  /**
   * Member resource
   * Manage list members (subscribers)
   */
  public member: {
    /** undefined Member */
    create: (params: MemberCreateParams) => Promise<Member>
    /** undefined Member */
    get: (params: MemberGetParams) => Promise<Member>
    /** undefined Member */
    update: (params: MemberUpdateParams) => Promise<Member>
    /** undefined Member */
    delete: (params: MemberDeleteParams) => Promise<boolean>
    /** undefined Member */
    list: (params: MemberListParams) => Promise<Member[]>
  }

  /**
   * Template resource
   * Manage email templates
   */
  public template: {
    /** undefined Template */
    create: (params: TemplateCreateParams) => Promise<Template>
    /** undefined Template */
    get: (params: TemplateGetParams) => Promise<Template>
    /** undefined Template */
    update: (params: TemplateUpdateParams) => Promise<Template>
    /** undefined Template */
    delete: (params: TemplateDeleteParams) => Promise<boolean>
    /** undefined Template */
    list: (params: TemplateListParams) => Promise<Template[]>
  }

  constructor(options: MailchimpClientOptions) {
    this.options = {
      baseUrl: 'undefined',
      timeout: 30000,
      retryAttempts: 3,
      ...options,
    }

    // Initialize SDK
    this.sdk = new Mailchimp(this.options.apiKey, {})

    // Initialize resource namespaces
    this.campaign = {
      create: this.campaignCreate.bind(this),
      get: this.campaignGet.bind(this),
      update: this.campaignUpdate.bind(this),
      delete: this.campaignDelete.bind(this),
      list: this.campaignList.bind(this),
    }
    this.list = {
      create: this.listCreate.bind(this),
      get: this.listGet.bind(this),
      update: this.listUpdate.bind(this),
      delete: this.listDelete.bind(this),
      list: this.listList.bind(this),
    }
    this.member = {
      create: this.memberCreate.bind(this),
      get: this.memberGet.bind(this),
      update: this.memberUpdate.bind(this),
      delete: this.memberDelete.bind(this),
      list: this.memberList.bind(this),
    }
    this.template = {
      create: this.templateCreate.bind(this),
      get: this.templateGet.bind(this),
      update: this.templateUpdate.bind(this),
      delete: this.templateDelete.bind(this),
      list: this.templateList.bind(this),
    }
  }

  /**
   * undefined Campaign
   * @param params - Operation parameters
   * @returns Campaign
   */
  private async campaignCreate(params: CampaignCreateParams): Promise<Campaign> {
    try {
      const result = await this.sdk.campaigns.POST(params)
      return result
    } catch (error) {
      throw MailchimpError.fromError(error)
    }
  }

  /**
   * undefined Campaign
   * @param params - Operation parameters
   * @returns Campaign
   */
  private async campaignGet(params: CampaignGetParams): Promise<Campaign> {
    try {
      const result = await this.sdk.campaigns.GET(params)
      return result
    } catch (error) {
      throw MailchimpError.fromError(error)
    }
  }

  /**
   * undefined Campaign
   * @param params - Operation parameters
   * @returns Campaign
   */
  private async campaignUpdate(params: CampaignUpdateParams): Promise<Campaign> {
    try {
      const result = await this.sdk.campaigns.PATCH(params)
      return result
    } catch (error) {
      throw MailchimpError.fromError(error)
    }
  }

  /**
   * undefined Campaign
   * @param params - Operation parameters
   * @returns boolean
   */
  private async campaignDelete(params: CampaignDeleteParams): Promise<boolean> {
    try {
      const result = await this.sdk.campaigns.DELETE(params)
      return result
    } catch (error) {
      throw MailchimpError.fromError(error)
    }
  }

  /**
   * undefined Campaign
   * @param params - Operation parameters
   * @returns Campaign[]
   */
  private async campaignList(params: CampaignListParams): Promise<Campaign[]> {
    try {
      const result = await this.sdk.campaigns.GET(params)
      return result
    } catch (error) {
      throw MailchimpError.fromError(error)
    }
  }

  /**
   * undefined List
   * @param params - Operation parameters
   * @returns List
   */
  private async listCreate(params: ListCreateParams): Promise<List> {
    try {
      const result = await this.sdk.lists.POST(params)
      return result
    } catch (error) {
      throw MailchimpError.fromError(error)
    }
  }

  /**
   * undefined List
   * @param params - Operation parameters
   * @returns List
   */
  private async listGet(params: ListGetParams): Promise<List> {
    try {
      const result = await this.sdk.lists.GET(params)
      return result
    } catch (error) {
      throw MailchimpError.fromError(error)
    }
  }

  /**
   * undefined List
   * @param params - Operation parameters
   * @returns List
   */
  private async listUpdate(params: ListUpdateParams): Promise<List> {
    try {
      const result = await this.sdk.lists.PATCH(params)
      return result
    } catch (error) {
      throw MailchimpError.fromError(error)
    }
  }

  /**
   * undefined List
   * @param params - Operation parameters
   * @returns boolean
   */
  private async listDelete(params: ListDeleteParams): Promise<boolean> {
    try {
      const result = await this.sdk.lists.DELETE(params)
      return result
    } catch (error) {
      throw MailchimpError.fromError(error)
    }
  }

  /**
   * undefined List
   * @param params - Operation parameters
   * @returns List[]
   */
  private async listList(params: ListListParams): Promise<List[]> {
    try {
      const result = await this.sdk.lists.GET(params)
      return result
    } catch (error) {
      throw MailchimpError.fromError(error)
    }
  }

  /**
   * undefined Member
   * @param params - Operation parameters
   * @returns Member
   */
  private async memberCreate(params: MemberCreateParams): Promise<Member> {
    try {
      const result = await this.sdk.members.POST(params)
      return result
    } catch (error) {
      throw MailchimpError.fromError(error)
    }
  }

  /**
   * undefined Member
   * @param params - Operation parameters
   * @returns Member
   */
  private async memberGet(params: MemberGetParams): Promise<Member> {
    try {
      const result = await this.sdk.members.GET(params)
      return result
    } catch (error) {
      throw MailchimpError.fromError(error)
    }
  }

  /**
   * undefined Member
   * @param params - Operation parameters
   * @returns Member
   */
  private async memberUpdate(params: MemberUpdateParams): Promise<Member> {
    try {
      const result = await this.sdk.members.PATCH(params)
      return result
    } catch (error) {
      throw MailchimpError.fromError(error)
    }
  }

  /**
   * undefined Member
   * @param params - Operation parameters
   * @returns boolean
   */
  private async memberDelete(params: MemberDeleteParams): Promise<boolean> {
    try {
      const result = await this.sdk.members.DELETE(params)
      return result
    } catch (error) {
      throw MailchimpError.fromError(error)
    }
  }

  /**
   * undefined Member
   * @param params - Operation parameters
   * @returns Member[]
   */
  private async memberList(params: MemberListParams): Promise<Member[]> {
    try {
      const result = await this.sdk.members.GET(params)
      return result
    } catch (error) {
      throw MailchimpError.fromError(error)
    }
  }

  /**
   * undefined Template
   * @param params - Operation parameters
   * @returns Template
   */
  private async templateCreate(params: TemplateCreateParams): Promise<Template> {
    try {
      const result = await this.sdk.templates.POST(params)
      return result
    } catch (error) {
      throw MailchimpError.fromError(error)
    }
  }

  /**
   * undefined Template
   * @param params - Operation parameters
   * @returns Template
   */
  private async templateGet(params: TemplateGetParams): Promise<Template> {
    try {
      const result = await this.sdk.templates.GET(params)
      return result
    } catch (error) {
      throw MailchimpError.fromError(error)
    }
  }

  /**
   * undefined Template
   * @param params - Operation parameters
   * @returns Template
   */
  private async templateUpdate(params: TemplateUpdateParams): Promise<Template> {
    try {
      const result = await this.sdk.templates.PATCH(params)
      return result
    } catch (error) {
      throw MailchimpError.fromError(error)
    }
  }

  /**
   * undefined Template
   * @param params - Operation parameters
   * @returns boolean
   */
  private async templateDelete(params: TemplateDeleteParams): Promise<boolean> {
    try {
      const result = await this.sdk.templates.DELETE(params)
      return result
    } catch (error) {
      throw MailchimpError.fromError(error)
    }
  }

  /**
   * undefined Template
   * @param params - Operation parameters
   * @returns Template[]
   */
  private async templateList(params: TemplateListParams): Promise<Template[]> {
    try {
      const result = await this.sdk.templates.GET(params)
      return result
    } catch (error) {
      throw MailchimpError.fromError(error)
    }
  }
}
