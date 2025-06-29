
export interface PatientInfo {
  id: string;
  age: number;
  gender: string;
  complexity: string;
  description: string;
  name: string;
  file: string;
  voice: string;
}

export interface SessionRequest {
  patient_id: string;
}

export interface QuestionRequest {
  patient_id: string;
  question: string;
}

export interface QuestionResponse {
  patient_name: string;
  question: string;
  answer: string;
  question_index: number;
  total_questions: number;
  retry_count: number;
  max_retries: number;
}

export interface SessionStatus {
  patient_id: string;
  patient_name: string;
  current_question_index: number;
  total_questions: number;
  current_retry_count: number;
  last_question_retry_count: number;
  max_retries_per_question: number;
  completed: boolean;
}

export interface HealthStatus {
  status: string;
  available_patients: number;
  active_sessions: number;
}

export interface WebSocketMessage {
  type: 'status' | 'error' | 'answer' | 'transcription';
  message?: string;
  patient_name?: string;
  answer?: string;
  question_index?: number;
  total_questions?: number;
  retry_count?: number;
  max_retries?: number;
  text?: string;
}

export interface SessionResponse {
  patient_id: string;
  patient_name: string;
  total_questions: number;
  message: string;
}
