
import { WebSocketMessage } from '../types/dental';

export class WebSocketService {
  private wsUrl: string;

  constructor(wsUrl: string) {
    this.wsUrl = wsUrl;
  }

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
}
