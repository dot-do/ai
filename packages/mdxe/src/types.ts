/**
 * MDXE Type Definitions
 */

/**
 * Wrangler configuration that can be embedded in MDXLD frontmatter
 * Based on wrangler.jsonc schema
 */
export interface WranglerConfig {
  // Core configuration
  name?: string
  main?: string
  compatibility_date?: string
  compatibility_flags?: string[]
  account_id?: string
  workers_dev?: boolean
  $schema?: string

  // Observability
  observability?: {
    enabled?: boolean
    head_sampling_rate?: number
  }

  // Bindings
  services?: Array<{
    binding: string
    service: string
    environment?: string
  }>

  durable_objects?: {
    bindings: Array<{
      name: string
      class_name: string
      script_name: string
    }>
  }

  kv_namespaces?: Array<{
    binding: string
    id: string
  }>

  r2_buckets?: Array<{
    binding: string
    bucket_name: string
  }>

  d1_databases?: Array<{
    binding: string
    database_name: string
    database_id: string
  }>

  vectorize?: Array<{
    binding: string
    index_name: string
  }>

  ai?: {
    binding: string
  }

  analytics_engine_datasets?: Array<{
    binding: string
    dataset: string
  }>

  // Worker Loaders
  worker_loaders?: Array<{
    binding: string
  }>

  // Tail consumers
  tail_consumers?: Array<{
    service: string
    environment?: string
  }>

  // Migrations
  migrations?: Array<{
    tag: string
    new_classes?: string[]
    renamed_classes?: Array<{ from: string; to: string }>
    deleted_classes?: string[]
  }>

  // Routes
  routes?: Array<{
    pattern: string
    zone_name?: string
    zone_id?: string
    custom_domain?: boolean
  }>

  // Environment variables
  vars?: Record<string, string>

  // Queues
  queues?: {
    producers?: Array<{
      binding: string
      queue: string
    }>
    consumers?: Array<{
      queue: string
      max_batch_size?: number
      max_batch_timeout?: number
      max_retries?: number
      dead_letter_queue?: string
      retry_delay?: number
    }>
  }

  // Pipelines
  pipelines?: Array<{
    pipeline: string
    binding: string
  }>

  // Workers for Platforms (dispatch namespaces)
  dispatch_namespaces?: Array<{
    binding: string
    namespace: string
  }>

  // Static Assets
  assets?: {
    directory?: string
    binding?: string
    not_found_handling?: 'none' | 'single-page-application' | '404-page'
    html_handling?: 'auto-trailing-slash' | 'force-trailing-slash' | 'drop-trailing-slash' | 'none'
  }

  // Environment-specific config
  env?: Record<string, Partial<WranglerConfig>>
}

/**
 * MDXLD Worker frontmatter
 * Combines linked data properties with wrangler config
 */
export interface WorkerFrontmatter extends WranglerConfig {
  $type: 'Worker'
  $id?: string
  $context?: string | Record<string, string>
}

/**
 * Parsed MDXLD Worker
 */
export interface MDXLDWorker {
  frontmatter: WorkerFrontmatter
  content: string
  filePath: string
}

/**
 * mdxe command options
 */
export interface CommandOptions {
  env?: string
  config?: string
  verbose?: boolean
  dryRun?: boolean
  namespace?: string // Workers for Platforms namespace
  assets?: string // Path to static assets directory
}
