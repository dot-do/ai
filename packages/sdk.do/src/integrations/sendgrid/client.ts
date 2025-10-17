/**
 * SendGrid Client
 *
 * Auto-generated Integration client for SendGrid.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/sendgrid
 */

import sgMail from '@sendgrid/mail'
import {
  EmailSendParams,
  EmailSendBulkParams,
  EmailSendTemplateParams,
  EmailSendDynamicTemplateParams,
  EmailValidateParams,
  ContactCreateParams,
  ContactGetParams,
  ContactUpdateParams,
  ContactDeleteParams,
  ContactListParams,
  ContactSearchParams,
  ListCreateParams,
  ListGetParams,
  ListUpdateParams,
  ListDeleteParams,
  ListAddContactsParams,
  ListRemoveContactsParams,
  SegmentCreateParams,
  SegmentGetParams,
  SegmentUpdateParams,
  SegmentDeleteParams,
  TemplateCreateParams,
  TemplateGetParams,
  TemplateUpdateParams,
  TemplateDeleteParams,
  CampaignCreateParams,
  CampaignGetParams,
  CampaignUpdateParams,
  CampaignDeleteParams,
  CampaignSendParams,
  CampaignScheduleParams,
  SuppressionAddToGroupParams,
  SuppressionRemoveFromGroupParams,
  StatsGetParams,
  StatsGetGlobalParams,
  StatsGetCategoryParams,
} from './types.js'
import { SendgridError } from './errors.js'

/**
 * SendGrid client options
 */
export interface SendgridClientOptions {
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
 * SendGrid Client
 *
 * Email delivery and marketing platform for transactional and marketing emails
 */
export class SendgridClient {
  private options: SendgridClientOptions
  private sdk: sgMail

  /**
   * Email resource
   */
  public email: {
    /** undefined Email */
    send: (params: EmailSendParams) => Promise<SendGridResponse>
    /** undefined Email */
    sendBulk: (params: EmailSendBulkParams) => Promise<SendGridResponse>
    /** undefined Email */
    sendTemplate: (params: EmailSendTemplateParams) => Promise<SendGridResponse>
    /** undefined Email */
    sendDynamicTemplate: (params: EmailSendDynamicTemplateParams) => Promise<SendGridResponse>
    /** undefined Email */
    validate: (params: EmailValidateParams) => Promise<EmailValidation>
  }

  /**
   * Contact resource
   */
  public contact: {
    /** undefined Contact */
    create: (params: ContactCreateParams) => Promise<{ job_id: string }>
    /** undefined Contact */
    get: (params: ContactGetParams) => Promise<Contact>
    /** undefined Contact */
    update: (params: ContactUpdateParams) => Promise<{ job_id: string }>
    /** undefined Contact */
    delete: (params: ContactDeleteParams) => Promise<{ job_id: string }>
    /** undefined Contact */
    list: (params: ContactListParams) => Promise<{ result: Contact[]; _metadata: { next?: string } }>
    /** undefined Contact */
    search: (params: ContactSearchParams) => Promise<{ result: Contact[]; contact_count: number }>
  }

  /**
   * List resource
   */
  public list: {
    /** undefined List */
    create: (params: ListCreateParams) => Promise<ContactList>
    /** undefined List */
    get: (params: ListGetParams) => Promise<ContactList>
    /** undefined List */
    update: (params: ListUpdateParams) => Promise<ContactList>
    /** undefined List */
    delete: (params: ListDeleteParams) => Promise<{ job_id: string }>
    /** undefined List */
    list: () => Promise<{ result: ContactList[] }>
    /** undefined List */
    addContacts: (params: ListAddContactsParams) => Promise<{ job_id: string }>
    /** undefined List */
    removeContacts: (params: ListRemoveContactsParams) => Promise<{ job_id: string }>
  }

  /**
   * Segment resource
   */
  public segment: {
    /** undefined Segment */
    create: (params: SegmentCreateParams) => Promise<Segment>
    /** undefined Segment */
    get: (params: SegmentGetParams) => Promise<Segment>
    /** undefined Segment */
    update: (params: SegmentUpdateParams) => Promise<Segment>
    /** undefined Segment */
    delete: (params: SegmentDeleteParams) => Promise<void>
    /** undefined Segment */
    list: () => Promise<{ results: Segment[] }>
  }

  /**
   * Template resource
   */
  public template: {
    /** undefined Template */
    create: (params: TemplateCreateParams) => Promise<Template>
    /** undefined Template */
    get: (params: TemplateGetParams) => Promise<Template>
    /** undefined Template */
    update: (params: TemplateUpdateParams) => Promise<Template>
    /** undefined Template */
    delete: (params: TemplateDeleteParams) => Promise<void>
    /** undefined Template */
    list: () => Promise<{ result: Template[] }>
  }

  /**
   * Campaign resource
   */
  public campaign: {
    /** undefined Campaign */
    create: (params: CampaignCreateParams) => Promise<Campaign>
    /** undefined Campaign */
    get: (params: CampaignGetParams) => Promise<Campaign>
    /** undefined Campaign */
    update: (params: CampaignUpdateParams) => Promise<Campaign>
    /** undefined Campaign */
    delete: (params: CampaignDeleteParams) => Promise<void>
    /** undefined Campaign */
    list: () => Promise<{ result: Campaign[] }>
    /** undefined Campaign */
    send: (params: CampaignSendParams) => Promise<{ status: string }>
    /** undefined Campaign */
    schedule: (params: CampaignScheduleParams) => Promise<{ status: string }>
  }

  /**
   * Suppression resource
   */
  public suppression: {
    /** undefined Suppression */
    addToGroup: (params: SuppressionAddToGroupParams) => Promise<{ recipient_emails: string[] }>
    /** undefined Suppression */
    removeFromGroup: (params: SuppressionRemoveFromGroupParams) => Promise<void>
    /** undefined Suppression */
    listGroups: () => Promise<SuppressionGroup[]>
  }

  /**
   * Stats resource
   */
  public stats: {
    /** undefined Stats */
    get: (params: StatsGetParams) => Promise<EmailStats[]>
    /** undefined Stats */
    getGlobal: (params: StatsGetGlobalParams) => Promise<GlobalStats[]>
    /** undefined Stats */
    getCategory: (params: StatsGetCategoryParams) => Promise<CategoryStats[]>
  }

  constructor(options: SendgridClientOptions) {
    this.options = {
      baseUrl: 'undefined',
      timeout: 30000,
      retryAttempts: 3,
      ...options,
    }

    // Initialize SDK
    this.sdk = new sgMail(this.options.apiKey, {
      apiVersion: 'v3',
    })

    // Initialize resource namespaces
    this.email = {
      send: this.emailSend.bind(this),
      sendBulk: this.emailSendBulk.bind(this),
      sendTemplate: this.emailSendTemplate.bind(this),
      sendDynamicTemplate: this.emailSendDynamicTemplate.bind(this),
      validate: this.emailValidate.bind(this),
    }
    this.contact = {
      create: this.contactCreate.bind(this),
      get: this.contactGet.bind(this),
      update: this.contactUpdate.bind(this),
      delete: this.contactDelete.bind(this),
      list: this.contactList.bind(this),
      search: this.contactSearch.bind(this),
    }
    this.list = {
      create: this.listCreate.bind(this),
      get: this.listGet.bind(this),
      update: this.listUpdate.bind(this),
      delete: this.listDelete.bind(this),
      list: this.listList.bind(this),
      addContacts: this.listAddContacts.bind(this),
      removeContacts: this.listRemoveContacts.bind(this),
    }
    this.segment = {
      create: this.segmentCreate.bind(this),
      get: this.segmentGet.bind(this),
      update: this.segmentUpdate.bind(this),
      delete: this.segmentDelete.bind(this),
      list: this.segmentList.bind(this),
    }
    this.template = {
      create: this.templateCreate.bind(this),
      get: this.templateGet.bind(this),
      update: this.templateUpdate.bind(this),
      delete: this.templateDelete.bind(this),
      list: this.templateList.bind(this),
    }
    this.campaign = {
      create: this.campaignCreate.bind(this),
      get: this.campaignGet.bind(this),
      update: this.campaignUpdate.bind(this),
      delete: this.campaignDelete.bind(this),
      list: this.campaignList.bind(this),
      send: this.campaignSend.bind(this),
      schedule: this.campaignSchedule.bind(this),
    }
    this.suppression = {
      addToGroup: this.suppressionAddToGroup.bind(this),
      removeFromGroup: this.suppressionRemoveFromGroup.bind(this),
      listGroups: this.suppressionListGroups.bind(this),
    }
    this.stats = {
      get: this.statsGet.bind(this),
      getGlobal: this.statsGetGlobal.bind(this),
      getCategory: this.statsGetCategory.bind(this),
    }
  }

  /**
   * undefined Email
   * @param params - Operation parameters
   * @returns SendGridResponse
   */
  private async emailSend(params: EmailSendParams): Promise<SendGridResponse> {
    try {
      const result = await this.sdk.mail.send(params)
      return result
    } catch (error) {
      throw SendgridError.fromError(error)
    }
  }

  /**
   * undefined Email
   * @param params - Operation parameters
   * @returns SendGridResponse
   */
  private async emailSendBulk(params: EmailSendBulkParams): Promise<SendGridResponse> {
    try {
      const result = await this.sdk.mail.send(params)
      return result
    } catch (error) {
      throw SendgridError.fromError(error)
    }
  }

  /**
   * undefined Email
   * @param params - Operation parameters
   * @returns SendGridResponse
   */
  private async emailSendTemplate(params: EmailSendTemplateParams): Promise<SendGridResponse> {
    try {
      const result = await this.sdk.mail.send(params)
      return result
    } catch (error) {
      throw SendgridError.fromError(error)
    }
  }

  /**
   * undefined Email
   * @param params - Operation parameters
   * @returns SendGridResponse
   */
  private async emailSendDynamicTemplate(params: EmailSendDynamicTemplateParams): Promise<SendGridResponse> {
    try {
      const result = await this.sdk.mail.send(params)
      return result
    } catch (error) {
      throw SendgridError.fromError(error)
    }
  }

  /**
   * undefined Email
   * @param params - Operation parameters
   * @returns EmailValidation
   */
  private async emailValidate(params: EmailValidateParams): Promise<EmailValidation> {
    try {
      const result = await this.sdk.mail.POST(params)
      return result
    } catch (error) {
      throw SendgridError.fromError(error)
    }
  }

  /**
   * undefined Contact
   * @param params - Operation parameters
   * @returns { job_id: string }
   */
  private async contactCreate(params: ContactCreateParams): Promise<{ job_id: string }> {
    try {
      const result = await this.sdk.client.PUT(params)
      return result
    } catch (error) {
      throw SendgridError.fromError(error)
    }
  }

  /**
   * undefined Contact
   * @param params - Operation parameters
   * @returns Contact
   */
  private async contactGet(params: ContactGetParams): Promise<Contact> {
    try {
      const result = await this.sdk.client.GET(params)
      return result
    } catch (error) {
      throw SendgridError.fromError(error)
    }
  }

  /**
   * undefined Contact
   * @param params - Operation parameters
   * @returns { job_id: string }
   */
  private async contactUpdate(params: ContactUpdateParams): Promise<{ job_id: string }> {
    try {
      const result = await this.sdk.client.PUT(params)
      return result
    } catch (error) {
      throw SendgridError.fromError(error)
    }
  }

  /**
   * undefined Contact
   * @param params - Operation parameters
   * @returns { job_id: string }
   */
  private async contactDelete(params: ContactDeleteParams): Promise<{ job_id: string }> {
    try {
      const result = await this.sdk.client.DELETE(params)
      return result
    } catch (error) {
      throw SendgridError.fromError(error)
    }
  }

  /**
   * undefined Contact
   * @param params - Operation parameters
   * @returns { result: Contact[], _metadata: { next?: string } }
   */
  private async contactList(params: ContactListParams): Promise<{ result: Contact[]; _metadata: { next?: string } }> {
    try {
      const result = await this.sdk.client.GET(params)
      return result
    } catch (error) {
      throw SendgridError.fromError(error)
    }
  }

  /**
   * undefined Contact
   * @param params - Operation parameters
   * @returns { result: Contact[], contact_count: number }
   */
  private async contactSearch(params: ContactSearchParams): Promise<{ result: Contact[]; contact_count: number }> {
    try {
      const result = await this.sdk.client.POST(params)
      return result
    } catch (error) {
      throw SendgridError.fromError(error)
    }
  }

  /**
   * undefined List
   * @param params - Operation parameters
   * @returns ContactList
   */
  private async listCreate(params: ListCreateParams): Promise<ContactList> {
    try {
      const result = await this.sdk.client.POST(params)
      return result
    } catch (error) {
      throw SendgridError.fromError(error)
    }
  }

  /**
   * undefined List
   * @param params - Operation parameters
   * @returns ContactList
   */
  private async listGet(params: ListGetParams): Promise<ContactList> {
    try {
      const result = await this.sdk.client.GET(params)
      return result
    } catch (error) {
      throw SendgridError.fromError(error)
    }
  }

  /**
   * undefined List
   * @param params - Operation parameters
   * @returns ContactList
   */
  private async listUpdate(params: ListUpdateParams): Promise<ContactList> {
    try {
      const result = await this.sdk.client.PATCH(params)
      return result
    } catch (error) {
      throw SendgridError.fromError(error)
    }
  }

  /**
   * undefined List
   * @param params - Operation parameters
   * @returns { job_id: string }
   */
  private async listDelete(params: ListDeleteParams): Promise<{ job_id: string }> {
    try {
      const result = await this.sdk.client.DELETE(params)
      return result
    } catch (error) {
      throw SendgridError.fromError(error)
    }
  }

  /**
   * undefined List
   * @returns { result: ContactList[] }
   */
  private async listList(): Promise<{ result: ContactList[] }> {
    try {
      const result = await this.sdk.client.GET()
      return result
    } catch (error) {
      throw SendgridError.fromError(error)
    }
  }

  /**
   * undefined List
   * @param params - Operation parameters
   * @returns { job_id: string }
   */
  private async listAddContacts(params: ListAddContactsParams): Promise<{ job_id: string }> {
    try {
      const result = await this.sdk.client.POST(params)
      return result
    } catch (error) {
      throw SendgridError.fromError(error)
    }
  }

  /**
   * undefined List
   * @param params - Operation parameters
   * @returns { job_id: string }
   */
  private async listRemoveContacts(params: ListRemoveContactsParams): Promise<{ job_id: string }> {
    try {
      const result = await this.sdk.client.DELETE(params)
      return result
    } catch (error) {
      throw SendgridError.fromError(error)
    }
  }

  /**
   * undefined Segment
   * @param params - Operation parameters
   * @returns Segment
   */
  private async segmentCreate(params: SegmentCreateParams): Promise<Segment> {
    try {
      const result = await this.sdk.client.POST(params)
      return result
    } catch (error) {
      throw SendgridError.fromError(error)
    }
  }

  /**
   * undefined Segment
   * @param params - Operation parameters
   * @returns Segment
   */
  private async segmentGet(params: SegmentGetParams): Promise<Segment> {
    try {
      const result = await this.sdk.client.GET(params)
      return result
    } catch (error) {
      throw SendgridError.fromError(error)
    }
  }

  /**
   * undefined Segment
   * @param params - Operation parameters
   * @returns Segment
   */
  private async segmentUpdate(params: SegmentUpdateParams): Promise<Segment> {
    try {
      const result = await this.sdk.client.PATCH(params)
      return result
    } catch (error) {
      throw SendgridError.fromError(error)
    }
  }

  /**
   * undefined Segment
   * @param params - Operation parameters
   * @returns void
   */
  private async segmentDelete(params: SegmentDeleteParams): Promise<void> {
    try {
      const result = await this.sdk.client.DELETE(params)
      return result
    } catch (error) {
      throw SendgridError.fromError(error)
    }
  }

  /**
   * undefined Segment
   * @returns { results: Segment[] }
   */
  private async segmentList(): Promise<{ results: Segment[] }> {
    try {
      const result = await this.sdk.client.GET()
      return result
    } catch (error) {
      throw SendgridError.fromError(error)
    }
  }

  /**
   * undefined Template
   * @param params - Operation parameters
   * @returns Template
   */
  private async templateCreate(params: TemplateCreateParams): Promise<Template> {
    try {
      const result = await this.sdk.client.POST(params)
      return result
    } catch (error) {
      throw SendgridError.fromError(error)
    }
  }

  /**
   * undefined Template
   * @param params - Operation parameters
   * @returns Template
   */
  private async templateGet(params: TemplateGetParams): Promise<Template> {
    try {
      const result = await this.sdk.client.GET(params)
      return result
    } catch (error) {
      throw SendgridError.fromError(error)
    }
  }

  /**
   * undefined Template
   * @param params - Operation parameters
   * @returns Template
   */
  private async templateUpdate(params: TemplateUpdateParams): Promise<Template> {
    try {
      const result = await this.sdk.client.PATCH(params)
      return result
    } catch (error) {
      throw SendgridError.fromError(error)
    }
  }

  /**
   * undefined Template
   * @param params - Operation parameters
   * @returns void
   */
  private async templateDelete(params: TemplateDeleteParams): Promise<void> {
    try {
      const result = await this.sdk.client.DELETE(params)
      return result
    } catch (error) {
      throw SendgridError.fromError(error)
    }
  }

  /**
   * undefined Template
   * @returns { result: Template[] }
   */
  private async templateList(): Promise<{ result: Template[] }> {
    try {
      const result = await this.sdk.client.GET()
      return result
    } catch (error) {
      throw SendgridError.fromError(error)
    }
  }

  /**
   * undefined Campaign
   * @param params - Operation parameters
   * @returns Campaign
   */
  private async campaignCreate(params: CampaignCreateParams): Promise<Campaign> {
    try {
      const result = await this.sdk.client.POST(params)
      return result
    } catch (error) {
      throw SendgridError.fromError(error)
    }
  }

  /**
   * undefined Campaign
   * @param params - Operation parameters
   * @returns Campaign
   */
  private async campaignGet(params: CampaignGetParams): Promise<Campaign> {
    try {
      const result = await this.sdk.client.GET(params)
      return result
    } catch (error) {
      throw SendgridError.fromError(error)
    }
  }

  /**
   * undefined Campaign
   * @param params - Operation parameters
   * @returns Campaign
   */
  private async campaignUpdate(params: CampaignUpdateParams): Promise<Campaign> {
    try {
      const result = await this.sdk.client.PATCH(params)
      return result
    } catch (error) {
      throw SendgridError.fromError(error)
    }
  }

  /**
   * undefined Campaign
   * @param params - Operation parameters
   * @returns void
   */
  private async campaignDelete(params: CampaignDeleteParams): Promise<void> {
    try {
      const result = await this.sdk.client.DELETE(params)
      return result
    } catch (error) {
      throw SendgridError.fromError(error)
    }
  }

  /**
   * undefined Campaign
   * @returns { result: Campaign[] }
   */
  private async campaignList(): Promise<{ result: Campaign[] }> {
    try {
      const result = await this.sdk.client.GET()
      return result
    } catch (error) {
      throw SendgridError.fromError(error)
    }
  }

  /**
   * undefined Campaign
   * @param params - Operation parameters
   * @returns { status: string }
   */
  private async campaignSend(params: CampaignSendParams): Promise<{ status: string }> {
    try {
      const result = await this.sdk.client.PUT(params)
      return result
    } catch (error) {
      throw SendgridError.fromError(error)
    }
  }

  /**
   * undefined Campaign
   * @param params - Operation parameters
   * @returns { status: string }
   */
  private async campaignSchedule(params: CampaignScheduleParams): Promise<{ status: string }> {
    try {
      const result = await this.sdk.client.PUT(params)
      return result
    } catch (error) {
      throw SendgridError.fromError(error)
    }
  }

  /**
   * undefined Suppression
   * @param params - Operation parameters
   * @returns { recipient_emails: string[] }
   */
  private async suppressionAddToGroup(params: SuppressionAddToGroupParams): Promise<{ recipient_emails: string[] }> {
    try {
      const result = await this.sdk.client.POST(params)
      return result
    } catch (error) {
      throw SendgridError.fromError(error)
    }
  }

  /**
   * undefined Suppression
   * @param params - Operation parameters
   * @returns void
   */
  private async suppressionRemoveFromGroup(params: SuppressionRemoveFromGroupParams): Promise<void> {
    try {
      const result = await this.sdk.client.DELETE(params)
      return result
    } catch (error) {
      throw SendgridError.fromError(error)
    }
  }

  /**
   * undefined Suppression
   * @returns SuppressionGroup[]
   */
  private async suppressionListGroups(): Promise<SuppressionGroup[]> {
    try {
      const result = await this.sdk.client.GET()
      return result
    } catch (error) {
      throw SendgridError.fromError(error)
    }
  }

  /**
   * undefined Stats
   * @param params - Operation parameters
   * @returns EmailStats[]
   */
  private async statsGet(params: StatsGetParams): Promise<EmailStats[]> {
    try {
      const result = await this.sdk.client.GET(params)
      return result
    } catch (error) {
      throw SendgridError.fromError(error)
    }
  }

  /**
   * undefined Stats
   * @param params - Operation parameters
   * @returns GlobalStats[]
   */
  private async statsGetGlobal(params: StatsGetGlobalParams): Promise<GlobalStats[]> {
    try {
      const result = await this.sdk.client.GET(params)
      return result
    } catch (error) {
      throw SendgridError.fromError(error)
    }
  }

  /**
   * undefined Stats
   * @param params - Operation parameters
   * @returns CategoryStats[]
   */
  private async statsGetCategory(params: StatsGetCategoryParams): Promise<CategoryStats[]> {
    try {
      const result = await this.sdk.client.GET(params)
      return result
    } catch (error) {
      throw SendgridError.fromError(error)
    }
  }
}
