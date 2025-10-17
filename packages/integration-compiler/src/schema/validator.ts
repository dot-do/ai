/**
 * Integration Schema Validator
 *
 * Zod schemas for runtime validation of Integration definitions.
 * These schemas validate the structure and types of Integration
 * metadata extracted from MDX frontmatter.
 */

import { z } from 'zod'

/**
 * Integration category schema
 */
export const integrationCategorySchema = z.enum([
  'payments',
  'crm',
  'communication',
  'storage',
  'analytics',
  'accounting',
  'marketing',
  'support',
  'developer-tools',
  'productivity',
  'ecommerce',
  'hr',
  'logistics',
])

/**
 * OAuth2 configuration schema
 */
export const oauth2ConfigSchema = z.object({
  authorizationUrl: z.string().url(),
  tokenUrl: z.string().url(),
  scopes: z.array(z.string()),
  grantType: z.enum(['authorization_code', 'client_credentials', 'password', 'refresh_token']).optional(),
})

/**
 * Authentication configuration schema
 */
export const authConfigSchema = z.object({
  type: z.enum(['api-key', 'oauth2', 'jwt', 'basic']),
  location: z.enum(['header', 'query', 'body']).optional(),
  headerName: z.string().optional(),
  queryParam: z.string().optional(),
  scheme: z.string().optional(),
  oauth2: oauth2ConfigSchema.optional(),
})

/**
 * Parameter validation schema
 */
export const paramValidationSchema = z.object({
  min: z.number().optional(),
  max: z.number().optional(),
  pattern: z.string().optional(),
  enum: z.array(z.string()).optional(),
})

/**
 * Parameter configuration schema
 */
export const paramConfigSchema = z.object({
  name: z.string(),
  type: z.string(), // Accept any type string (primitives or SDK types)
  required: z.boolean().optional(),
  description: z.string().optional(),
  default: z.any().optional(),
  validation: paramValidationSchema.optional(),
})

/**
 * Pagination configuration schema
 */
export const paginationConfigSchema = z.object({
  type: z.enum(['offset', 'cursor', 'page']),
  limitParam: z.string().optional(),
  offsetParam: z.string().optional(),
  cursorParam: z.string().optional(),
  pageParam: z.string().optional(),
  defaultLimit: z.number().optional(),
  maxLimit: z.number().optional(),
})

/**
 * Test step expects schema
 */
export const testStepExpectsSchema = z.object({
  status: z.number().optional(),
  fields: z.record(z.any()).optional(),
  count: z.number().optional(),
})

/**
 * Test step schema
 */
export const testStepSchema = z.object({
  action: z.enum(['create', 'retrieve', 'update', 'delete', 'list', 'assert', 'custom']),
  resource: z.string().optional(),
  params: z.record(z.any()).optional(),
  expects: testStepExpectsSchema.optional(),
})

/**
 * Operation definition schema
 * Supports both REST API (method=HTTP verb, path required) and SDK (method=SDK method name)
 */
export const operationSchema = z.object({
  name: z.string(), // Operation name (required)
  type: z.enum(['create', 'retrieve', 'update', 'delete', 'list', 'custom']).optional(),
  method: z.string().optional(), // HTTP method (GET/POST) or SDK method name (create/retrieve)
  path: z.string().optional(), // REST API path (required for REST, not for SDK)
  description: z.string().optional(),
  params: z.array(paramConfigSchema).optional(),
  pagination: paginationConfigSchema.optional(),
  returns: z.string().optional(),
})

/**
 * Resource definition schema
 * Supports both REST API (endpoint required) and SDK (sdkPath required)
 */
export const resourceSchema = z.object({
  name: z.string(),
  plural: z.string().optional(),
  endpoint: z.string().optional(), // REST API endpoint (required for REST)
  sdkPath: z.string().optional(), // SDK path (required for SDK)
  description: z.string().optional(),
  operations: z.array(operationSchema),
})

/**
 * Rate limit configuration schema
 */
export const rateLimitConfigSchema = z.object({
  requestsPerSecond: z.number().optional(),
  requestsPerMinute: z.number().optional(),
  requestsPerHour: z.number().optional(),
  burstSize: z.number().optional(),
  retryAfterHeader: z.string().optional(),
})

/**
 * Webhook event schema
 */
export const webhookEventSchema = z.object({
  name: z.string(),
  type: z.string(),
  description: z.string().optional(),
  payloadSchema: z.string().optional(),
})

/**
 * Webhook configuration schema
 */
export const webhookConfigSchema = z.object({
  enabled: z.boolean(),
  signatureHeader: z.string().optional(),
  signatureAlgorithm: z.enum(['sha1', 'sha256', 'sha512', 'md5', 'ed25519']).optional(),
  events: z.array(webhookEventSchema),
  verificationMethod: z.enum(['signature', 'secret', 'none']).optional(),
})

/**
 * Error mapping schema
 */
export const errorMappingSchema = z.object({
  code: z.union([z.string(), z.number()]),
  statusCode: z.number().optional(),
  type: z.enum(['authentication', 'authorization', 'validation', 'not_found', 'rate_limit', 'server', 'network', 'unknown']),
  message: z.string().optional(),
  retryable: z.boolean().optional(),
})

/**
 * Error configuration schema
 */
export const errorConfigSchema = z.object({
  mapping: z.array(errorMappingSchema),
  retryable: z.array(z.union([z.string(), z.number()])).optional(),
  nonRetryable: z.array(z.union([z.string(), z.number()])).optional(),
})

/**
 * Test scenario schema
 */
export const testScenarioSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  steps: z.array(testStepSchema),
  skipIf: z.string().optional(),
})

/**
 * Test configuration schema
 */
export const testConfigSchema = z.object({
  enabled: z.boolean(),
  scenarios: z.array(testScenarioSchema),
  cleanup: z.boolean().optional(),
})

/**
 * Documentation configuration schema
 */
export const docsConfigSchema = z.object({
  apiReference: z.string().optional(),
  authentication: z.string().optional(),
  webhooks: z.string().optional(),
  rateLimits: z.string().optional(),
  examples: z.string().optional(),
})

/**
 * Main Integration schema
 * Supports both REST API and SDK-based integrations
 */
export const integrationSchema = z.object({
  $id: z.string().url(),
  $type: z.literal('Integration'),
  name: z.string(),
  service: z.string(),
  category: integrationCategorySchema,
  description: z.string(),
  auth: authConfigSchema,
  sdkBased: z.boolean().optional(), // If true, uses SDK wrapper pattern
  sdkPackage: z.string().optional(), // NPM package name
  sdkVersion: z.string().optional(), // Version constraint
  sdkImport: z.string().optional(), // Import name
  baseUrl: z.string().url().optional(), // Required for REST, optional for SDK
  apiVersion: z.string().optional(), // API version string
  resources: z.array(resourceSchema),
  rateLimit: rateLimitConfigSchema.optional(),
  webhooks: webhookConfigSchema.optional(),
  errors: errorConfigSchema.optional(),
  tests: testConfigSchema.optional(),
  docs: docsConfigSchema.optional(),
})

/**
 * Type inference from schema
 */
export type IntegrationSchema = z.infer<typeof integrationSchema>

/**
 * Validate an Integration definition
 *
 * @param data - The data to validate
 * @returns Validated Integration
 * @throws ZodError if validation fails
 */
export function validateIntegration(data: unknown): IntegrationSchema {
  return integrationSchema.parse(data)
}

/**
 * Safely validate an Integration definition
 *
 * @param data - The data to validate
 * @returns Success result with data or error result with issues
 */
export function safeValidateIntegration(data: unknown) {
  return integrationSchema.safeParse(data)
}
