/**
 * Salesforce Types
 *
 * Auto-generated TypeScript types for Salesforce Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/salesforce
 */

/**
 * Salesforce client options
 */
export interface SalesforceClientOptions {
  /** OAuth2 access token */
  accessToken: string
  /** Base URL override (optional) */
  baseUrl?: string
  /** Request timeout in milliseconds (optional) */
  timeout?: number
  /** Number of retry attempts (optional) */
  retryAttempts?: number
}

/**
 * Account resource types
 */
/**
 * Parameters for Account.create
 */
export interface AccountCreateParams {
  /** Account creation parameters (Name, Type, Industry, etc.) */
  params: Record<string, any>
}

/**
 * Parameters for Account.get
 */
export interface AccountGetParams {
  /** Account ID (18-character Salesforce ID) */
  id: string
}

/**
 * Parameters for Account.update
 */
export interface AccountUpdateParams {
  /** Account ID */
  id: string
  /** Update parameters */
  params: Record<string, any>
}

/**
 * Parameters for Account.delete
 */
export interface AccountDeleteParams {
  /** Account ID */
  id: string
}

/**
 * Parameters for Account.list
 */
export interface AccountListParams {
  /** List options (type, industry, limit, orderBy, etc.) */
  options?: Record<string, any>
}

/**
 * Parameters for Account.search
 */
export interface AccountSearchParams {
  /** Search term for SOSL query */
  searchTerm: string
}

/**
 * Contact resource types
 */
/**
 * Parameters for Contact.create
 */
export interface ContactCreateParams {
  /** Contact creation parameters (FirstName, LastName, Email, AccountId, etc.) */
  params: Record<string, any>
}

/**
 * Parameters for Contact.get
 */
export interface ContactGetParams {
  /** Contact ID */
  id: string
}

/**
 * Parameters for Contact.update
 */
export interface ContactUpdateParams {
  /** Contact ID */
  id: string
  /** Update parameters */
  params: Record<string, any>
}

/**
 * Parameters for Contact.delete
 */
export interface ContactDeleteParams {
  /** Contact ID */
  id: string
}

/**
 * Parameters for Contact.list
 */
export interface ContactListParams {
  /** List options (accountId, limit, orderBy, etc.) */
  options?: Record<string, any>
}

/**
 * Parameters for Contact.search
 */
export interface ContactSearchParams {
  /** Search term for SOSL query */
  searchTerm: string
}

/**
 * Lead resource types
 */
/**
 * Parameters for Lead.create
 */
export interface LeadCreateParams {
  /** Lead creation parameters (FirstName, LastName, Company, Status, etc.) */
  params: Record<string, any>
}

/**
 * Parameters for Lead.get
 */
export interface LeadGetParams {
  /** Lead ID */
  id: string
}

/**
 * Parameters for Lead.update
 */
export interface LeadUpdateParams {
  /** Lead ID */
  id: string
  /** Update parameters */
  params: Record<string, any>
}

/**
 * Parameters for Lead.delete
 */
export interface LeadDeleteParams {
  /** Lead ID */
  id: string
}

/**
 * Parameters for Lead.convert
 */
export interface LeadConvertParams {
  /** Lead conversion options (leadId, convertedStatus, doNotCreateOpportunity, etc.) */
  options: Record<string, any>
}

/**
 * Parameters for Lead.list
 */
export interface LeadListParams {
  /** List options (status, rating, limit, orderBy, etc.) */
  options?: Record<string, any>
}

/**
 * Opportunity resource types
 */
/**
 * Parameters for Opportunity.create
 */
export interface OpportunityCreateParams {
  /** Opportunity creation parameters (Name, AccountId, StageName, CloseDate, Amount, etc.) */
  params: Record<string, any>
}

/**
 * Parameters for Opportunity.get
 */
export interface OpportunityGetParams {
  /** Opportunity ID */
  id: string
}

/**
 * Parameters for Opportunity.update
 */
export interface OpportunityUpdateParams {
  /** Opportunity ID */
  id: string
  /** Update parameters */
  params: Record<string, any>
}

/**
 * Parameters for Opportunity.delete
 */
export interface OpportunityDeleteParams {
  /** Opportunity ID */
  id: string
}

/**
 * Parameters for Opportunity.list
 */
export interface OpportunityListParams {
  /** List options (accountId, stageName, limit, orderBy, etc.) */
  options?: Record<string, any>
}

/**
 * Case resource types
 */
/**
 * Parameters for Case.create
 */
export interface CaseCreateParams {
  /** Case creation parameters (Subject, Description, Status, Priority, AccountId, etc.) */
  params: Record<string, any>
}

/**
 * Parameters for Case.get
 */
export interface CaseGetParams {
  /** Case ID */
  id: string
}

/**
 * Parameters for Case.update
 */
export interface CaseUpdateParams {
  /** Case ID */
  id: string
  /** Update parameters */
  params: Record<string, any>
}

/**
 * Parameters for Case.delete
 */
export interface CaseDeleteParams {
  /** Case ID */
  id: string
}

/**
 * Parameters for Case.list
 */
export interface CaseListParams {
  /** List options (accountId, status, priority, limit, orderBy, etc.) */
  options?: Record<string, any>
}

/**
 * Task resource types
 */
/**
 * Parameters for Task.create
 */
export interface TaskCreateParams {
  /** Task creation parameters (Subject, Status, Priority, ActivityDate, WhoId, WhatId, etc.) */
  params: Record<string, any>
}

/**
 * Parameters for Task.get
 */
export interface TaskGetParams {
  /** Task ID */
  id: string
}

/**
 * Parameters for Task.update
 */
export interface TaskUpdateParams {
  /** Task ID */
  id: string
  /** Update parameters */
  params: Record<string, any>
}

/**
 * Parameters for Task.delete
 */
export interface TaskDeleteParams {
  /** Task ID */
  id: string
}

/**
 * Parameters for Task.list
 */
export interface TaskListParams {
  /** List options (status, priority, limit, orderBy, etc.) */
  options?: Record<string, any>
}

/**
 * CustomObject resource types
 */
/**
 * Parameters for CustomObject.create
 */
export interface CustomObjectCreateParams {
  /** Custom object API name (e.g., 'CustomObject__c') */
  objectType: string
  /** Record data */
  params: Record<string, any>
}

/**
 * Parameters for CustomObject.get
 */
export interface CustomObjectGetParams {
  /** Custom object API name */
  objectType: string
  /** Record ID */
  id: string
}

/**
 * Parameters for CustomObject.update
 */
export interface CustomObjectUpdateParams {
  /** Custom object API name */
  objectType: string
  /** Record ID */
  id: string
  /** Record data */
  params: Record<string, any>
}

/**
 * Parameters for CustomObject.delete
 */
export interface CustomObjectDeleteParams {
  /** Custom object API name */
  objectType: string
  /** Record ID */
  id: string
}

/**
 * Query resource types
 */
/**
 * Parameters for Query.execute
 */
export interface QueryExecuteParams {
  /** SOQL query string */
  soql: string
}

/**
 * Parameters for Query.queryMore
 */
export interface QueryQueryMoreParams {
  /** Next records URL from previous query result */
  nextRecordsUrl: string
}

/**
 * Search resource types
 */
/**
 * Parameters for Search.execute
 */
export interface SearchExecuteParams {
  /** SOSL search string */
  sosl: string
}

/**
 * Bulk resource types
 */
/**
 * Parameters for Bulk.insert
 */
export interface BulkInsertParams {
  /** Object type */
  objectType: string
  /** Array of records to insert (up to 10,000) */
  records: any[]
}

/**
 * Parameters for Bulk.update
 */
export interface BulkUpdateParams {
  /** Object type */
  objectType: string
  /** Array of records to update */
  records: any[]
}

/**
 * Parameters for Bulk.delete
 */
export interface BulkDeleteParams {
  /** Object type */
  objectType: string
  /** Array of records with IDs to delete */
  records: any[]
}

/**
 * Metadata resource types
 */
/**
 * Parameters for Metadata.describeObject
 */
export interface MetadataDescribeObjectParams {
  /** Object type to describe */
  objectType: string
}

/**
 * SDK type re-exports
 */
export type * from 'jsforce'
