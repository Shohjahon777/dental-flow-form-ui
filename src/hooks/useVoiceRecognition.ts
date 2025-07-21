
import { useState, useRef, useCallback } from 'react';
import { WebSocketService } from '../services/websocket';

interface VoiceRecognitionOptions {
  onTranscription?: (text: string) => void;
  onError?: (error: string) => void;
  language?: string;
  continuous?: boolean;
}

export const useVoiceRecognition = (options: VoiceRecognitionOptions = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const websocketRef = useRef<WebSocket | null>(null);
  const wsService = useRef(new WebSocketService('wss://backendfastapi-v8lv.onrender.com'));

  const {
    onTranscription,
    onError,
    language = 'en-US',
    continuous = false
  } = options;

  const connectWebSocket = useCallback((patientId: string) => {
    try {
      websocketRef.current = wsService.current.connectWebSocket(
        patientId,
        (data) => {
          if (data.type === 'transcription' && data.text && onTranscription) {
            onTranscription(data.text);
          }
          if (data.type === 'error' && data.message && onError) {
            onError(data.message);
          }
        },
        (error) => {
          console.error('WebSocket error:', error);
          onError?.('WebSocket connection error');
        },
        () => {
          console.log('WebSocket disconnected');
        }
      );
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      onError?.('Failed to connect to voice service');
    }
  }, [onTranscription, onError]);

  const startListening = useCallback(async (patientId?: string) => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setIsSupported(false);
      onError?.('Speech recognition not supported in this browser');
      return;
    }

    try {
      // Connect WebSocket if patientId provided
      if (patientId) {
        connectWebSocket(patientId);
      }

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      streamRef.current = stream;

      // Determine best audio format
      const mimeTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/wav',
        'audio/mp4',
        'audio/ogg;codecs=opus'
      ];

      let selectedMimeType = '';
      for (const mimeType of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          selectedMimeType = mimeType;
          break;
        }
      }

      if (!selectedMimeType) {
        throw new Error('No supported audio format found');
      }

      const options: MediaRecorderOptions = {
        mimeType: selectedMimeType,
        audioBitsPerSecond: 128000
      };

      mediaRecorderRef.current = new MediaRecorder(stream, options);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: selectedMimeType });
        await sendAudioToServer(audioBlob);
        
        // Clean up stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorderRef.current.start(continuous ? 1000 : undefined);
      setIsListening(true);

    } catch (error) {
      console.error('Failed to start voice recognition:', error);
      onError?.(`Failed to access microphone: ${error.message}`);
      setIsSupported(false);
    }
  }, [connectWebSocket, onError, continuous]);

  const stopListening = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsListening(false);
  }, []);

  const sendAudioToServer = useCallback(async (audioBlob: Blob) => {
    if (!websocketRef.current || websocketRef.current.readyState !== WebSocket.OPEN) {
      onError?.('Voice connection lost. Please try again.');
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = function() {
        const base64Audio = (reader.result as string).split(',')[1];
        const message = {
          type: 'audio',
          data: base64Audio
        };
        websocketRef.current?.send(JSON.stringify(message));
      };
      reader.onerror = function() {
        onError?.('Error processing audio');
      };
      reader.readAsDataURL(audioBlob);
    } catch (error) {
      console.error('Error sending audio:', error);
      onError?.('Error sending audio');
    }
  }, [onError]);

  const cleanup = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (websocketRef.current) {
      websocketRef.current.close();
    }
    setIsListening(false);
  }, []);

  return {
    isListening,
    isSupported,
    startListening,
    stopListening,
    cleanup
  };
};
