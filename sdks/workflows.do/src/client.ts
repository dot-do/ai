interface ClientOptions {
  baseUrl?: string;
}

export class API {
  private baseUrl: string;

  constructor(options: ClientOptions = {}) {
    this.baseUrl = options.baseUrl || 'https://apis.do';
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
   * Make a GET request
   */
  async get<T = any>(path: string, params?: Record<string, string | number | boolean>): Promise<T> {
    const url = new URL(`${this.baseUrl}${path}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }
    const response = await fetch(url.toString());
    return response.json();
  }

  /**
   * Make a POST request
   */
  async post<T = any>(path: string, data?: Record<string, unknown>): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data || {}),
    });
    return response.json();
  }
}
