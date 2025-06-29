
export class BaseApiService {
  protected baseUrl: string;
  protected wsUrl: string;

  constructor() {
    const apiUri = import.meta.env.VITE_AI_URI || 'https://backendfastapi-v8lv.onrender.com/api';
    this.baseUrl = apiUri;
    this.wsUrl = this.baseUrl.replace('http', 'ws').replace('https', 'wss').replace('/api', '');
    
    console.log('Base API Service initialized:', {
      baseUrl: this.baseUrl,
      wsUrl: this.wsUrl
    });
  }

  protected async makeRequest<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'DELETE' = 'GET',
    body?: any
  ): Promise<T> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      console.log(`Making ${method} request to:`, url);
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: `HTTP ${response.status}` }));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`${method} request successful:`, data);
      return data;
    } catch (error) {
      console.error(`${method} request failed:`, error);
      throw new Error(`Request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.makeRequest('/health');
      return true;
    } catch (error) {
      console.error('Backend connection test failed:', error);
      return false;
    }
  }
}
