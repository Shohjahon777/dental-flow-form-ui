
import { ApiClient } from './apiClient';
import { HealthStatus } from '../types/dental';

export class HealthService extends ApiClient {
  async healthCheck(): Promise<HealthStatus> {
    return this.makeRequest<HealthStatus>('/health');
  }
}
