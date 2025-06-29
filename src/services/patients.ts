
import { ApiClient } from './apiClient';
import { PatientInfo } from '../types/dental';

export class PatientsService extends ApiClient {
  async getPatients(): Promise<PatientInfo[]> {
    return this.makeRequest<PatientInfo[]>('/patients');
  }
}
