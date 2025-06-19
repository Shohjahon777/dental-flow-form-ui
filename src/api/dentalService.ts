// api/dentalService.ts
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

class DentalApiService {
  private baseUrl: string;
  private wsUrl: string;

  constructor(baseUrl: string = 'http://localhost:8000') {
    this.baseUrl = baseUrl;
    this.wsUrl = baseUrl.replace('http', 'ws');
  }

  // Get all available patients
  async getPatients(): Promise<PatientInfo[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/patients`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching patients:', error);
      throw error;
    }
  }

  // Create a new session for a patient
  async createSession(patientId: string): Promise<{
    patient_id: string;
    patient_name: string;
    total_questions: number;
    message: string;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ patient_id: patientId }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  }

  // Ask a question to the selected patient
  async askQuestion(patientId: string, question: string): Promise<QuestionResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patient_id: patientId,
          question: question,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error asking question:', error);
      throw error;
    }
  }

  // Get session status for a patient
  async getSessionStatus(patientId: string): Promise<SessionStatus> {
    try {
      const response = await fetch(`${this.baseUrl}/api/sessions/${patientId}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching session status:', error);
      throw error;
    }
  }

  // Delete a patient session
  async deleteSession(patientId: string): Promise<{ message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/sessions/${patientId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error deleting session:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck(): Promise<HealthStatus> {
    try {
      const response = await fetch(`${this.baseUrl}/api/health`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error checking health:', error);
      throw error;
    }
  }

  // WebSocket connection for real-time communication
  connectWebSocket(
    patientId: string,
    onMessage: (message: WebSocketMessage) => void,
    onError: (error: Event) => void,
    onClose: (event: CloseEvent) => void
  ): WebSocket {
    const ws = new WebSocket(`${this.wsUrl}/ws/${patientId}`);
    
    ws.onopen = () => {
      console.log(`WebSocket connected for patient: ${patientId}`);
    };
    
    ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        onMessage(message);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    ws.onerror = onError;
    ws.onclose = onClose;
    
    return ws;
  }

  // Send audio data through WebSocket
  sendAudioData(ws: WebSocket, audioData: string): void {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'audio',
        data: audioData
      }));
    }
  }

  // Send text question through WebSocket
  sendTextQuestion(ws: WebSocket, question: string): void {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'text_question',
        question: question
      }));
    }
  }

  // Convert audio blob to base64
  async audioToBase64(audioBlob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove the data URL prefix (e.g., "data:audio/wav;base64,")
        const base64Data = base64String.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(audioBlob);
    });
  }
}

// Create a singleton instance
export const dentalApiService = new DentalApiService();

// Custom hooks for React integration
export const useDentalApi = () => {
  return dentalApiService;
};