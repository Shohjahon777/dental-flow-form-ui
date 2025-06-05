
import { useState } from "react";
import { Mic, MicOff, Volume2, Play, Pause, Sparkles, Stethoscope, Bot, MessageCircle } from "lucide-react";
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
    <Card className="dental-card sticky top-3 relative overflow-hidden bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 border border-teal-200 shadow-lg">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-teal-200/20 to-cyan-200/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-blue-200/20 to-teal-200/20 rounded-full blur-lg animate-pulse delay-1000"></div>
      </div>

      <CardHeader className="text-center pb-3 relative z-10">
        {/* AI Avatar Section */}
        <div className="relative mb-3 mx-auto w-16 h-16">
          {/* Outer glow ring */}
          <div className={`absolute inset-0 rounded-full transition-all duration-1000 ${
            isListening
              ? 'animate-ping bg-gradient-to-r from-teal-400 to-cyan-500 opacity-75'
              : isPlaying
                ? 'animate-pulse bg-gradient-to-r from-blue-400 to-teal-500 opacity-60'
                : 'bg-gradient-to-r from-teal-300 to-blue-300 opacity-40'
          }`}></div>

          {/* Main avatar */}
          <div className={`relative w-16 h-16 rounded-full bg-gradient-to-br from-white to-teal-50 flex items-center justify-center shadow-md border-2 border-white transition-all duration-300 ${
            isListening || isPlaying ? 'scale-110' : 'scale-100'
          }`}>
            {isListening ? (
              <div className="flex space-x-0.5">
                <div className="w-0.5 h-4 bg-gradient-to-t from-teal-400 to-cyan-500 rounded-full animate-bounce"></div>
                <div className="w-0.5 h-3 bg-gradient-to-t from-teal-400 to-cyan-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-0.5 h-5 bg-gradient-to-t from-teal-400 to-cyan-500 rounded-full animate-bounce delay-200"></div>
                <div className="w-0.5 h-3.5 bg-gradient-to-t from-teal-400 to-cyan-500 rounded-full animate-bounce delay-300"></div>
              </div>
            ) : isPlaying ? (
              <Volume2 className="h-6 w-6 text-teal-600 animate-pulse" />
            ) : (
              <div className="relative">
                <Stethoscope className="h-6 w-6 text-teal-600" />
                <Sparkles className="h-2 w-2 text-cyan-500 absolute -top-0.5 -right-0.5 animate-bounce" />
              </div>
            )}
          </div>
        </div>

        <CardTitle className="text-sm text-gray-900 mb-1">AI Dental Patient</CardTitle>
        
        {/* Status Indicator */}
        <div className="flex items-center justify-center space-x-1 mb-3">
          <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
            isListening
              ? 'bg-teal-500 animate-pulse shadow-sm shadow-teal-500/50'
              : isPlaying
                ? 'bg-blue-500 animate-pulse shadow-sm shadow-blue-500/50'
                : 'bg-gray-400'
          }`}></div>
          <span className="text-xs font-medium text-gray-600">
            {isListening ? 'Listening...' : isPlaying ? 'Speaking...' : 'Ready'}
          </span>
        </div>
      </CardHeader>

      <CardContent className="text-center relative z-10 space-y-3">
        <div className="bg-teal-50 rounded-md p-3 border border-teal-100">
          <p className="text-gray-700 text-xs mb-2 leading-relaxed">
            Practice patient interviews with our AI simulation. Ask about dental history, symptoms, and concerns.
          </p>
          
          {!conversationStarted ? (
            <div className="text-xs text-teal-600 font-medium flex items-center justify-center">
              <MessageCircle className="w-3 h-3 mr-1" />
              Ready for consultation
            </div>
          ) : (
            <div className="text-xs text-blue-600 font-medium animate-fade-in flex items-center justify-center">
              <Bot className="w-3 h-3 mr-1" />
              Patient ready to share
            </div>
          )}
        </div>

        {/* Control Buttons */}
        <div className="space-y-2">
          {!conversationStarted ? (
            <Button 
              onClick={handleStartConversation}
              className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-medium py-2 px-3 rounded-md shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2 text-xs"
            >
              <Play className="h-3 w-3" />
              <span>Start Interview</span>
            </Button>
          ) : (
            <div className="space-y-2">
              <div className="flex space-x-2">
                <Button
                  onClick={toggleListening}
                  variant={isListening ? "default" : "outline"}
                  size="sm"
                  className={`flex-1 py-2 px-2 rounded-md font-medium transition-all duration-200 text-xs ${
                    isListening
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white shadow-sm'
                      : 'border border-teal-300 hover:border-teal-400 text-teal-700 hover:bg-teal-50'
                  }`}
                >
                  {isListening ? <MicOff className="h-3 w-3" /> : <Mic className="h-3 w-3" />}
                </Button>

                <Button
                  onClick={() => setIsPlaying(!isPlaying)}
                  variant="outline"
                  size="sm"
                  className="flex-1 py-2 px-2 rounded-md font-medium border border-teal-300 hover:border-teal-400 text-teal-700 hover:bg-teal-50 transition-all duration-200 text-xs"
                >
                  {isPlaying ? <Pause className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                </Button>
              </div>

              <p className="text-xs text-gray-500 text-center animate-fade-in">
                Ask about symptoms & history
              </p>
            </div>
          )}
        </div>

        {/* Progress indicator */}
        {conversationStarted && (
          <div className="mt-3">
            <div className="h-0.5 bg-teal-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
