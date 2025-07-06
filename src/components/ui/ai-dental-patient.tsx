
import { useEffect, useState, useCallback, useRef } from "react";
import { Play, Sparkles, Stethoscope, MessageCircle, Activity, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AIRules } from "@/components/ui/ai-rules";
import { PatientAvatar } from "@/components/ui/patient-avatar";
import { ConnectionStatus } from "@/components/ui/connection-status";
import { ChatMessages } from "@/components/ui/chat-messages";
import { ControlButtons } from "@/components/ui/control-buttons";
import { QuestionInput } from "@/components/ui/question-input";
import { dentalApiService, PatientInfo, SessionStatus } from "@/api/dentalService";
import { toast } from "sonner";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useParams } from "react-router-dom";

interface WebSocketMessage {
  type: 'transcription' | 'answer' | 'error' | 'status';
  text?: string;
  answer?: string;
  patient_name?: string;
  question_index?: number;
  total_questions?: number;
  message?: string;
}

interface ChatMessage {
  sender: string;
  message: string;
  type: string;
}

export function AIDentalPatient() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [patientMood, setPatientMood] = useState<'calm' | 'anxious' | 'happy'>('calm');
  const [patients, setPatients] = useState<PatientInfo[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionStatus, setSessionStatus] = useState<SessionStatus | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const [lastResponse, setLastResponse] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const processingVoiceRef = useRef(false);
  const { patientId } = useParams();

  // WebSocket hook
  const { connectionStatus, initializeWebSocket, sendMessage, cleanup: cleanupWebSocket } = useWebSocket({
    onMessage: handleWebSocketMessage,
    onConnectionChange: () => {} // Status is handled by the hook itself
  });

  // Voice recognition callbacks
  const handleVoiceTranscription = useCallback(async (text: string) => {
    if (!text.trim() || processingVoiceRef.current || !sessionActive) return;

    processingVoiceRef.current = true;

    try {
      console.log('Voice transcription received:', text);
      addToChat('Student (Voice)', text, 'question');
      setCurrentQuestion(text);
      await sendQuestion(text);
    } catch (error) {
      console.error('Error processing voice transcription:', error);
    } finally {
      processingVoiceRef.current = false;
    }
  }, [sessionActive]);

  const handleVoiceError = useCallback((errorMsg: string) => {
    setError(errorMsg);
    toast.error(errorMsg);
    processingVoiceRef.current = false;
  }, []);

  const {
    isListening,
    isSupported: microphoneSupported,
    startListening,
    stopListening,
    cleanup: cleanupVoice
  } = useVoiceRecognition({
    onTranscription: handleVoiceTranscription,
    onError: handleVoiceError
  });

  useEffect(() => {
    testBackendConnection();
    loadPatients();
    return () => {
      cleanup();
    };
  }, []);

  function handleWebSocketMessage(data: WebSocketMessage) {
    console.log('Processing WebSocket message:', data);

    switch (data.type) {
      case 'transcription':
        if (data.text) {
          handleVoiceTranscription(data.text);
        }
        break;
      case 'answer':
        if (data.answer && data.patient_name) {
          addToChat(data.patient_name, data.answer, 'answer');
          setLastResponse(data.answer);
          playResponse(data.answer);
          updateMoodFromResponse(data.answer);
          if (data.question_index !== undefined && data.total_questions !== undefined) {
            updateSessionProgress(data.question_index, data.total_questions);
          }
        }
        break;
      case 'error':
        if (data.message) {
          addToChat('System', data.message, 'error');
          setError(data.message);
          toast.error(data.message);
        }
        break;
      case 'status':
        if (data.message) {
          console.log('Status update:', data.message);
          toast.info(data.message);
        }
        break;
    }
  }

  const testBackendConnection = async () => {
    try {
      const isConnected = await dentalApiService.testConnection();
      if (!isConnected) {
        setError('AI backend server is not available. Please check your connection.');
        toast.error('AI backend connection failed');
      } else {
        toast.success('Connected to AI backend');
      }
    } catch (err) {
      setError('Cannot connect to AI backend server');
      toast.error('AI backend connection failed');
    }
  };

  const cleanup = () => {
    cleanupWebSocket();
    cleanupVoice();
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    processingVoiceRef.current = false;
  };

  const loadPatients = async () => {
    try {
      setLoading(true);
      console.log('Loading patients...');
      const patientsData = await dentalApiService.getPatients();
      console.log('Patients loaded:', patientsData);
      setPatients(patientsData);
      if (patientsData.length > 0) {
        setSelectedPatient(patientId || patientsData[0].id);
      }
    } catch (err) {
      console.error('Error loading patients:', err);
      setError('Failed to load patients from AI backend.');
      toast.error('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const addToChat = (sender: string, message: string, type: string) => {
    setChatMessages(prev => [...prev, { sender, message, type }]);
  };

  const updateSessionProgress = (questionIndex: number, totalQuestions: number) => {
    setSessionStatus(prev => prev ? {
      ...prev,
      current_question_index: questionIndex,
      total_questions: totalQuestions,
      completed: questionIndex >= totalQuestions
    } : null);
  };

  const updateMoodFromResponse = (response: string) => {
    const lowerResponse = response.toLowerCase();
    if (lowerResponse.includes('pain') || lowerResponse.includes('hurt') || lowerResponse.includes('worried')) {
      setPatientMood('anxious');
    } else if (lowerResponse.includes('good') || lowerResponse.includes('fine') || lowerResponse.includes('better')) {
      setPatientMood('happy');
    } else {
      setPatientMood('calm');
    }
  };

  const handleStartConversation = async () => {
    if (!selectedPatient) {
      setError('No patient selected');
      return;
    }

    if (connectionStatus !== 'connected') {
      setError('AI backend server is not available. Please check your connection.');
      return;
    }

    await createSession(selectedPatient);
  };

  const createSession = async (patientId: string) => {
    try {
      setLoading(true);
      setError(null);

      console.log('Creating session for patient:', patientId);
      const sessionData = await dentalApiService.createSession(patientId);
      setSessionActive(true);
      setConversationStarted(true);
      setSuccess(`Session created for ${sessionData.patient_name}`);
      toast.success(`Session started with ${sessionData.patient_name}`);

      setChatMessages([]);
      initializeWebSocket(patientId);

    } catch (err) {
      console.error('Session creation error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create session');
      toast.error('Failed to create session');
    } finally {
      setLoading(false);
    }
  };

  const sendQuestion = async (questionText: string) => {
    if (!questionText.trim() || !selectedPatient || !sessionActive) return;

    try {
      setLoading(true);
      setError(null);

      console.log('Sending question:', questionText);

      const isVoiceQuestion = chatMessages.some(msg =>
        msg.message === questionText && msg.sender.includes('Voice')
      );

      if (!isVoiceQuestion) {
        addToChat('Student', questionText, 'question');
      }

      const messageSent = sendMessage({
        type: 'text_question',
        question: questionText
      });

      if (!messageSent) {
        console.log('WebSocket not available, using HTTP API');
        const response = await dentalApiService.askQuestion(selectedPatient, questionText);
        addToChat(response.patient_name, response.answer, 'answer');
        setLastResponse(response.answer);
        playResponse(response.answer);
        updateMoodFromResponse(response.answer);
      }

      if (!processingVoiceRef.current) {
        setCurrentQuestion('');
      }

    } catch (err) {
      console.error('Error sending question:', err);
      setError(err instanceof Error ? err.message : 'Failed to ask question');
      toast.error('Failed to ask question');
    } finally {
      setLoading(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      if (sessionActive && connectionStatus === 'connected') {
        setCurrentQuestion('');
        startListening(selectedPatient);
      } else {
        toast.error('Please start a session first and ensure AI backend is connected');
      }
    }
  };

  const playResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsPlaying(true);
      const utterance = new SpeechSynthesisUtterance(text);

      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice =>
        voice.name.includes('Neural') ||
        voice.name.includes('Premium') ||
        voice.lang.includes('en')
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;

      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      speechSynthesis.speak(utterance);
    }
  };

  const stopPlaying = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  const togglePlayback = () => {
    if (isPlaying) {
      stopPlaying();
    } else {
      playResponse(lastResponse);
    }
  };

  const resetSession = async () => {
    try {
      if (selectedPatient && sessionActive) {
        await dentalApiService.deleteSession(selectedPatient);
      }
    } catch (err) {
      console.error('Failed to delete session:', err);
    }

    setSessionActive(false);
    setSessionStatus(null);
    setError(null);
    setSuccess(null);
    setIsPlaying(false);
    setConversationStarted(false);
    setCurrentQuestion('');
    setLastResponse('');
    setPatientMood('calm');
    setChatMessages([]);
    processingVoiceRef.current = false;

    cleanup();
  };

  const selectedPatientInfo = patients.find(p => p.id === selectedPatient);

  return (
    <div className="flex justify-center items-center min-h-[60vh] p-6">
      <div className="w-full space-y-4">
        <Card className="w-full max-w-md mx-auto dental-card relative overflow-hidden bg-gradient-to-br from-white via-teal-50/30 to-cyan-50/30 border-2 border-teal-200/50 shadow-xl">
          {/* Professional background pattern */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-teal-100/20 via-transparent to-cyan-100/20"></div>
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-teal-200/30 to-cyan-200/30 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-blue-200/30 to-teal-200/30 rounded-full blur-xl animate-pulse delay-1000"></div>

            <div className="absolute top-4 right-4 opacity-10">
              <div className="w-6 h-6 relative">
                <div className="absolute inset-x-2 inset-y-0 bg-teal-600"></div>
                <div className="absolute inset-y-2 inset-x-0 bg-teal-600"></div>
              </div>
            </div>
          </div>

          <CardHeader className="text-center pb-6 relative z-10">
            <PatientAvatar 
              isListening={isListening}
              isPlaying={isPlaying}
              patientMood={patientMood}
            />

            <div className="space-y-2">
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center justify-center gap-2">
                <Stethoscope className="h-5 w-5 text-teal-600" />
                AI Virtual Patient
              </CardTitle>

              <ConnectionStatus 
                connectionStatus={connectionStatus}
                isListening={isListening}
                isPlaying={isPlaying}
              />

              {selectedPatientInfo && (
                <div className="text-xs text-gray-600">
                  Patient: {selectedPatientInfo.name} ({selectedPatientInfo.age}y, {selectedPatientInfo.gender})
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="relative z-10 space-y-4">
            {/* Microphone Permission Warning */}
            {!microphoneSupported && (
              <div className="bg-orange-50 border border-orange-200 text-orange-700 px-3 py-2 rounded-md text-sm flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                Speech recognition not supported. Please use text input.
              </div>
            )}

            {/* Connection Status Warning */}
            {connectionStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                AI backend server unavailable. Please check your connection.
              </div>
            )}

            {/* Error/Success Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-md text-sm">
                {success}
              </div>
            )}

            <ChatMessages messages={chatMessages} />

            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-4 border border-teal-100/50 backdrop-blur-sm">
              <div className="text-center space-y-3">
                <p className="text-gray-700 text-sm leading-relaxed font-medium">
                  Interactive Patient Simulation
                </p>
                <p className="text-gray-600 text-xs leading-relaxed">
                  Conduct comprehensive dental interviews with our advanced AI patient.
                  Practice history taking, symptom assessment, and diagnostic questioning.
                </p>

                {!conversationStarted ? (
                  <div className="text-sm text-teal-700 font-medium flex items-center justify-center bg-white/50 rounded-md py-2">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Ready for Clinical Interview
                  </div>
                ) : (
                  <div className="text-sm text-blue-700 font-medium animate-fade-in flex items-center justify-center bg-white/50 rounded-md py-2">
                    <Activity className="w-4 h-4 mr-2 animate-pulse" />
                    Patient Simulation Active
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              {!conversationStarted ? (
                <Button
                  onClick={handleStartConversation}
                  disabled={loading || connectionStatus !== 'connected'}
                  className="w-full bg-gradient-to-r from-teal-600 via-teal-700 to-cyan-600 hover:from-teal-700 hover:via-teal-800 hover:to-cyan-700 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play className="h-4 w-4" />
                  <span>
                    {loading ? 'Starting...' :
                      connectionStatus !== 'connected' ? 'AI Backend Unavailable' :
                        'Begin Patient Interview'}
                  </span>
                </Button>
              ) : (
                <div className="space-y-3">
                  <ControlButtons
                    isListening={isListening}
                    isPlaying={isPlaying}
                    microphoneSupported={microphoneSupported}
                    connectionStatus={connectionStatus}
                    lastResponse={lastResponse}
                    loading={loading}
                    onToggleListening={toggleListening}
                    onTogglePlayback={togglePlayback}
                    onReset={resetSession}
                  />

                  <QuestionInput
                    value={currentQuestion}
                    onChange={setCurrentQuestion}
                    onSend={() => sendQuestion(currentQuestion)}
                    isListening={isListening}
                    loading={loading}
                  />

                  <div className="text-center">
                    <p className="text-xs text-gray-600 animate-fade-in leading-relaxed">
                      {isListening
                        ? "🎤 Listening... Speak your question now"
                        : "Ask about medical history, current symptoms, pain levels, and dental concerns"
                      }
                    </p>
                    {connectionStatus !== 'connected' && (
                      <p className="text-xs text-amber-600 mt-1">
                        Voice features unavailable - text questions only
                      </p>
                    )}
                    {!microphoneSupported && (
                      <p className="text-xs text-orange-600 mt-1">
                        Speech recognition not supported - text questions only
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Progress Indicator */}
            {conversationStarted && sessionStatus && (
              <div className="mt-4">
                <div className="h-1 bg-teal-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 rounded-full transition-all duration-300"
                    style={{ width: `${((sessionStatus.current_question_index) / sessionStatus.total_questions) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Question {sessionStatus.current_question_index + 1}/{sessionStatus.total_questions}</span>
                  <span>{sessionStatus.completed ? 'Completed' : 'Active Session'}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="max-w-md mx-auto">
          <AIRules />
        </div>
      </div>
    </div>
  );
}
