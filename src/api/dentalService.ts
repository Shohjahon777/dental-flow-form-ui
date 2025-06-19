
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

class DentalApiService {
  private baseUrl: string;
  private wsUrl: string;

  constructor() {
    // Use environment variable or fallback to localhost
    const apiUri = import.meta.env.VITE_AI_URI || 'http://localhost:8000';
    this.baseUrl = apiUri.replace('/api', ''); // Remove /api suffix if present
    this.wsUrl = this.baseUrl.replace('http', 'ws');
    
    console.log('Dental API Service initialized:', {
      baseUrl: this.baseUrl,
      wsUrl: this.wsUrl
    });
  }

  // Get all available patients
  async getPatients(): Promise<PatientInfo[]> {
    try {
      console.log('Fetching patients from:', `${this.baseUrl}/api/patients`);
      const response = await fetch(`${this.baseUrl}/api/patients`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const patients = await response.json();
      console.log('Patients fetched successfully:', patients);
      return patients;
    } catch (error) {
      console.error('Error fetching patients:', error);
      throw new Error(`Failed to fetch patients: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
      console.log('Creating session for patient:', patientId);
      const response = await fetch(`${this.baseUrl}/api/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ patient_id: patientId }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: `HTTP ${response.status}` }));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }
      
      const sessionData = await response.json();
      console.log('Session created successfully:', sessionData);
      return sessionData;
    } catch (error) {
      console.error('Error creating session:', error);
      throw new Error(`Failed to create session: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Ask a question to the selected patient
  async askQuestion(patientId: string, question: string): Promise<QuestionResponse> {
    try {
      console.log('Asking question:', { patientId, question });
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
        const errorData = await response.json().catch(() => ({ detail: `HTTP ${response.status}` }));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }
      
      const questionResponse = await response.json();
      console.log('Question response received:', questionResponse);
      return questionResponse;
    } catch (error) {
      console.error('Error asking question:', error);
      throw new Error(`Failed to ask question: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get session status for a patient
  async getSessionStatus(patientId: string): Promise<SessionStatus> {
    try {
      console.log('Getting session status for patient:', patientId);
      const response = await fetch(`${this.baseUrl}/api/sessions/${patientId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: `HTTP ${response.status}` }));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }
      
      const status = await response.json();
      console.log('Session status retrieved:', status);
      return status;
    } catch (error) {
      console.error('Error fetching session status:', error);
      throw new Error(`Failed to get session status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Delete a patient session
  async deleteSession(patientId: string): Promise<{ message: string }> {
    try {
      console.log('Deleting session for patient:', patientId);
      const response = await fetch(`${this.baseUrl}/api/sessions/${patientId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: `HTTP ${response.status}` }));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Session deleted successfully:', result);
      return result;
    } catch (error) {
      console.error('Error deleting session:', error);
      throw new Error(`Failed to delete session: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Health check
  async healthCheck(): Promise<HealthStatus> {
    try {
      console.log('Performing health check');
      const response = await fetch(`${this.baseUrl}/api/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const health = await response.json();
      console.log('Health check successful:', health);
      return health;
    } catch (error) {
      console.error('Error checking health:', error);
      throw new Error(`Health check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // WebSocket connection for real-time communication
  connectWebSocket(
    patientId: string,
    onMessage: (message: WebSocketMessage) => void,
    onError: (error: Event) => void,
    onClose: (event: CloseEvent) => void
  ): WebSocket {
    const wsUrl = `${this.wsUrl}/ws/${patientId}`;
    console.log('Connecting to WebSocket:', wsUrl);
    
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log(`WebSocket connected for patient: ${patientId}`);
    };
    
    ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        console.log('WebSocket message received:', message);
        onMessage(message);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
        onError(new Event('parse-error'));
      }
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      onError(error);
    };
    
    ws.onclose = (event) => {
      console.log('WebSocket closed:', event);
      onClose(event);
    };
    
    return ws;
  }

  // Send audio data through WebSocket
  sendAudioData(ws: WebSocket, audioData: string): void {
    if (ws.readyState === WebSocket.OPEN) {
      const message = {
        type: 'audio',
        data: audioData
      };
      console.log('Sending audio data through WebSocket');
      ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not open, cannot send audio data');
    }
  }

  // Send text question through WebSocket
  sendTextQuestion(ws: WebSocket, question: string): void {
    if (ws.readyState === WebSocket.OPEN) {
      const message = {
        type: 'text_question',
        question: question
      };
      console.log('Sending text question through WebSocket:', question);
      ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not open, cannot send text question');
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
        console.log('Audio converted to base64, length:', base64Data.length);
        resolve(base64Data);
      };
      reader.onerror = () => {
        console.error('Error converting audio to base64');
        reject(new Error('Failed to convert audio to base64'));
      };
      reader.readAsDataURL(audioBlob);
    });
  }

  // Test connection to backend
  async testConnection(): Promise<boolean> {
    try {
      await this.healthCheck();
      return true;
    } catch (error) {
      console.error('Backend connection test failed:', error);
      return false;
    }
  }
}

// Create a singleton instance
export const dentalApiService = new DentalApiService();

// Custom hooks for React integration
export const useDentalApi = () => {
  return dentalApiService;
};
