
import { BaseApiService } from './baseApiService';
import { QuestionResponse } from '../types/dental';

export class QuestionService extends BaseApiService {
  async askQuestion(patientId: string, question: string): Promise<QuestionResponse> {
    return this.makeRequest<QuestionResponse>('/ask', 'POST', {
      patient_id: patientId,
      question: question,
    });
  }
}
