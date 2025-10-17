/**
 * SurveyMonkey Types
 *
 * Auto-generated TypeScript types for SurveyMonkey Integration.
 * Generated from MDXLD Integration definition.
 *
 * @see https://integrations.do/surveymonkey
 */

/**
 * SurveyMonkey client options
 */
export interface SurveymonkeyClientOptions {
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
 * Survey resource types
 */
/**
 * Parameters for Survey.create
 */
export interface SurveyCreateParams {
  /** Survey title */
  title: string
}

/**
 * Parameters for Survey.get
 */
export interface SurveyGetParams {
  /** Survey ID */
  survey_id: string
}

/**
 * Parameters for Survey.update
 */
export interface SurveyUpdateParams {
  /** Survey ID */
  survey_id: string
  /** Updated title */
  title?: string
}

/**
 * Parameters for Survey.delete
 */
export interface SurveyDeleteParams {
  /** Survey ID */
  survey_id: string
}

/**
 * Parameters for Survey.list
 */
export interface SurveyListParams {
  /** Results per page */
  per_page?: number
}

/**
 * Response resource types
 */
/**
 * Parameters for Response.get
 */
export interface ResponseGetParams {
  /** Survey ID */
  survey_id: string
  /** Response ID */
  response_id: string
}

/**
 * Parameters for Response.list
 */
export interface ResponseListParams {
  /** Survey ID */
  survey_id: string
  /** Results per page */
  per_page?: number
}
