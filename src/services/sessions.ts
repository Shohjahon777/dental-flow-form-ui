
import { ApiClient } from './apiClient';
import { SessionResponse, SessionStatus } from '../types/dental';

export class SessionsService extends ApiClient {
  async createSession(patientId: string): Promise<SessionResponse> {
    return this.makeRequest<SessionResponse>(`/session/${patientId}`, 'POST');
  }

  async getSessionStatus(patientId: string): Promise<SessionStatus> {
    return this.makeRequest<SessionStatus>(`/session/${patientId}`);
  }

  async deleteSession(patientId: string): Promise<{ message: string }> {
    return this.makeRequest<{ message: string }>(`/session/${patientId}`, 'DELETE');
  }
}
