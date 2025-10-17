/**
 * API client for Plans
 */

export class API {
  private baseUrl: string
  private headers: Record<string, string>

  constructor(options: { baseUrl?: string; headers?: Record<string, string> } = {}) {
    this.baseUrl = options.baseUrl || 'https://api.primitives.org.ai'
    this.headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    }
  }

  /**
   * Create a resource
   */
  async create(resource: string, data: any) {
    const response = await fetch(`${this.baseUrl}/${resource}`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`Failed to create ${resource}: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Update a resource
   */
  async update(resource: string, id: string, data: any) {
    const response = await fetch(`${this.baseUrl}/${resource}/${id}`, {
      method: 'PATCH',
      headers: this.headers,
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`Failed to update ${resource}: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Get a resource
   */
  async get(resource: string, id: string) {
    const response = await fetch(`${this.baseUrl}/${resource}/${id}`, {
      method: 'GET',
      headers: this.headers,
    })

    if (!response.ok) {
      throw new Error(`Failed to get ${resource}: ${response.statusText}`)
    }

    return response.json()
  }
}
