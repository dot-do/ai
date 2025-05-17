export interface ClientOptions {
  baseUrl?: string
  apiKey?: string
  fetch?: typeof fetch
  ignoreSSLErrors?: boolean
  headers?: Record<string, string>
}

function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost') {
      return 'http://localhost:3000'
    }
    if (window.location.hostname.includes('.sg')) {
      return 'https://apis.do.sg'
    }
  }
  return 'https://apis.do'
}

export class API {
  private baseUrl: string
  private headers: Record<string, string>
  private fetchImpl: typeof fetch

  constructor(options: ClientOptions = {}) {
    this.baseUrl = options.baseUrl || getBaseUrl()
    this.headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    }
    if (options.apiKey) {
      this.headers['Authorization'] = `Bearer ${options.apiKey}`
    }
    this.fetchImpl = options.fetch || fetch
  }

  private async request<T>(path: string, data?: any): Promise<T> {
    const response = await this.fetchImpl(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: this.headers,
      body: data ? JSON.stringify(data) : undefined,
    })

    return response.json() as Promise<T>
  }

  async post<T>(path: string, data?: any): Promise<T> {
    return this.request<T>(path, data)
  }

  async list<T>(collection: string, query?: any): Promise<T> {
    return this.post<T>(`/v1/${collection}/list`, query)
  }

  async getById<T>(collection: string, id: string): Promise<T> {
    return this.post<T>(`/v1/${collection}/get`, { id })
  }

  async create<T>(collection: string, data: any): Promise<T> {
    return this.post<T>(`/v1/${collection}/create`, data)
  }

  async update<T>(collection: string, id: string, data: any): Promise<T> {
    return this.post<T>(`/v1/${collection}/update`, { id, data })
  }

  async remove<T>(collection: string, id: string): Promise<T> {
    return this.post<T>(`/v1/${collection}/delete`, { id })
  }

  async executeWorkflow(workflowId: string, input: Record<string, any>, options?: any): Promise<any> {
    return this.post(`/v1/workflows/${workflowId}/execute`, { input, options })
  }

  async registerWorkflow(workflow: any): Promise<any> {
    return this.post('/v1/workflows/register', { workflow })
  }
}

