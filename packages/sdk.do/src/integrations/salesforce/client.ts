/**
 * Salesforce Client
 *
 * Auto-generated Integration client for Salesforce.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/salesforce
 */

import jsforce from 'jsforce'
import {
  AccountCreateParams,
  AccountGetParams,
  AccountUpdateParams,
  AccountDeleteParams,
  AccountListParams,
  AccountSearchParams,
  ContactCreateParams,
  ContactGetParams,
  ContactUpdateParams,
  ContactDeleteParams,
  ContactListParams,
  ContactSearchParams,
  LeadCreateParams,
  LeadGetParams,
  LeadUpdateParams,
  LeadDeleteParams,
  LeadConvertParams,
  LeadListParams,
  OpportunityCreateParams,
  OpportunityGetParams,
  OpportunityUpdateParams,
  OpportunityDeleteParams,
  OpportunityListParams,
  CaseCreateParams,
  CaseGetParams,
  CaseUpdateParams,
  CaseDeleteParams,
  CaseListParams,
  TaskCreateParams,
  TaskGetParams,
  TaskUpdateParams,
  TaskDeleteParams,
  TaskListParams,
  CustomObjectCreateParams,
  CustomObjectGetParams,
  CustomObjectUpdateParams,
  CustomObjectDeleteParams,
  QueryExecuteParams,
  QueryQueryMoreParams,
  SearchExecuteParams,
  BulkInsertParams,
  BulkUpdateParams,
  BulkDeleteParams,
  MetadataDescribeObjectParams,
} from './types.js'
import { SalesforceError } from './errors.js'

/**
 * Salesforce client options
 */
export interface SalesforceClientOptions {
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
 * Salesforce Client
 *
 * Customer relationship management platform for sales, service, marketing, and commerce
 */
export class SalesforceClient {
  private options: SalesforceClientOptions
  private sdk: jsforce

  /**
   * Account resource
   * Business account records
   */
  public account: {
    /** undefined Account */
    create: (params: AccountCreateParams) => Promise<object>
    /** undefined Account */
    get: (params: AccountGetParams) => Promise<object>
    /** undefined Account */
    update: (params: AccountUpdateParams) => Promise<object>
    /** undefined Account */
    delete: (params: AccountDeleteParams) => Promise<boolean>
    /** undefined Account */
    list: (params: AccountListParams) => Promise<object>
    /** undefined Account */
    search: (params: AccountSearchParams) => Promise<array>
  }

  /**
   * Contact resource
   * Individual contact records
   */
  public contact: {
    /** undefined Contact */
    create: (params: ContactCreateParams) => Promise<object>
    /** undefined Contact */
    get: (params: ContactGetParams) => Promise<object>
    /** undefined Contact */
    update: (params: ContactUpdateParams) => Promise<object>
    /** undefined Contact */
    delete: (params: ContactDeleteParams) => Promise<boolean>
    /** undefined Contact */
    list: (params: ContactListParams) => Promise<object>
    /** undefined Contact */
    search: (params: ContactSearchParams) => Promise<array>
  }

  /**
   * Lead resource
   * Lead records for prospective customers
   */
  public lead: {
    /** undefined Lead */
    create: (params: LeadCreateParams) => Promise<object>
    /** undefined Lead */
    get: (params: LeadGetParams) => Promise<object>
    /** undefined Lead */
    update: (params: LeadUpdateParams) => Promise<object>
    /** undefined Lead */
    delete: (params: LeadDeleteParams) => Promise<boolean>
    /** undefined Lead */
    convert: (params: LeadConvertParams) => Promise<object>
    /** undefined Lead */
    list: (params: LeadListParams) => Promise<object>
  }

  /**
   * Opportunity resource
   * Sales opportunity records
   */
  public opportunity: {
    /** undefined Opportunity */
    create: (params: OpportunityCreateParams) => Promise<object>
    /** undefined Opportunity */
    get: (params: OpportunityGetParams) => Promise<object>
    /** undefined Opportunity */
    update: (params: OpportunityUpdateParams) => Promise<object>
    /** undefined Opportunity */
    delete: (params: OpportunityDeleteParams) => Promise<boolean>
    /** undefined Opportunity */
    list: (params: OpportunityListParams) => Promise<object>
  }

  /**
   * Case resource
   * Customer service case records
   */
  public case: {
    /** undefined Case */
    create: (params: CaseCreateParams) => Promise<object>
    /** undefined Case */
    get: (params: CaseGetParams) => Promise<object>
    /** undefined Case */
    update: (params: CaseUpdateParams) => Promise<object>
    /** undefined Case */
    delete: (params: CaseDeleteParams) => Promise<boolean>
    /** undefined Case */
    list: (params: CaseListParams) => Promise<object>
  }

  /**
   * Task resource
   * Activity task records
   */
  public task: {
    /** undefined Task */
    create: (params: TaskCreateParams) => Promise<object>
    /** undefined Task */
    get: (params: TaskGetParams) => Promise<object>
    /** undefined Task */
    update: (params: TaskUpdateParams) => Promise<object>
    /** undefined Task */
    delete: (params: TaskDeleteParams) => Promise<boolean>
    /** undefined Task */
    list: (params: TaskListParams) => Promise<object>
  }

  /**
   * CustomObject resource
   * Generic custom object operations
   */
  public customObject: {
    /** undefined CustomObject */
    create: (params: CustomObjectCreateParams) => Promise<object>
    /** undefined CustomObject */
    get: (params: CustomObjectGetParams) => Promise<object>
    /** undefined CustomObject */
    update: (params: CustomObjectUpdateParams) => Promise<object>
    /** undefined CustomObject */
    delete: (params: CustomObjectDeleteParams) => Promise<boolean>
  }

  /**
   * Query resource
   * SOQL query execution
   */
  public query: {
    /** undefined Query */
    execute: (params: QueryExecuteParams) => Promise<object>
    /** undefined Query */
    queryMore: (params: QueryQueryMoreParams) => Promise<object>
  }

  /**
   * Search resource
   * SOSL search execution
   */
  public search: {
    /** undefined Search */
    execute: (params: SearchExecuteParams) => Promise<array>
  }

  /**
   * Bulk resource
   * Bulk API operations for large datasets
   */
  public bulk: {
    /** undefined Bulk */
    insert: (params: BulkInsertParams) => Promise<array>
    /** undefined Bulk */
    update: (params: BulkUpdateParams) => Promise<array>
    /** undefined Bulk */
    delete: (params: BulkDeleteParams) => Promise<array>
  }

  /**
   * Metadata resource
   * Object and field metadata introspection
   */
  public metadata: {
    /** undefined Metadata */
    describeObject: (params: MetadataDescribeObjectParams) => Promise<object>
    /** undefined Metadata */
    describeGlobal: () => Promise<object>
  }

  constructor(options: SalesforceClientOptions) {
    this.options = {
      baseUrl: 'undefined',
      timeout: 30000,
      retryAttempts: 3,
      ...options,
    }

    // Initialize SDK
    this.sdk = new jsforce({
      accessToken: this.options.accessToken,
    })

    // Initialize resource namespaces
    this.account = {
      create: this.accountCreate.bind(this),
      get: this.accountGet.bind(this),
      update: this.accountUpdate.bind(this),
      delete: this.accountDelete.bind(this),
      list: this.accountList.bind(this),
      search: this.accountSearch.bind(this),
    }
    this.contact = {
      create: this.contactCreate.bind(this),
      get: this.contactGet.bind(this),
      update: this.contactUpdate.bind(this),
      delete: this.contactDelete.bind(this),
      list: this.contactList.bind(this),
      search: this.contactSearch.bind(this),
    }
    this.lead = {
      create: this.leadCreate.bind(this),
      get: this.leadGet.bind(this),
      update: this.leadUpdate.bind(this),
      delete: this.leadDelete.bind(this),
      convert: this.leadConvert.bind(this),
      list: this.leadList.bind(this),
    }
    this.opportunity = {
      create: this.opportunityCreate.bind(this),
      get: this.opportunityGet.bind(this),
      update: this.opportunityUpdate.bind(this),
      delete: this.opportunityDelete.bind(this),
      list: this.opportunityList.bind(this),
    }
    this.case = {
      create: this.caseCreate.bind(this),
      get: this.caseGet.bind(this),
      update: this.caseUpdate.bind(this),
      delete: this.caseDelete.bind(this),
      list: this.caseList.bind(this),
    }
    this.task = {
      create: this.taskCreate.bind(this),
      get: this.taskGet.bind(this),
      update: this.taskUpdate.bind(this),
      delete: this.taskDelete.bind(this),
      list: this.taskList.bind(this),
    }
    this.customObject = {
      create: this.customObjectCreate.bind(this),
      get: this.customObjectGet.bind(this),
      update: this.customObjectUpdate.bind(this),
      delete: this.customObjectDelete.bind(this),
    }
    this.query = {
      execute: this.queryExecute.bind(this),
      queryMore: this.queryQueryMore.bind(this),
    }
    this.search = {
      execute: this.searchExecute.bind(this),
    }
    this.bulk = {
      insert: this.bulkInsert.bind(this),
      update: this.bulkUpdate.bind(this),
      delete: this.bulkDelete.bind(this),
    }
    this.metadata = {
      describeObject: this.metadataDescribeObject.bind(this),
      describeGlobal: this.metadataDescribeGlobal.bind(this),
    }
  }

  /**
   * undefined Account
   * @param params - Operation parameters
   * @returns object
   */
  private async accountCreate(params: AccountCreateParams): Promise<object> {
    try {
      const result = await this.sdk.sobject('Account').create(params)
      return result
    } catch (error) {
      throw SalesforceError.fromError(error)
    }
  }

  /**
   * undefined Account
   * @param params - Operation parameters
   * @returns object
   */
  private async accountGet(params: AccountGetParams): Promise<object> {
    try {
      const result = await this.sdk.sobject('Account').retrieve(params)
      return result
    } catch (error) {
      throw SalesforceError.fromError(error)
    }
  }

  /**
   * undefined Account
   * @param params - Operation parameters
   * @returns object
   */
  private async accountUpdate(params: AccountUpdateParams): Promise<object> {
    try {
      const result = await this.sdk.sobject('Account').update(params)
      return result
    } catch (error) {
      throw SalesforceError.fromError(error)
    }
  }

  /**
   * undefined Account
   * @param params - Operation parameters
   * @returns boolean
   */
  private async accountDelete(params: AccountDeleteParams): Promise<boolean> {
    try {
      const result = await this.sdk.sobject('Account').delete(params)
      return result
    } catch (error) {
      throw SalesforceError.fromError(error)
    }
  }

  /**
   * undefined Account
   * @param params - Operation parameters
   * @returns object
   */
  private async accountList(params: AccountListParams): Promise<object> {
    try {
      const result = await this.sdk.sobject('Account').query(params)
      return result
    } catch (error) {
      throw SalesforceError.fromError(error)
    }
  }

  /**
   * undefined Account
   * @param params - Operation parameters
   * @returns array
   */
  private async accountSearch(params: AccountSearchParams): Promise<array> {
    try {
      const result = await this.sdk.sobject('Account').search(params)
      return result
    } catch (error) {
      throw SalesforceError.fromError(error)
    }
  }

  /**
   * undefined Contact
   * @param params - Operation parameters
   * @returns object
   */
  private async contactCreate(params: ContactCreateParams): Promise<object> {
    try {
      const result = await this.sdk.sobject('Contact').create(params)
      return result
    } catch (error) {
      throw SalesforceError.fromError(error)
    }
  }

  /**
   * undefined Contact
   * @param params - Operation parameters
   * @returns object
   */
  private async contactGet(params: ContactGetParams): Promise<object> {
    try {
      const result = await this.sdk.sobject('Contact').retrieve(params)
      return result
    } catch (error) {
      throw SalesforceError.fromError(error)
    }
  }

  /**
   * undefined Contact
   * @param params - Operation parameters
   * @returns object
   */
  private async contactUpdate(params: ContactUpdateParams): Promise<object> {
    try {
      const result = await this.sdk.sobject('Contact').update(params)
      return result
    } catch (error) {
      throw SalesforceError.fromError(error)
    }
  }

  /**
   * undefined Contact
   * @param params - Operation parameters
   * @returns boolean
   */
  private async contactDelete(params: ContactDeleteParams): Promise<boolean> {
    try {
      const result = await this.sdk.sobject('Contact').delete(params)
      return result
    } catch (error) {
      throw SalesforceError.fromError(error)
    }
  }

  /**
   * undefined Contact
   * @param params - Operation parameters
   * @returns object
   */
  private async contactList(params: ContactListParams): Promise<object> {
    try {
      const result = await this.sdk.sobject('Contact').query(params)
      return result
    } catch (error) {
      throw SalesforceError.fromError(error)
    }
  }

  /**
   * undefined Contact
   * @param params - Operation parameters
   * @returns array
   */
  private async contactSearch(params: ContactSearchParams): Promise<array> {
    try {
      const result = await this.sdk.sobject('Contact').search(params)
      return result
    } catch (error) {
      throw SalesforceError.fromError(error)
    }
  }

  /**
   * undefined Lead
   * @param params - Operation parameters
   * @returns object
   */
  private async leadCreate(params: LeadCreateParams): Promise<object> {
    try {
      const result = await this.sdk.sobject('Lead').create(params)
      return result
    } catch (error) {
      throw SalesforceError.fromError(error)
    }
  }

  /**
   * undefined Lead
   * @param params - Operation parameters
   * @returns object
   */
  private async leadGet(params: LeadGetParams): Promise<object> {
    try {
      const result = await this.sdk.sobject('Lead').retrieve(params)
      return result
    } catch (error) {
      throw SalesforceError.fromError(error)
    }
  }

  /**
   * undefined Lead
   * @param params - Operation parameters
   * @returns object
   */
  private async leadUpdate(params: LeadUpdateParams): Promise<object> {
    try {
      const result = await this.sdk.sobject('Lead').update(params)
      return result
    } catch (error) {
      throw SalesforceError.fromError(error)
    }
  }

  /**
   * undefined Lead
   * @param params - Operation parameters
   * @returns boolean
   */
  private async leadDelete(params: LeadDeleteParams): Promise<boolean> {
    try {
      const result = await this.sdk.sobject('Lead').delete(params)
      return result
    } catch (error) {
      throw SalesforceError.fromError(error)
    }
  }

  /**
   * undefined Lead
   * @param params - Operation parameters
   * @returns object
   */
  private async leadConvert(params: LeadConvertParams): Promise<object> {
    try {
      const result = await this.sdk.sobject('Lead').convertLead(params)
      return result
    } catch (error) {
      throw SalesforceError.fromError(error)
    }
  }

  /**
   * undefined Lead
   * @param params - Operation parameters
   * @returns object
   */
  private async leadList(params: LeadListParams): Promise<object> {
    try {
      const result = await this.sdk.sobject('Lead').query(params)
      return result
    } catch (error) {
      throw SalesforceError.fromError(error)
    }
  }

  /**
   * undefined Opportunity
   * @param params - Operation parameters
   * @returns object
   */
  private async opportunityCreate(params: OpportunityCreateParams): Promise<object> {
    try {
      const result = await this.sdk.sobject('Opportunity').create(params)
      return result
    } catch (error) {
      throw SalesforceError.fromError(error)
    }
  }

  /**
   * undefined Opportunity
   * @param params - Operation parameters
   * @returns object
   */
  private async opportunityGet(params: OpportunityGetParams): Promise<object> {
    try {
      const result = await this.sdk.sobject('Opportunity').retrieve(params)
      return result
    } catch (error) {
      throw SalesforceError.fromError(error)
    }
  }

  /**
   * undefined Opportunity
   * @param params - Operation parameters
   * @returns object
   */
  private async opportunityUpdate(params: OpportunityUpdateParams): Promise<object> {
    try {
      const result = await this.sdk.sobject('Opportunity').update(params)
      return result
    } catch (error) {
      throw SalesforceError.fromError(error)
    }
  }

  /**
   * undefined Opportunity
   * @param params - Operation parameters
   * @returns boolean
   */
  private async opportunityDelete(params: OpportunityDeleteParams): Promise<boolean> {
    try {
      const result = await this.sdk.sobject('Opportunity').delete(params)
      return result
    } catch (error) {
      throw SalesforceError.fromError(error)
    }
  }

  /**
   * undefined Opportunity
   * @param params - Operation parameters
   * @returns object
   */
  private async opportunityList(params: OpportunityListParams): Promise<object> {
    try {
      const result = await this.sdk.sobject('Opportunity').query(params)
      return result
    } catch (error) {
      throw SalesforceError.fromError(error)
    }
  }

  /**
   * undefined Case
   * @param params - Operation parameters
   * @returns object
   */
  private async caseCreate(params: CaseCreateParams): Promise<object> {
    try {
      const result = await this.sdk.sobject('Case').create(params)
      return result
    } catch (error) {
      throw SalesforceError.fromError(error)
    }
  }

  /**
   * undefined Case
   * @param params - Operation parameters
   * @returns object
   */
  private async caseGet(params: CaseGetParams): Promise<object> {
    try {
      const result = await this.sdk.sobject('Case').retrieve(params)
      return result
    } catch (error) {
      throw SalesforceError.fromError(error)
    }
  }

  /**
   * undefined Case
   * @param params - Operation parameters
   * @returns object
   */
  private async caseUpdate(params: CaseUpdateParams): Promise<object> {
    try {
      const result = await this.sdk.sobject('Case').update(params)
      return result
    } catch (error) {
      throw SalesforceError.fromError(error)
    }
  }

  /**
   * undefined Case
   * @param params - Operation parameters
   * @returns boolean
   */
  private async caseDelete(params: CaseDeleteParams): Promise<boolean> {
    try {
      const result = await this.sdk.sobject('Case').delete(params)
      return result
    } catch (error) {
      throw SalesforceError.fromError(error)
    }
  }

  /**
   * undefined Case
   * @param params - Operation parameters
   * @returns object
   */
  private async caseList(params: CaseListParams): Promise<object> {
    try {
      const result = await this.sdk.sobject('Case').query(params)
      return result
    } catch (error) {
      throw SalesforceError.fromError(error)
    }
  }

  /**
   * undefined Task
   * @param params - Operation parameters
   * @returns object
   */
  private async taskCreate(params: TaskCreateParams): Promise<object> {
    try {
      const result = await this.sdk.sobject('Task').create(params)
      return result
    } catch (error) {
      throw SalesforceError.fromError(error)
    }
  }

  /**
   * undefined Task
   * @param params - Operation parameters
   * @returns object
   */
  private async taskGet(params: TaskGetParams): Promise<object> {
    try {
      const result = await this.sdk.sobject('Task').retrieve(params)
      return result
    } catch (error) {
      throw SalesforceError.fromError(error)
    }
  }

  /**
   * undefined Task
   * @param params - Operation parameters
   * @returns object
   */
  private async taskUpdate(params: TaskUpdateParams): Promise<object> {
    try {
      const result = await this.sdk.sobject('Task').update(params)
      return result
    } catch (error) {
      throw SalesforceError.fromError(error)
    }
  }

  /**
   * undefined Task
   * @param params - Operation parameters
   * @returns boolean
   */
  private async taskDelete(params: TaskDeleteParams): Promise<boolean> {
    try {
      const result = await this.sdk.sobject('Task').delete(params)
      return result
    } catch (error) {
      throw SalesforceError.fromError(error)
    }
  }

  /**
   * undefined Task
   * @param params - Operation parameters
   * @returns object
   */
  private async taskList(params: TaskListParams): Promise<object> {
    try {
      const result = await this.sdk.sobject('Task').query(params)
      return result
    } catch (error) {
      throw SalesforceError.fromError(error)
    }
  }

  /**
   * undefined CustomObject
   * @param params - Operation parameters
   * @returns object
   */
  private async customObjectCreate(params: CustomObjectCreateParams): Promise<object> {
    try {
      const result = await this.sdk.sobject.create(params)
      return result
    } catch (error) {
      throw SalesforceError.fromError(error)
    }
  }

  /**
   * undefined CustomObject
   * @param params - Operation parameters
   * @returns object
   */
  private async customObjectGet(params: CustomObjectGetParams): Promise<object> {
    try {
      const result = await this.sdk.sobject.retrieve(params)
      return result
    } catch (error) {
      throw SalesforceError.fromError(error)
    }
  }

  /**
   * undefined CustomObject
   * @param params - Operation parameters
   * @returns object
   */
  private async customObjectUpdate(params: CustomObjectUpdateParams): Promise<object> {
    try {
      const result = await this.sdk.sobject.update(params)
      return result
    } catch (error) {
      throw SalesforceError.fromError(error)
    }
  }

  /**
   * undefined CustomObject
   * @param params - Operation parameters
   * @returns boolean
   */
  private async customObjectDelete(params: CustomObjectDeleteParams): Promise<boolean> {
    try {
      const result = await this.sdk.sobject.delete(params)
      return result
    } catch (error) {
      throw SalesforceError.fromError(error)
    }
  }

  /**
   * undefined Query
   * @param params - Operation parameters
   * @returns object
   */
  private async queryExecute(params: QueryExecuteParams): Promise<object> {
    try {
      const result = await this.sdk.query.query(params)
      return result
    } catch (error) {
      throw SalesforceError.fromError(error)
    }
  }

  /**
   * undefined Query
   * @param params - Operation parameters
   * @returns object
   */
  private async queryQueryMore(params: QueryQueryMoreParams): Promise<object> {
    try {
      const result = await this.sdk.query.queryMore(params)
      return result
    } catch (error) {
      throw SalesforceError.fromError(error)
    }
  }

  /**
   * undefined Search
   * @param params - Operation parameters
   * @returns array
   */
  private async searchExecute(params: SearchExecuteParams): Promise<array> {
    try {
      const result = await this.sdk.search.search(params)
      return result
    } catch (error) {
      throw SalesforceError.fromError(error)
    }
  }

  /**
   * undefined Bulk
   * @param params - Operation parameters
   * @returns array
   */
  private async bulkInsert(params: BulkInsertParams): Promise<array> {
    try {
      const result = await this.sdk.bulk.load.load(params)
      return result
    } catch (error) {
      throw SalesforceError.fromError(error)
    }
  }

  /**
   * undefined Bulk
   * @param params - Operation parameters
   * @returns array
   */
  private async bulkUpdate(params: BulkUpdateParams): Promise<array> {
    try {
      const result = await this.sdk.bulk.load.load(params)
      return result
    } catch (error) {
      throw SalesforceError.fromError(error)
    }
  }

  /**
   * undefined Bulk
   * @param params - Operation parameters
   * @returns array
   */
  private async bulkDelete(params: BulkDeleteParams): Promise<array> {
    try {
      const result = await this.sdk.bulk.load.load(params)
      return result
    } catch (error) {
      throw SalesforceError.fromError(error)
    }
  }

  /**
   * undefined Metadata
   * @param params - Operation parameters
   * @returns object
   */
  private async metadataDescribeObject(params: MetadataDescribeObjectParams): Promise<object> {
    try {
      const result = await this.sdk.describe.describe(params)
      return result
    } catch (error) {
      throw SalesforceError.fromError(error)
    }
  }

  /**
   * undefined Metadata
   * @returns object
   */
  private async metadataDescribeGlobal(): Promise<object> {
    try {
      const result = await this.sdk.describe.describeGlobal()
      return result
    } catch (error) {
      throw SalesforceError.fromError(error)
    }
  }
}
