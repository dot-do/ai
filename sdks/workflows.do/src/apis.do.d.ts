declare module 'apis.do' {
  export interface ClientOptions {
    baseUrl?: string;
    apiKey?: string;
    fetch?: typeof fetch;
    ignoreSSLErrors?: boolean;
    headers?: Record<string, string>;
  }

  export class API {
    constructor(options?: ClientOptions);
    post(path: string, data?: any): Promise<any>;
    list(collection: string, query?: any): Promise<any>;
    getById(collection: string, id: string): Promise<any>;
    create(collection: string, data: any): Promise<any>;
    update(collection: string, id: string, data: any): Promise<any>;
    remove(collection: string, id: string): Promise<any>;
  }
}
