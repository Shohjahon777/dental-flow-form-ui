
export class ApiClient {
  protected baseUrl: string;
  protected wsUrl: string;

  constructor() {
    // Use relative URL for API calls to leverage Vite proxy
    this.baseUrl = '/api';
    // Keep WebSocket URL as absolute for direct connection
    this.wsUrl = 'wss://backendfastapi-v8lv.onrender.com';
    
    console.log('API Client initialized:', {
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
          'Accept': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
        credentials: 'omit', // Don't send cookies for cross-origin requests
      });
      
      console.log(`Response status: ${response.status}`);
      console.log(`Response headers:`, Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: `HTTP ${response.status}` }));
        console.error('Request failed:', errorData);
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`${method} request successful:`, data);
      return data;
    } catch (error) {
      console.error(`${method} request failed:`, error);
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error - check if the backend is running and accessible');
      }
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

  getWebSocketUrl(): string {
    return this.wsUrl;
  }
}
