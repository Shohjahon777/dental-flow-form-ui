
import { ApiClient } from './apiClient';
import { QuestionResponse } from '../types/dental';

export class QuestionsService extends ApiClient {
  async askQuestion(patientId: string, question: string): Promise<QuestionResponse> {
    return this.makeRequest<QuestionResponse>('/questions', 'POST', {
      patient_id: patientId,
      question: question,
    });
  }
}
