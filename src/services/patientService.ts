
import { BaseApiService } from './baseApiService';
import { PatientInfo } from '../types/dental';

export class PatientService extends BaseApiService {
  async getPatients(): Promise<PatientInfo[]> {
    return this.makeRequest<PatientInfo[]>('/patients');
  }
}
