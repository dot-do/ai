/**
 * .do domain categories
 */
export type DomainCategory =
  | 'Function'
  | 'Data Layer'
  | 'Workflow'
  | 'Agent'
  | 'Gateway'
  | 'Data Model'
  | 'Event/Trigger'
  | 'Query/Search'
  | 'Action'
  | 'Evaluation'
  | 'Analytics'
  | 'Experimentation'
  | 'Integration'
  | 'Model Management'
  | 'API Gateway'
  | 'CMS/Admin UI'
  | 'Business Goal'
  | 'Platform/Brand'
  | 'Utility'
  | 'Content/Resource'
  | 'Infra'
  | 'Dev Tool'
  | 'Business Metric'
  | 'Security/Auth'
  | 'Admin UI'
  | 'Human'
  | 'Data/Infra'
  | 'Infra/Utility'
  | 'Data/Utility'

/**
 * Domain definition
 */
export interface Domain {
  /**
   * Domain name (e.g., "functions.do")
   */
  domain: string

  /**
   * Category of the domain
   */
  category: DomainCategory

  /**
   * Description of what the domain does
   */
  description: string

  /**
   * API endpoint for this domain (if available)
   */
  apiEndpoint?: string
}

/**
 * Industry/service definition
 */
export interface Industry {
  /**
   * Industry name
   */
  name: string

  /**
   * Associated domains
   */
  domains: string[]

  /**
   * Category
   */
  category: DomainCategory

  /**
   * Description
   */
  description: string
}

/**
 * Service definition with API integration
 */
export interface Service {
  /**
   * Service name
   */
  name: string

  /**
   * Domain(s) this service operates on
   */
  domains: string[]

  /**
   * API endpoint
   */
  endpoint: string

  /**
   * HTTP methods supported
   */
  methods?: ('GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH')[]

  /**
   * Description
   */
  description?: string
}
