
import { useState } from "react";
import { Mic, MicOff, Volume2, Play, Pause, Sparkles, Stethoscope, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AIDentalPatient() {
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [conversationStarted, setConversationStarted] = useState(false);

  const handleStartConversation = () => {
    setConversationStarted(true);
    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), 3000);
  };

  const toggleListening = () => {
    setIsListening(!isListening);
  };

  return (
    <Card className="dental-card h-fit sticky top-6 relative overflow-hidden bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 border-2 border-teal-100 shadow-xl">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-teal-200/20 to-cyan-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-teal-200/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      <CardHeader className="text-center pb-4 relative z-10">
        {/* AI Avatar Section */}
        <div className="relative mb-4 mx-auto w-24 h-24">
          {/* Outer glow ring */}
          <div className={`absolute inset-0 rounded-full transition-all duration-1000 ${
            isListening
              ? 'animate-ping bg-gradient-to-r from-teal-400 to-cyan-500 opacity-75'
              : isPlaying
                ? 'animate-pulse bg-gradient-to-r from-blue-400 to-teal-500 opacity-60'
                : 'bg-gradient-to-r from-teal-300 to-blue-300 opacity-40'
          }`}></div>

          {/* Main avatar */}
          <div className={`relative w-24 h-24 rounded-full bg-gradient-to-br from-white to-teal-50 flex items-center justify-center shadow-lg border-4 border-white transition-all duration-300 ${
            isListening || isPlaying ? 'scale-110' : 'scale-100'
          }`}>
            {isListening ? (
              <div className="flex space-x-1">
                <div className="w-1 h-6 bg-gradient-to-t from-teal-400 to-cyan-500 rounded-full animate-bounce"></div>
                <div className="w-1 h-4 bg-gradient-to-t from-teal-400 to-cyan-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-1 h-8 bg-gradient-to-t from-teal-400 to-cyan-500 rounded-full animate-bounce delay-200"></div>
                <div className="w-1 h-5 bg-gradient-to-t from-teal-400 to-cyan-500 rounded-full animate-bounce delay-300"></div>
              </div>
            ) : isPlaying ? (
              <Volume2 className="h-8 w-8 text-teal-600 animate-pulse" />
            ) : (
              <div className="relative">
                <Stethoscope className="h-8 w-8 text-teal-600" />
                <Sparkles className="h-3 w-3 text-cyan-500 absolute -top-1 -right-1 animate-bounce" />
              </div>
            )}
          </div>
        </div>

        <CardTitle className="text-lg text-gray-900 mb-2">AI Dental Patient</CardTitle>
        
        {/* Status Indicator */}
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
            isListening
              ? 'bg-teal-500 animate-pulse shadow-lg shadow-teal-500/50'
              : isPlaying
                ? 'bg-blue-500 animate-pulse shadow-lg shadow-blue-500/50'
                : 'bg-gray-400'
          }`}></div>
          <span className="text-xs font-medium text-gray-600">
            {isListening ? 'Listening...' : isPlaying ? 'Speaking...' : 'Ready'}
          </span>
        </div>
      </CardHeader>

      <CardContent className="text-center relative z-10">
        <div className="bg-teal-50 rounded-lg p-4 mb-4 border border-teal-100">
          <p className="text-gray-700 text-sm mb-4 leading-relaxed">
            Practice patient interviews with our AI simulation. Ask about dental history, symptoms, and concerns.
          </p>
          
          {!conversationStarted ? (
            <div className="text-xs text-teal-600 font-medium">
              🦷 Ready for dental consultation simulation
            </div>
          ) : (
            <div className="text-xs text-blue-600 font-medium animate-fade-in">
              💬 Patient is ready to share their concerns
            </div>
          )}
        </div>

        {/* Control Buttons */}
        <div className="space-y-3">
          {!conversationStarted ? (
            <Button 
              onClick={handleStartConversation}
              className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
            >
              <Play className="h-4 w-4" />
              <span>Start Patient Interview</span>
            </Button>
          ) : (
            <div className="space-y-2">
              <div className="flex space-x-2">
                <Button
                  onClick={toggleListening}
                  variant={isListening ? "default" : "outline"}
                  size="sm"
                  className={`flex-1 py-2 px-3 rounded-lg font-medium transition-all duration-200 ${
                    isListening
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white shadow-md'
                      : 'border-2 border-teal-300 hover:border-teal-400 text-teal-700 hover:bg-teal-50'
                  }`}
                >
                  {isListening ? <MicOff className="h-3 w-3" /> : <Mic className="h-3 w-3" />}
                </Button>

                <Button
                  onClick={() => setIsPlaying(!isPlaying)}
                  variant="outline"
                  size="sm"
                  className="flex-1 py-2 px-3 rounded-lg font-medium border-2 border-teal-300 hover:border-teal-400 text-teal-700 hover:bg-teal-50 transition-all duration-200"
                >
                  {isPlaying ? <Pause className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                </Button>
              </div>

              <p className="text-xs text-gray-500 text-center animate-fade-in">
                Use microphone to ask questions about symptoms
              </p>
            </div>
          )}
        </div>

        {/* Progress indicator */}
        {conversationStarted && (
          <div className="mt-4">
            <div className="h-1 bg-teal-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
