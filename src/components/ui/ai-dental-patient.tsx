
import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Volume2, Play, Pause, Sparkles, Stethoscope, Bot, MessageCircle, Brain, User2, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AIRules } from "@/components/ui/ai-rules";
import { dentalApiService, PatientInfo, SessionStatus, QuestionResponse, WebSocketMessage } from "@/api/dentalService";
import { toast } from "sonner";

// Extend the Window interface for speech recognition types
type SpeechRecognition = any;

declare global {
  interface Window {
    webkitSpeechRecognition?: typeof SpeechRecognition;
    SpeechRecognition?: typeof SpeechRecognition;
  }
}

export function AIDentalPatient() {
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [patientMood, setPatientMood] = useState<'calm' | 'anxious' | 'happy'>('calm');
  const [patients, setPatients] = useState<PatientInfo[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionStatus, setSessionStatus] = useState<SessionStatus | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<string>("");
  const [lastResponse, setLastResponse] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    loadPatients();
    initializeSpeechRecognition();
    return () => {
      cleanup();
    };
  }, []);

  const cleanup = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (wsRef.current) {
      wsRef.current.close();
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  };

  const loadPatients = async () => {
    try {
      setLoading(true);
      const patientsData = await dentalApiService.getPatients();
      setPatients(patientsData);
      if (patientsData.length > 0) {
        setSelectedPatient(patientsData[0].id);
      }
    } catch (err) {
      setError('Failed to load patients');
      toast.error('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const handleStartConversation = async () => {
    if (!selectedPatient) {
      setError('No patient selected');
      return;
    }
    await createSession(selectedPatient);
  };

  const createSession = async (patientId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const sessionData = await dentalApiService.createSession(patientId);
      setSessionActive(true);
      setConversationStarted(true);
      setSuccess(`Session created for ${sessionData.patient_name}`);
      toast.success(`Session started with ${sessionData.patient_name}`);
      
      // Get initial session status
      const status = await dentalApiService.getSessionStatus(patientId);
      setSessionStatus(status);

      // Initialize WebSocket connection
      initializeWebSocket(patientId);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create session');
      toast.error('Failed to create session');
    } finally {
      setLoading(false);
    }
  };

  const initializeWebSocket = (patientId: string) => {
    try {
      wsRef.current = dentalApiService.connectWebSocket(
        patientId,
        handleWebSocketMessage,
        handleWebSocketError,
        handleWebSocketClose
      );
    } catch (err) {
      console.error('Failed to initialize WebSocket:', err);
      setError('Failed to connect to voice AI');
    }
  };

  const handleWebSocketMessage = (message: WebSocketMessage) => {
    console.log('WebSocket message received:', message);
    
    switch (message.type) {
      case 'answer':
        if (message.answer) {
          setLastResponse(message.answer);
          playResponse(message.answer);
          updateMoodFromResponse(message.answer);
        }
        break;
      case 'transcription':
        if (message.text) {
          setCurrentQuestion(message.text);
        }
        break;
      case 'status':
        if (message.message) {
          toast.info(message.message);
        }
        break;
      case 'error':
        if (message.message) {
          setError(message.message);
          toast.error(message.message);
        }
        break;
    }
  };

  const handleWebSocketError = (error: Event) => {
    console.error('WebSocket error:', error);
    setError('Voice AI connection error');
    toast.error('Voice AI connection error');
  };

  const handleWebSocketClose = (event: CloseEvent) => {
    console.log('WebSocket closed:', event);
    if (sessionActive) {
      toast.info('Voice AI connection closed');
    }
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

  const initializeSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setCurrentQuestion(transcript);
        setIsListening(false);
        // Send question via WebSocket or API
        sendQuestion(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setError("Speech recognition failed: " + event.error);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  };

  const sendQuestion = async (questionText: string) => {
    if (!questionText.trim() || !selectedPatient || !sessionActive) return;

    try {
      setLoading(true);
      setError(null);
      
      // Try WebSocket first, fallback to HTTP API
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        dentalApiService.sendTextQuestion(wsRef.current, questionText);
      } else {
        // Fallback to HTTP API
        const response = await dentalApiService.askQuestion(selectedPatient, questionText);
        setLastResponse(response.answer);
        playResponse(response.answer);
        updateMoodFromResponse(response.answer);
        
        // Update session status
        const status = await dentalApiService.getSessionStatus(selectedPatient);
        setSessionStatus(status);
      }
      
      setCurrentQuestion('');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to ask question');
      toast.error('Failed to ask question');
    } finally {
      setLoading(false);
    }
  };

  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          try {
            const base64Audio = await dentalApiService.audioToBase64(audioBlob);
            dentalApiService.sendAudioData(wsRef.current, base64Audio);
          } catch (err) {
            console.error('Failed to send audio:', err);
            setError('Failed to send audio');
          }
        }
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsListening(true);
    } catch (err) {
      console.error('Failed to start audio recording:', err);
      setError('Failed to access microphone');
    }
  };

  const stopAudioRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsListening(false);
  };

  const toggleListening = () => {
    if (isListening) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        stopAudioRecording();
      } else if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        // Use audio recording for WebSocket
        startAudioRecording();
      } else if (recognitionRef.current) {
        // Use speech recognition as fallback
        recognitionRef.current.start();
        setIsListening(true);
        setError(null);
      } else {
        setError("Speech recognition not supported");
      }
    }
  };

  const playResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsPlaying(true);
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Try to use a more natural voice
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.name.includes('Neural') || 
        voice.name.includes('Premium') || 
        voice.quality === 'enhanced'
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
    setIsListening(false);
    setIsPlaying(false);
    setConversationStarted(false);
    setCurrentQuestion('');
    setLastResponse('');
    setPatientMood('calm');
    
    cleanup();
  };

  const selectedPatientInfo = patients.find(p => p.id === selectedPatient);

  const getMoodColor = () => {
    switch (patientMood) {
      case 'anxious': return 'from-orange-400 to-red-500';
      case 'happy': return 'from-green-400 to-blue-500';
      default: return 'from-teal-400 to-cyan-500';
    }
  };

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
            {/* Professional AI Avatar */}
            <div className="relative mb-6 mx-auto w-24 h-24">
              <div className={`absolute inset-0 rounded-full transition-all duration-1000 ${
                isListening
                  ? `animate-ping bg-gradient-to-r ${getMoodColor()} opacity-75`
                  : isPlaying
                    ? `animate-pulse bg-gradient-to-r ${getMoodColor()} opacity-60`
                    : `bg-gradient-to-r ${getMoodColor()} opacity-40`
              }`}></div>

              <div className="absolute inset-2 rounded-full bg-white/80 backdrop-blur-sm border border-teal-200/50"></div>

              <div className={`relative w-20 h-20 mx-auto mt-2 rounded-full bg-gradient-to-br from-white to-teal-50 flex items-center justify-center shadow-lg border-2 border-white transition-all duration-300 ${
                isListening || isPlaying ? 'scale-110' : 'scale-100'
              }`}>
                {isListening ? (
                  <div className="flex space-x-1">
                    <div className="w-1 h-6 bg-gradient-to-t from-teal-500 to-cyan-400 rounded-full animate-bounce"></div>
                    <div className="w-1 h-4 bg-gradient-to-t from-teal-500 to-cyan-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-1 h-7 bg-gradient-to-t from-teal-500 to-cyan-400 rounded-full animate-bounce delay-200"></div>
                    <div className="w-1 h-5 bg-gradient-to-t from-teal-500 to-cyan-400 rounded-full animate-bounce delay-300"></div>
                  </div>
                ) : isPlaying ? (
                  <div className="relative">
                    <Volume2 className="h-8 w-8 text-teal-600 animate-pulse" />
                    <Activity className="h-3 w-3 text-cyan-500 absolute -top-1 -right-1 animate-bounce" />
                  </div>
                ) : (
                  <div className="relative">
                    <div className="flex items-center justify-center">
                      <User2 className="h-6 w-6 text-teal-600" />
                      <Brain className="h-4 w-4 text-cyan-500 absolute -top-1 -right-1" />
                    </div>
                    <Sparkles className="h-3 w-3 text-blue-500 absolute -bottom-1 -right-1 animate-bounce delay-500" />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center justify-center gap-2">
                <Stethoscope className="h-5 w-5 text-teal-600" />
                AI Virtual Patient
              </CardTitle>
              
              <div className="flex items-center justify-center space-x-2">
                <Badge variant="outline" className={`text-xs font-medium transition-all duration-300 ${
                  isListening
                    ? 'bg-teal-100 text-teal-700 border-teal-300'
                    : isPlaying
                      ? 'bg-blue-100 text-blue-700 border-blue-300'
                      : 'bg-gray-100 text-gray-600 border-gray-300'
                }`}>
                  <div className={`w-2 h-2 rounded-full mr-1 ${
                    isListening
                      ? 'bg-teal-500 animate-pulse'
                      : isPlaying
                        ? 'bg-blue-500 animate-pulse'
                        : 'bg-gray-400'
                  }`}></div>
                  {isListening ? 'Active Listening' : isPlaying ? 'Responding' : 'Standby'}
                </Badge>
                
                <Badge variant="outline" className="text-xs bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-700 border-teal-200">
                  <Bot className="w-3 h-3 mr-1" />
                  AI Powered
                </Badge>
              </div>

              {selectedPatientInfo && (
                <div className="text-xs text-gray-600">
                  Patient: {selectedPatientInfo.name} ({selectedPatientInfo.age}y, {selectedPatientInfo.gender})
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="relative z-10 space-y-4">
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

            {/* Current Question Display */}
            {currentQuestion && (
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-3 py-2 rounded-md text-sm">
                <strong>Your question:</strong> {currentQuestion}
              </div>
            )}

            {/* Last Response Display */}
            {lastResponse && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-md text-sm">
                <strong>Patient response:</strong> {lastResponse}
              </div>
            )}

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
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-teal-600 via-teal-700 to-cyan-600 hover:from-teal-700 hover:via-teal-800 hover:to-cyan-700 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <Play className="h-4 w-4" />
                  <span>{loading ? 'Starting...' : 'Begin Patient Interview'}</span>
                </Button>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      onClick={toggleListening}
                      disabled={loading}
                      variant={isListening ? "default" : "outline"}
                      className={`py-3 px-3 rounded-lg font-semibold transition-all duration-300 text-sm ${
                        isListening
                          ? 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white shadow-md'
                          : 'border-2 border-teal-300 hover:border-teal-400 text-teal-700 hover:bg-teal-50'
                      }`}
                    >
                      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>

                    <Button
                      onClick={stopPlaying}
                      variant="outline"
                      className="py-3 px-3 rounded-lg font-semibold border-2 border-teal-300 hover:border-teal-400 text-teal-700 hover:bg-teal-50 transition-all duration-300 text-sm"
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>

                    <Button
                      onClick={resetSession}
                      variant="outline"
                      className="py-3 px-3 rounded-lg font-semibold border-2 border-red-300 hover:border-red-400 text-red-700 hover:bg-red-50 transition-all duration-300 text-sm"
                    >
                      Reset
                    </Button>
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-gray-600 animate-fade-in leading-relaxed">
                      Ask about medical history, current symptoms, pain levels, and dental concerns
                    </p>
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
