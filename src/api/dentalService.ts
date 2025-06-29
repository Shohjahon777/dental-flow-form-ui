
import { PatientService } from '../services/patientService';
import { SessionService } from '../services/sessionService';
import { QuestionService } from '../services/questionService';
import { HealthService } from '../services/healthService';
import { WebSocketService } from '../services/websocketService';
import { AudioUtils } from '../utils/audioUtils';
import { 
  PatientInfo, 
  SessionResponse, 
  QuestionResponse, 
  SessionStatus, 
  HealthStatus, 
  WebSocketMessage 
} from '../types/dental';

class DentalApiService {
  private patientService: PatientService;
  private sessionService: SessionService;
  private questionService: QuestionService;
  private healthService: HealthService;
  private websocketService: WebSocketService;

  constructor() {
<<<<<<< HEAD
    // Use environment variable or fallback to localhost
    const apiUri = import.meta.env.VITE_AI_URI || 'https://backendfastapi-v8lv.onrender.com';
    this.baseUrl = apiUri.replace('/api', ''); // Remove /api suffix if present
    this.wsUrl = this.baseUrl.replace('http', 'ws');
    
    console.log('Dental API Service initialized:', {
      baseUrl: this.baseUrl,
      wsUrl: this.wsUrl
    });
=======
    this.patientService = new PatientService();
    this.sessionService = new SessionService();
    this.questionService = new QuestionService();
    this.healthService = new HealthService();
    this.websocketService = new WebSocketService();
>>>>>>> 48f5a9640ee1c7cf354ea7097041cf4fbc28d267
  }

  // Patient methods
  async getPatients(): Promise<PatientInfo[]> {
    return this.patientService.getPatients();
  }

  // Session methods
  async createSession(patientId: string): Promise<SessionResponse> {
    return this.sessionService.createSession(patientId);
  }

  async getSessionStatus(patientId: string): Promise<SessionStatus> {
    return this.sessionService.getSessionStatus(patientId);
  }

  async deleteSession(patientId: string): Promise<{ message: string }> {
    return this.sessionService.deleteSession(patientId);
  }

  // Question methods
  async askQuestion(patientId: string, question: string): Promise<QuestionResponse> {
    return this.questionService.askQuestion(patientId, question);
  }

  // Health methods
  async healthCheck(): Promise<HealthStatus> {
    return this.healthService.healthCheck();
  }

  // WebSocket methods
  connectWebSocket(
    patientId: string,
    onMessage: (message: WebSocketMessage) => void,
    onError: (error: Event) => void,
    onClose: (event: CloseEvent) => void
  ): WebSocket {
    return this.websocketService.connectWebSocket(patientId, onMessage, onError, onClose);
  }

  sendAudioData(ws: WebSocket, audioData: string): void {
    this.websocketService.sendAudioData(ws, audioData);
  }

  sendTextQuestion(ws: WebSocket, question: string): void {
    this.websocketService.sendTextQuestion(ws, question);
  }

  // Audio utility methods
  async audioToBase64(audioBlob: Blob): Promise<string> {
    return AudioUtils.audioToBase64(audioBlob);
  }

  // Test connection
  async testConnection(): Promise<boolean> {
    return this.healthService.testConnection();
  }
}

// Create a singleton instance
export const dentalApiService = new DentalApiService();

// Custom hooks for React integration
export const useDentalApi = () => {
  return dentalApiService;
};

// Re-export types for convenience
export type {
  PatientInfo,
  SessionResponse,
  QuestionResponse,
  SessionStatus,
  HealthStatus,
  WebSocketMessage
} from '../types/dental';
