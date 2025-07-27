
import { ApiClient } from './apiClient';
import { SessionResponse, SessionStatus } from '../types/dental';

export class SessionsService extends ApiClient {
  async createSession(patientId: string): Promise<SessionResponse> {
    return this.makeRequest<SessionResponse>('/sessions', 'POST', { patient_id: patientId });
  }

  async getSessionStatus(patientId: string): Promise<SessionStatus> {
    return this.makeRequest<SessionStatus>(`/sessions/${patientId}`);
  }

  async deleteSession(patientId: string): Promise<{ message: string }> {
    return this.makeRequest<{ message: string }>(`/sessions/${patientId}`, 'DELETE');
  }
}
