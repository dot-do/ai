interface ClientOptions {
  baseUrl?: string;
  apiKey?: string;
}

export class API {
  private baseUrl: string;
  private apiKey?: string;

  constructor(options: ClientOptions = {}) {
    this.baseUrl = options.baseUrl || 'https://apis.do';
    this.apiKey = options.apiKey;
  }

  /**
   * Execute a workflow
   */
  async executeWorkflow(workflowId: string, input: Record<string, any>, options?: any): Promise<any> {
    return this.post(`/v1/workflows/${workflowId}/execute`, { input, options });
  }

  /**
   * Register a workflow
   */
  async registerWorkflow(workflow: any): Promise<any> {
    return this.post('/v1/workflows/register', { workflow });
  }

  /**
   * List items in a collection
   */
  async list(collection: string, query: any = {}): Promise<any> {
    return this.get(`/v1/${collection}`, query);
  }

  /**
   * Get an item by ID
   */
  async getById(collection: string, id: string): Promise<any> {
    return this.get(`/v1/${collection}/${id}`);
  }

  /**
   * Create a new item
   */
  async create(collection: string, data: any): Promise<any> {
    return this.post(`/v1/${collection}`, data);
  }

  /**
   * Update an item
   */
  async update(collection: string, id: string, data: any): Promise<any> {
    return this.post(`/v1/${collection}/${id}`, data);
  }

  /**
   * Remove an item
   */
  async remove(collection: string, id: string): Promise<any> {
    return this.post(`/v1/${collection}/${id}/delete`, {});
  }

  /**
   * Make a GET request
   */
  async get<T = any>(path: string, params?: Record<string, string | number | boolean>): Promise<T> {
    const url = new URL(`${this.baseUrl}${path}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }
    
    const response = await fetch(url.toString(), { headers });
    return response.json();
  }

  /**
   * Make a POST request
   */
  async post<T = any>(path: string, data?: Record<string, unknown>): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }
    
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data || {}),
    });
    return response.json();
  }
}
