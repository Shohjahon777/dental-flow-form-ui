
import { PatientsService } from '../services/patients';
import { SessionsService } from '../services/sessions';
import { QuestionsService } from '../services/questions';
import { HealthService } from '../services/health';
import { WebSocketService } from '../services/websocket';
import { AudioUtilities } from '../utils/audio';
import { ApiClient } from '../services/apiClient';
import { 
  PatientInfo, 
  SessionResponse, 
  QuestionResponse, 
  SessionStatus, 
  HealthStatus, 
  WebSocketMessage 
} from '../types/dental';

class DentalApiService {
  private patientsService: PatientsService;
  private sessionsService: SessionsService;
  private questionsService: QuestionsService;
  private healthService: HealthService;
  private websocketService: WebSocketService;
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient();
    this.patientsService = new PatientsService();
    this.sessionsService = new SessionsService();
    this.questionsService = new QuestionsService();
    this.healthService = new HealthService();
    this.websocketService = new WebSocketService(this.apiClient.getWebSocketUrl());
  }

  // Patient methods
  async getPatients(): Promise<PatientInfo[]> {
    return this.patientsService.getPatients();
  }

  // Session methods
  async createSession(patientId: string): Promise<SessionResponse> {
    return this.sessionsService.createSession(patientId);
  }

  async getSessionStatus(patientId: string): Promise<SessionStatus> {
    return this.sessionsService.getSessionStatus(patientId);
  }

  async deleteSession(patientId: string): Promise<{ message: string }> {
    return this.sessionsService.deleteSession(patientId);
  }

  // Question methods
  async askQuestion(patientId: string, question: string): Promise<QuestionResponse> {
    return this.questionsService.askQuestion(patientId, question);
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
    return AudioUtilities.audioToBase64(audioBlob);
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
