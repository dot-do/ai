/**
 * Experiments Service for SDK.do
 *
 * Provides methods for A/B testing, feature flags, and experimentation.
 * Integrates with experiment worker for bucket assignment and event tracking.
 *
 * Data Flow:
 * 1. SDK → Experiment Worker: POST /decide (bucket assignment)
 * 2. Experiment Worker → Analytics Worker: Send assignment event
 * 3. SDK → Experiment Worker: POST /send (conversion/custom events)
 * 4. Analytics Worker → R2: Store event data
 *
 * @example
 * ```typescript
 * import { $ } from 'sdk.do'
 *
 * // Assign user to experiment bucket
 * const decision = await $.experiments.decide('homepage-hero', {
 *   userId: 'user_123',
 *   context: { country: 'US', device: 'mobile' }
 * })
 *
 * if (decision.bucket === 'treatment') {
 *   // Show new hero design
 *   // The variant payload contains the configuration
 *   const config = decision.payload
 * }
 *
 * // Track conversion
 * await $.experiments.send('homepage-hero', 'conversion', {
 *   value: 99.99,
 *   orderId: 'order_456'
 * })
 * ```
 */

// ============================================================================
// TYPES
// ============================================================================

export interface DecideOptions {
  /**
   * User ID for consistent bucketing
   */
  userId?: string

  /**
   * Session ID for anonymous users
   */
  sessionId?: string

  /**
   * Context for targeting rules
   */
  context?: {
    /**
     * User's country code (e.g., 'US', 'UK')
     */
    country?: string

    /**
     * User's city
     */
    city?: string

    /**
     * Device type
     */
    device?: 'mobile' | 'desktop' | 'tablet'

    /**
     * Custom user properties for targeting
     */
    userProperties?: Record<string, any>
  }
}

export interface DecideResponse {
  /**
   * Experiment ID
   */
  experimentId: string

  /**
   * Assigned bucket/variant key
   */
  bucket: string

  /**
   * Whether this is a new assignment
   */
  isNewAssignment: boolean

  /**
   * User ID (if provided or identified)
   */
  userId?: string

  /**
   * Session ID
   */
  sessionId: string

  /**
   * Variant payload/configuration (if using variants)
   */
  payload?: Record<string, unknown>
}

export interface SendEventOptions {
  /**
   * User ID
   */
  userId?: string

  /**
   * Session ID
   */
  sessionId?: string

  /**
   * Event properties
   */
  properties?: Record<string, any>
}

export interface SendEventResponse {
  /**
   * Success status
   */
  success: boolean

  /**
   * Event ID
   */
  eventId: string
}

export interface ExperimentVariant {
  /**
   * Variant key (e.g., 'control', 'treatment', 'treatment_a')
   */
  key: string

  /**
   * Variant display name
   */
  name: string

  /**
   * Traffic allocation (0-100)
   */
  weight: number

  /**
   * Variant configuration payload
   */
  payload?: Record<string, unknown>
}

export interface ExperimentConfig {
  /**
   * Experiment ID
   */
  id: string

  /**
   * Experiment name
   */
  name: string

  /**
   * Experiment description
   */
  description?: string

  /**
   * Experiment status
   */
  status: 'draft' | 'active' | 'paused' | 'completed'

  /**
   * Experiment variants
   */
  variants: ExperimentVariant[]

  /**
   * Targeting rules
   */
  targeting?: {
    /**
     * Include only these countries
     */
    countries?: string[]

    /**
     * Include only these devices
     */
    devices?: Array<'mobile' | 'desktop' | 'tablet'>

    /**
     * Custom targeting rules
     */
    rules?: Record<string, any>
  }

  /**
   * Experiment start date
   */
  startDate?: string

  /**
   * Experiment end date
   */
  endDate?: string

  /**
   * Traffic allocation (percentage of users to include)
   */
  trafficAllocation?: number

  /**
   * Created timestamp
   */
  createdAt: string

  /**
   * Updated timestamp
   */
  updatedAt: string
}

export interface ExperimentSession {
  /**
   * Session ID
   */
  sessionId: string

  /**
   * User ID (if identified)
   */
  userId?: string

  /**
   * Experiment assignments
   */
  assignments: ExperimentAssignment[]

  /**
   * Session created timestamp
   */
  createdAt: number

  /**
   * Last accessed timestamp
   */
  lastAccessedAt: number
}

export interface ExperimentAssignment {
  /**
   * Experiment ID
   */
  experimentId: string

  /**
   * Assigned bucket
   */
  bucket: string

  /**
   * Assignment timestamp
   */
  assignedAt: number
}

export interface ExperimentResults {
  /**
   * Experiment ID
   */
  experimentId: string

  /**
   * Results by variant
   */
  variants: Array<{
    /**
     * Variant key
     */
    key: string

    /**
     * Total assignments
     */
    assignments: number

    /**
     * Total conversions
     */
    conversions: number

    /**
     * Conversion rate
     */
    conversionRate: number

    /**
     * Total revenue (if applicable)
     */
    revenue?: number

    /**
     * Average order value (if applicable)
     */
    averageOrderValue?: number

    /**
     * Custom metrics
     */
    metrics?: Record<string, number>
  }>

  /**
   * Statistical significance
   */
  significance?: {
    /**
     * P-value
     */
    pValue: number

    /**
     * Is statistically significant
     */
    isSignificant: boolean

    /**
     * Confidence level (e.g., 0.95 for 95%)
     */
    confidence: number
  }

  /**
   * Winner (if determined)
   */
  winner?: string

  /**
   * Results timestamp
   */
  timestamp: string
}

export interface ListExperimentsOptions {
  /**
   * Filter by status
   */
  status?: 'draft' | 'active' | 'paused' | 'completed'

  /**
   * Limit results
   */
  limit?: number

  /**
   * Pagination offset
   */
  offset?: number
}

export interface ListExperimentsResponse {
  /**
   * Success status
   */
  success: boolean

  /**
   * Experiments
   */
  experiments: ExperimentConfig[]

  /**
   * Total count
   */
  total: number

  /**
   * Limit
   */
  limit: number

  /**
   * Offset
   */
  offset: number
}

// ============================================================================
// EXPERIMENTS SERVICE
// ============================================================================

export class ExperimentsService {
  private baseUrl: string
  private apiKey?: string

  constructor(baseUrl = 'https://experiment.do', apiKey?: string) {
    this.baseUrl = baseUrl
    this.apiKey = apiKey
  }

  /**
   * Get authorization headers for authenticated requests
   */
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`
    }

    return headers
  }

  /**
   * Assign user to experiment bucket
   *
   * @param experimentId - Experiment ID
   * @param options - Decision options
   * @returns Bucket assignment with variant payload
   *
   * @example
   * ```typescript
   * // Assign user to experiment
   * const decision = await $.experiments.decide('homepage-hero', {
   *   userId: 'user_123',
   *   context: {
   *     country: 'US',
   *     device: 'mobile'
   *   }
   * })
   *
   * if (decision.bucket === 'treatment') {
   *   // Show treatment variant
   *   const config = decision.payload
   * }
   * ```
   */
  async decide(experimentId: string, options: DecideOptions = {}): Promise<DecideResponse> {
    const response = await fetch(`${this.baseUrl}/decide`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        experimentId,
        ...options,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to decide experiment: ${error}`)
    }

    return response.json()
  }

  /**
   * Track experiment event (conversion, custom event)
   *
   * @param experimentId - Experiment ID
   * @param eventType - Event type ('conversion' or 'custom')
   * @param options - Event options
   * @returns Event tracking response
   *
   * @example
   * ```typescript
   * // Track conversion
   * await $.experiments.send('homepage-hero', 'conversion', {
   *   properties: {
   *     value: 99.99,
   *     orderId: 'order_456'
   *   }
   * })
   *
   * // Track custom event
   * await $.experiments.send('homepage-hero', 'custom', {
   *   properties: {
   *     buttonClicked: 'signup',
   *     page: '/pricing'
   *   }
   * })
   * ```
   */
  async send(experimentId: string, eventType: 'conversion' | 'custom', options: SendEventOptions = {}): Promise<SendEventResponse> {
    const response = await fetch(`${this.baseUrl}/send`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        experimentId,
        type: eventType,
        ...options,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to send experiment event: ${error}`)
    }

    return response.json()
  }

  /**
   * Get experiment configuration
   *
   * @param experimentId - Experiment ID
   * @returns Experiment configuration
   *
   * @example
   * ```typescript
   * const experiment = await $.experiments.get('homepage-hero')
   * console.log(experiment.name) // 'Homepage Hero Test'
   * console.log(experiment.variants) // [{ key: 'control', ... }, { key: 'treatment', ... }]
   * ```
   */
  async get(experimentId: string): Promise<ExperimentConfig> {
    const response = await fetch(`${this.baseUrl}/api/experiments/${experimentId}`, {
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Experiment not found: ${experimentId}`)
      }
      const error = await response.text()
      throw new Error(`Failed to get experiment: ${error}`)
    }

    return response.json()
  }

  /**
   * List all experiments
   *
   * @param options - List options
   * @returns List of experiments
   *
   * @example
   * ```typescript
   * // List all active experiments
   * const { experiments } = await $.experiments.list({ status: 'active' })
   *
   * // List with pagination
   * const { experiments, total } = await $.experiments.list({
   *   limit: 20,
   *   offset: 0
   * })
   * ```
   */
  async list(options: ListExperimentsOptions = {}): Promise<ListExperimentsResponse> {
    const params = new URLSearchParams()

    if (options.status) params.set('status', options.status)
    if (options.limit) params.set('limit', options.limit.toString())
    if (options.offset) params.set('offset', options.offset.toString())

    const response = await fetch(`${this.baseUrl}/api/experiments?${params}`, {
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      throw new Error(`Failed to list experiments: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Create a new experiment
   *
   * @param config - Experiment configuration
   * @returns Created experiment
   *
   * @example
   * ```typescript
   * const experiment = await $.experiments.create({
   *   name: 'Pricing Page Test',
   *   description: 'Test new pricing layout',
   *   variants: [
   *     { key: 'control', name: 'Current Layout', weight: 50 },
   *     { key: 'treatment', name: 'New Layout', weight: 50 }
   *   ],
   *   targeting: {
   *     countries: ['US', 'UK', 'CA'],
   *     devices: ['desktop', 'mobile']
   *   },
   *   trafficAllocation: 100
   * })
   * ```
   */
  async create(config: Omit<ExperimentConfig, 'id' | 'createdAt' | 'updatedAt'>): Promise<ExperimentConfig> {
    const response = await fetch(`${this.baseUrl}/api/experiments`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(config),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to create experiment: ${error}`)
    }

    return response.json()
  }

  /**
   * Update experiment configuration
   *
   * @param experimentId - Experiment ID
   * @param updates - Partial experiment configuration
   * @returns Updated experiment
   *
   * @example
   * ```typescript
   * await $.experiments.update('homepage-hero', {
   *   status: 'active',
   *   trafficAllocation: 50
   * })
   * ```
   */
  async update(experimentId: string, updates: Partial<Omit<ExperimentConfig, 'id' | 'createdAt' | 'updatedAt'>>): Promise<ExperimentConfig> {
    const response = await fetch(`${this.baseUrl}/api/experiments/${experimentId}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(updates),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to update experiment: ${error}`)
    }

    return response.json()
  }

  /**
   * Delete an experiment
   *
   * @param experimentId - Experiment ID
   *
   * @example
   * ```typescript
   * await $.experiments.delete('old-experiment-id')
   * ```
   */
  async delete(experimentId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/experiments/${experimentId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to delete experiment: ${error}`)
    }
  }

  /**
   * Activate an experiment (set status to 'active')
   *
   * @param experimentId - Experiment ID
   * @returns Updated experiment
   *
   * @example
   * ```typescript
   * await $.experiments.activate('homepage-hero')
   * ```
   */
  async activate(experimentId: string): Promise<ExperimentConfig> {
    return this.update(experimentId, { status: 'active' })
  }

  /**
   * Pause an experiment (set status to 'paused')
   *
   * @param experimentId - Experiment ID
   * @returns Updated experiment
   *
   * @example
   * ```typescript
   * await $.experiments.pause('homepage-hero')
   * ```
   */
  async pause(experimentId: string): Promise<ExperimentConfig> {
    return this.update(experimentId, { status: 'paused' })
  }

  /**
   * Complete an experiment (set status to 'completed')
   *
   * @param experimentId - Experiment ID
   * @returns Updated experiment
   *
   * @example
   * ```typescript
   * await $.experiments.complete('homepage-hero')
   * ```
   */
  async complete(experimentId: string): Promise<ExperimentConfig> {
    return this.update(experimentId, { status: 'completed' })
  }

  /**
   * Get experiment results
   *
   * @param experimentId - Experiment ID
   * @returns Experiment results with statistics
   *
   * @example
   * ```typescript
   * const results = await $.experiments.results('homepage-hero')
   * console.log(results.variants)
   * // [
   * //   { key: 'control', assignments: 1000, conversions: 50, conversionRate: 0.05 },
   * //   { key: 'treatment', assignments: 1000, conversions: 75, conversionRate: 0.075 }
   * // ]
   * console.log(results.winner) // 'treatment'
   * ```
   */
  async results(experimentId: string): Promise<ExperimentResults> {
    const response = await fetch(`${this.baseUrl}/api/experiments/${experimentId}/results`, {
      headers: this.getHeaders(),
    })

    if (!response.ok) {
      throw new Error(`Failed to get experiment results: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Get winners from experiment results
   *
   * @param experimentId - Experiment ID
   * @returns Winning variant(s)
   *
   * @example
   * ```typescript
   * const winners = await $.experiments.winners('homepage-hero')
   * console.log(winners) // ['treatment']
   * ```
   */
  async winners(experimentId: string): Promise<string[]> {
    const results = await this.results(experimentId)

    if (results.winner) {
      return [results.winner]
    }

    // If no explicit winner, return variants sorted by conversion rate
    return results.variants
      .sort((a, b) => b.conversionRate - a.conversionRate)
      .slice(0, 1)
      .map((v) => v.key)
  }

  /**
   * Get current user's session and assignments
   *
   * @returns Current experiment session
   *
   * @example
   * ```typescript
   * const session = await $.experiments.session()
   * console.log(session.assignments)
   * // [
   * //   { experimentId: 'homepage-hero', bucket: 'treatment', assignedAt: 1234567890 }
   * // ]
   * ```
   */
  async session(): Promise<ExperimentSession | null> {
    const response = await fetch(`${this.baseUrl}/session`, {
      headers: this.getHeaders(),
      credentials: 'include', // Include cookies for session
    })

    if (!response.ok) {
      throw new Error(`Failed to get session: ${response.statusText}`)
    }

    const data = await response.json()
    return data.session || null
  }

  /**
   * Helper method to check if user is in treatment for an experiment
   *
   * @param experimentId - Experiment ID
   * @param treatmentBucket - Treatment bucket name (default: 'treatment')
   * @returns True if user is in treatment
   *
   * @example
   * ```typescript
   * if (await $.experiments.isInTreatment('homepage-hero')) {
   *   // Show new design
   * } else {
   *   // Show control
   * }
   * ```
   */
  async isInTreatment(experimentId: string, treatmentBucket = 'treatment'): Promise<boolean> {
    const decision = await this.decide(experimentId)
    return decision.bucket === treatmentBucket
  }

  /**
   * Helper method to track conversion with value
   *
   * @param experimentId - Experiment ID
   * @param value - Conversion value (e.g., order total)
   * @param properties - Additional properties
   * @returns Send event response
   *
   * @example
   * ```typescript
   * await $.experiments.conversion('homepage-hero', 99.99, {
   *   orderId: 'order_456',
   *   currency: 'USD'
   * })
   * ```
   */
  async conversion(experimentId: string, value: number, properties?: Record<string, any>): Promise<SendEventResponse> {
    return this.send(experimentId, 'conversion', {
      properties: {
        value,
        ...properties,
      },
    })
  }
}

/**
 * Create experiments service instance
 */
export function createExperimentsService(baseUrl?: string, apiKey?: string): ExperimentsService {
  return new ExperimentsService(baseUrl, apiKey)
}

/**
 * Default experiments service instance
 */
export const experiments = createExperimentsService()
