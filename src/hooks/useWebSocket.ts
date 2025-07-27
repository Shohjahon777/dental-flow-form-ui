
import { useRef, useCallback, useState } from 'react';
import { toast } from "sonner";
import { WebSocketService } from '../services/websocket';

interface WebSocketMessage {
  type: 'transcription' | 'answer' | 'error' | 'status';
  text?: string;
  answer?: string;
  patient_name?: string;
  question_index?: number;
  total_questions?: number;
  message?: string;
}

interface UseWebSocketProps {
  onMessage: (data: WebSocketMessage) => void;
  onConnectionChange: (status: 'disconnected' | 'connecting' | 'connected' | 'error') => void;
}

export const useWebSocket = ({ onMessage, onConnectionChange }: UseWebSocketProps) => {
  const wsRef = useRef<WebSocket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const wsService = useRef(new WebSocketService('ws://13.60.204.2:8000'));

  const updateConnectionStatus = useCallback((status: 'disconnected' | 'connecting' | 'connected' | 'error') => {
    setConnectionStatus(status);
    onConnectionChange(status);
  }, [onConnectionChange]);

  const initializeWebSocket = useCallback((patientId: string) => {
    try {
      console.log('Initializing WebSocket for patient:', patientId);

      wsRef.current = wsService.current.connectWebSocket(
        patientId,
        (message) => {
          console.log('WebSocket message received:', message);
          onMessage(message);
        },
        (error) => {
          console.error('WebSocket error:', error);
          updateConnectionStatus('error');
        },
        (event) => {
          console.log('WebSocket closed:', event);
          updateConnectionStatus('disconnected');
        }
      );

      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        updateConnectionStatus('connected');
        toast.success('Voice AI connected');
      };

    } catch (err) {
      console.error('Failed to initialize WebSocket:', err);
      updateConnectionStatus('error');
      toast.error('Voice AI connection failed');
    }
  }, [onMessage, updateConnectionStatus]);

  const sendMessage = useCallback((message: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
      return true;
    }
    return false;
  }, []);

  const cleanup = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    updateConnectionStatus('disconnected');
  }, [updateConnectionStatus]);

  return {
    connectionStatus,
    initializeWebSocket,
    sendMessage,
    cleanup,
    wsRef
  };
};
