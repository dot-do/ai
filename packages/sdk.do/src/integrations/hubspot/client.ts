/**
 * HubSpot Client
 *
 * Auto-generated Integration client for HubSpot.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/hubspot
 */

import Client from '@hubspot/api-client'
import {
  ContactCreateParams,
  ContactGetParams,
  ContactUpdateParams,
  ContactDeleteParams,
  ContactListParams,
  ContactSearchParams,
  ContactBatchCreateParams,
  CompanyCreateParams,
  CompanyGetParams,
  CompanyUpdateParams,
  CompanyDeleteParams,
  CompanyListParams,
  CompanySearchParams,
  DealCreateParams,
  DealGetParams,
  DealUpdateParams,
  DealDeleteParams,
  DealListParams,
  DealSearchParams,
  DealAssociateParams,
  TicketCreateParams,
  TicketGetParams,
  TicketUpdateParams,
  TicketDeleteParams,
  TicketListParams,
  NoteCreateParams,
  EmailCreateParams,
  CallCreateParams,
  MeetingCreateParams,
  TaskCreateParams,
  PropertyGetAllParams,
  PropertyCreateParams,
  WorkflowListParams,
} from './types.js'
import { HubspotError } from './errors.js'

/**
 * HubSpot client options
 */
export interface HubspotClientOptions {
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
 * HubSpot Client
 *
 * CRM platform for inbound marketing, sales, and customer service
 */
export class HubspotClient {
  private options: HubspotClientOptions
  private sdk: Client

  /**
   * Contact resource
   * Manage contacts in HubSpot CRM
   */
  public contact: {
    /** undefined Contact */
    create: (params: ContactCreateParams) => Promise<Contact>
    /** undefined Contact */
    get: (params: ContactGetParams) => Promise<Contact>
    /** undefined Contact */
    update: (params: ContactUpdateParams) => Promise<Contact>
    /** undefined Contact */
    delete: (params: ContactDeleteParams) => Promise<void>
    /** undefined Contact */
    list: (params: ContactListParams) => Promise<PaginatedResponse<Contact>>
    /** undefined Contact */
    search: (params: ContactSearchParams) => Promise<PaginatedResponse<Contact>>
    /** undefined Contact */
    batchCreate: (params: ContactBatchCreateParams) => Promise<BatchCreateResult<Contact>>
  }

  /**
   * Company resource
   * Manage companies in HubSpot CRM
   */
  public company: {
    /** undefined Company */
    create: (params: CompanyCreateParams) => Promise<Company>
    /** undefined Company */
    get: (params: CompanyGetParams) => Promise<Company>
    /** undefined Company */
    update: (params: CompanyUpdateParams) => Promise<Company>
    /** undefined Company */
    delete: (params: CompanyDeleteParams) => Promise<void>
    /** undefined Company */
    list: (params: CompanyListParams) => Promise<PaginatedResponse<Company>>
    /** undefined Company */
    search: (params: CompanySearchParams) => Promise<PaginatedResponse<Company>>
  }

  /**
   * Deal resource
   * Manage deals in HubSpot CRM
   */
  public deal: {
    /** undefined Deal */
    create: (params: DealCreateParams) => Promise<Deal>
    /** undefined Deal */
    get: (params: DealGetParams) => Promise<Deal>
    /** undefined Deal */
    update: (params: DealUpdateParams) => Promise<Deal>
    /** undefined Deal */
    delete: (params: DealDeleteParams) => Promise<void>
    /** undefined Deal */
    list: (params: DealListParams) => Promise<PaginatedResponse<Deal>>
    /** undefined Deal */
    search: (params: DealSearchParams) => Promise<PaginatedResponse<Deal>>
    /** undefined Deal */
    associate: (params: DealAssociateParams) => Promise<void>
  }

  /**
   * Ticket resource
   * Manage support tickets in HubSpot CRM
   */
  public ticket: {
    /** undefined Ticket */
    create: (params: TicketCreateParams) => Promise<Ticket>
    /** undefined Ticket */
    get: (params: TicketGetParams) => Promise<Ticket>
    /** undefined Ticket */
    update: (params: TicketUpdateParams) => Promise<Ticket>
    /** undefined Ticket */
    delete: (params: TicketDeleteParams) => Promise<void>
    /** undefined Ticket */
    list: (params: TicketListParams) => Promise<PaginatedResponse<Ticket>>
  }

  /**
   * Note resource
   * Create note engagements for contacts, companies, and deals
   */
  public note: {
    /** undefined Note */
    create: (params: NoteCreateParams) => Promise<Note>
  }

  /**
   * Email resource
   * Create email engagements
   */
  public email: {
    /** undefined Email */
    create: (params: EmailCreateParams) => Promise<Email>
  }

  /**
   * Call resource
   * Create call engagements
   */
  public call: {
    /** undefined Call */
    create: (params: CallCreateParams) => Promise<Call>
  }

  /**
   * Meeting resource
   * Create meeting engagements
   */
  public meeting: {
    /** undefined Meeting */
    create: (params: MeetingCreateParams) => Promise<Meeting>
  }

  /**
   * Task resource
   * Create task engagements
   */
  public task: {
    /** undefined Task */
    create: (params: TaskCreateParams) => Promise<Task>
  }

  /**
   * Property resource
   * Manage custom properties for CRM objects
   */
  public property: {
    /** undefined Property */
    getAll: (params: PropertyGetAllParams) => Promise<Property[]>
    /** undefined Property */
    create: (params: PropertyCreateParams) => Promise<Property>
  }

  /**
   * Workflow resource
   * Manage automation workflows
   */
  public workflow: {
    /** undefined Workflow */
    list: (params: WorkflowListParams) => Promise<Workflow[]>
  }

  constructor(options: HubspotClientOptions) {
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
    this.contact = {
      create: this.contactCreate.bind(this),
      get: this.contactGet.bind(this),
      update: this.contactUpdate.bind(this),
      delete: this.contactDelete.bind(this),
      list: this.contactList.bind(this),
      search: this.contactSearch.bind(this),
      batchCreate: this.contactBatchCreate.bind(this),
    }
    this.company = {
      create: this.companyCreate.bind(this),
      get: this.companyGet.bind(this),
      update: this.companyUpdate.bind(this),
      delete: this.companyDelete.bind(this),
      list: this.companyList.bind(this),
      search: this.companySearch.bind(this),
    }
    this.deal = {
      create: this.dealCreate.bind(this),
      get: this.dealGet.bind(this),
      update: this.dealUpdate.bind(this),
      delete: this.dealDelete.bind(this),
      list: this.dealList.bind(this),
      search: this.dealSearch.bind(this),
      associate: this.dealAssociate.bind(this),
    }
    this.ticket = {
      create: this.ticketCreate.bind(this),
      get: this.ticketGet.bind(this),
      update: this.ticketUpdate.bind(this),
      delete: this.ticketDelete.bind(this),
      list: this.ticketList.bind(this),
    }
    this.note = {
      create: this.noteCreate.bind(this),
    }
    this.email = {
      create: this.emailCreate.bind(this),
    }
    this.call = {
      create: this.callCreate.bind(this),
    }
    this.meeting = {
      create: this.meetingCreate.bind(this),
    }
    this.task = {
      create: this.taskCreate.bind(this),
    }
    this.property = {
      getAll: this.propertyGetAll.bind(this),
      create: this.propertyCreate.bind(this),
    }
    this.workflow = {
      list: this.workflowList.bind(this),
    }
  }

  /**
   * undefined Contact
   * @param params - Operation parameters
   * @returns Contact
   */
  private async contactCreate(params: ContactCreateParams): Promise<Contact> {
    try {
      const result = await this.sdk.crm.contacts.basicApi.create(params)
      return result
    } catch (error) {
      throw HubspotError.fromError(error)
    }
  }

  /**
   * undefined Contact
   * @param params - Operation parameters
   * @returns Contact
   */
  private async contactGet(params: ContactGetParams): Promise<Contact> {
    try {
      const result = await this.sdk.crm.contacts.basicApi.getById(params)
      return result
    } catch (error) {
      throw HubspotError.fromError(error)
    }
  }

  /**
   * undefined Contact
   * @param params - Operation parameters
   * @returns Contact
   */
  private async contactUpdate(params: ContactUpdateParams): Promise<Contact> {
    try {
      const result = await this.sdk.crm.contacts.basicApi.update(params)
      return result
    } catch (error) {
      throw HubspotError.fromError(error)
    }
  }

  /**
   * undefined Contact
   * @param params - Operation parameters
   * @returns void
   */
  private async contactDelete(params: ContactDeleteParams): Promise<void> {
    try {
      const result = await this.sdk.crm.contacts.basicApi.archive(params)
      return result
    } catch (error) {
      throw HubspotError.fromError(error)
    }
  }

  /**
   * undefined Contact
   * @param params - Operation parameters
   * @returns PaginatedResponse<Contact>
   */
  private async contactList(params: ContactListParams): Promise<PaginatedResponse<Contact>> {
    try {
      const result = await this.sdk.crm.contacts.basicApi.getPage(params)
      return result
    } catch (error) {
      throw HubspotError.fromError(error)
    }
  }

  /**
   * undefined Contact
   * @param params - Operation parameters
   * @returns PaginatedResponse<Contact>
   */
  private async contactSearch(params: ContactSearchParams): Promise<PaginatedResponse<Contact>> {
    try {
      const result = await this.sdk.crm.contacts.basicApi.doSearch(params)
      return result
    } catch (error) {
      throw HubspotError.fromError(error)
    }
  }

  /**
   * undefined Contact
   * @param params - Operation parameters
   * @returns BatchCreateResult<Contact>
   */
  private async contactBatchCreate(params: ContactBatchCreateParams): Promise<BatchCreateResult<Contact>> {
    try {
      const result = await this.sdk.crm.contacts.basicApi.create(params)
      return result
    } catch (error) {
      throw HubspotError.fromError(error)
    }
  }

  /**
   * undefined Company
   * @param params - Operation parameters
   * @returns Company
   */
  private async companyCreate(params: CompanyCreateParams): Promise<Company> {
    try {
      const result = await this.sdk.crm.companies.basicApi.create(params)
      return result
    } catch (error) {
      throw HubspotError.fromError(error)
    }
  }

  /**
   * undefined Company
   * @param params - Operation parameters
   * @returns Company
   */
  private async companyGet(params: CompanyGetParams): Promise<Company> {
    try {
      const result = await this.sdk.crm.companies.basicApi.getById(params)
      return result
    } catch (error) {
      throw HubspotError.fromError(error)
    }
  }

  /**
   * undefined Company
   * @param params - Operation parameters
   * @returns Company
   */
  private async companyUpdate(params: CompanyUpdateParams): Promise<Company> {
    try {
      const result = await this.sdk.crm.companies.basicApi.update(params)
      return result
    } catch (error) {
      throw HubspotError.fromError(error)
    }
  }

  /**
   * undefined Company
   * @param params - Operation parameters
   * @returns void
   */
  private async companyDelete(params: CompanyDeleteParams): Promise<void> {
    try {
      const result = await this.sdk.crm.companies.basicApi.archive(params)
      return result
    } catch (error) {
      throw HubspotError.fromError(error)
    }
  }

  /**
   * undefined Company
   * @param params - Operation parameters
   * @returns PaginatedResponse<Company>
   */
  private async companyList(params: CompanyListParams): Promise<PaginatedResponse<Company>> {
    try {
      const result = await this.sdk.crm.companies.basicApi.getPage(params)
      return result
    } catch (error) {
      throw HubspotError.fromError(error)
    }
  }

  /**
   * undefined Company
   * @param params - Operation parameters
   * @returns PaginatedResponse<Company>
   */
  private async companySearch(params: CompanySearchParams): Promise<PaginatedResponse<Company>> {
    try {
      const result = await this.sdk.crm.companies.basicApi.doSearch(params)
      return result
    } catch (error) {
      throw HubspotError.fromError(error)
    }
  }

  /**
   * undefined Deal
   * @param params - Operation parameters
   * @returns Deal
   */
  private async dealCreate(params: DealCreateParams): Promise<Deal> {
    try {
      const result = await this.sdk.crm.deals.basicApi.create(params)
      return result
    } catch (error) {
      throw HubspotError.fromError(error)
    }
  }

  /**
   * undefined Deal
   * @param params - Operation parameters
   * @returns Deal
   */
  private async dealGet(params: DealGetParams): Promise<Deal> {
    try {
      const result = await this.sdk.crm.deals.basicApi.getById(params)
      return result
    } catch (error) {
      throw HubspotError.fromError(error)
    }
  }

  /**
   * undefined Deal
   * @param params - Operation parameters
   * @returns Deal
   */
  private async dealUpdate(params: DealUpdateParams): Promise<Deal> {
    try {
      const result = await this.sdk.crm.deals.basicApi.update(params)
      return result
    } catch (error) {
      throw HubspotError.fromError(error)
    }
  }

  /**
   * undefined Deal
   * @param params - Operation parameters
   * @returns void
   */
  private async dealDelete(params: DealDeleteParams): Promise<void> {
    try {
      const result = await this.sdk.crm.deals.basicApi.archive(params)
      return result
    } catch (error) {
      throw HubspotError.fromError(error)
    }
  }

  /**
   * undefined Deal
   * @param params - Operation parameters
   * @returns PaginatedResponse<Deal>
   */
  private async dealList(params: DealListParams): Promise<PaginatedResponse<Deal>> {
    try {
      const result = await this.sdk.crm.deals.basicApi.getPage(params)
      return result
    } catch (error) {
      throw HubspotError.fromError(error)
    }
  }

  /**
   * undefined Deal
   * @param params - Operation parameters
   * @returns PaginatedResponse<Deal>
   */
  private async dealSearch(params: DealSearchParams): Promise<PaginatedResponse<Deal>> {
    try {
      const result = await this.sdk.crm.deals.basicApi.doSearch(params)
      return result
    } catch (error) {
      throw HubspotError.fromError(error)
    }
  }

  /**
   * undefined Deal
   * @param params - Operation parameters
   * @returns void
   */
  private async dealAssociate(params: DealAssociateParams): Promise<void> {
    try {
      const result = await this.sdk.crm.deals.basicApi.create(params)
      return result
    } catch (error) {
      throw HubspotError.fromError(error)
    }
  }

  /**
   * undefined Ticket
   * @param params - Operation parameters
   * @returns Ticket
   */
  private async ticketCreate(params: TicketCreateParams): Promise<Ticket> {
    try {
      const result = await this.sdk.crm.tickets.basicApi.create(params)
      return result
    } catch (error) {
      throw HubspotError.fromError(error)
    }
  }

  /**
   * undefined Ticket
   * @param params - Operation parameters
   * @returns Ticket
   */
  private async ticketGet(params: TicketGetParams): Promise<Ticket> {
    try {
      const result = await this.sdk.crm.tickets.basicApi.getById(params)
      return result
    } catch (error) {
      throw HubspotError.fromError(error)
    }
  }

  /**
   * undefined Ticket
   * @param params - Operation parameters
   * @returns Ticket
   */
  private async ticketUpdate(params: TicketUpdateParams): Promise<Ticket> {
    try {
      const result = await this.sdk.crm.tickets.basicApi.update(params)
      return result
    } catch (error) {
      throw HubspotError.fromError(error)
    }
  }

  /**
   * undefined Ticket
   * @param params - Operation parameters
   * @returns void
   */
  private async ticketDelete(params: TicketDeleteParams): Promise<void> {
    try {
      const result = await this.sdk.crm.tickets.basicApi.archive(params)
      return result
    } catch (error) {
      throw HubspotError.fromError(error)
    }
  }

  /**
   * undefined Ticket
   * @param params - Operation parameters
   * @returns PaginatedResponse<Ticket>
   */
  private async ticketList(params: TicketListParams): Promise<PaginatedResponse<Ticket>> {
    try {
      const result = await this.sdk.crm.tickets.basicApi.getPage(params)
      return result
    } catch (error) {
      throw HubspotError.fromError(error)
    }
  }

  /**
   * undefined Note
   * @param params - Operation parameters
   * @returns Note
   */
  private async noteCreate(params: NoteCreateParams): Promise<Note> {
    try {
      const result = await this.sdk.crm.objects.notes.basicApi.create(params)
      return result
    } catch (error) {
      throw HubspotError.fromError(error)
    }
  }

  /**
   * undefined Email
   * @param params - Operation parameters
   * @returns Email
   */
  private async emailCreate(params: EmailCreateParams): Promise<Email> {
    try {
      const result = await this.sdk.crm.objects.emails.basicApi.create(params)
      return result
    } catch (error) {
      throw HubspotError.fromError(error)
    }
  }

  /**
   * undefined Call
   * @param params - Operation parameters
   * @returns Call
   */
  private async callCreate(params: CallCreateParams): Promise<Call> {
    try {
      const result = await this.sdk.crm.objects.calls.basicApi.create(params)
      return result
    } catch (error) {
      throw HubspotError.fromError(error)
    }
  }

  /**
   * undefined Meeting
   * @param params - Operation parameters
   * @returns Meeting
   */
  private async meetingCreate(params: MeetingCreateParams): Promise<Meeting> {
    try {
      const result = await this.sdk.crm.objects.meetings.basicApi.create(params)
      return result
    } catch (error) {
      throw HubspotError.fromError(error)
    }
  }

  /**
   * undefined Task
   * @param params - Operation parameters
   * @returns Task
   */
  private async taskCreate(params: TaskCreateParams): Promise<Task> {
    try {
      const result = await this.sdk.crm.objects.tasks.basicApi.create(params)
      return result
    } catch (error) {
      throw HubspotError.fromError(error)
    }
  }

  /**
   * undefined Property
   * @param params - Operation parameters
   * @returns Property[]
   */
  private async propertyGetAll(params: PropertyGetAllParams): Promise<Property[]> {
    try {
      const result = await this.sdk.crm.properties.coreApi.getAll(params)
      return result
    } catch (error) {
      throw HubspotError.fromError(error)
    }
  }

  /**
   * undefined Property
   * @param params - Operation parameters
   * @returns Property
   */
  private async propertyCreate(params: PropertyCreateParams): Promise<Property> {
    try {
      const result = await this.sdk.crm.properties.coreApi.create(params)
      return result
    } catch (error) {
      throw HubspotError.fromError(error)
    }
  }

  /**
   * undefined Workflow
   * @param params - Operation parameters
   * @returns Workflow[]
   */
  private async workflowList(params: WorkflowListParams): Promise<Workflow[]> {
    try {
      const result = await this.sdk.automation.workflows.workflowsApi.getPage(params)
      return result
    } catch (error) {
      throw HubspotError.fromError(error)
    }
  }
}
