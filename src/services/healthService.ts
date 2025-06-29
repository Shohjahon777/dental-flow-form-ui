
import { BaseApiService } from './baseApiService';
import { HealthStatus } from '../types/dental';

export class HealthService extends BaseApiService {
  async healthCheck(): Promise<HealthStatus> {
    return this.makeRequest<HealthStatus>('/health');
  }
}
