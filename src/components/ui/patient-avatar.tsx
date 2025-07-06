
import { Volume2, User2, Brain, Sparkles, Activity } from "lucide-react";

interface PatientAvatarProps {
  isListening: boolean;
  isPlaying: boolean;
  patientMood: 'calm' | 'anxious' | 'happy';
}

export function PatientAvatar({ isListening, isPlaying, patientMood }: PatientAvatarProps) {
  const getMoodColor = () => {
    switch (patientMood) {
      case 'anxious': return 'from-orange-400 to-red-500';
      case 'happy': return 'from-green-400 to-blue-500';
      default: return 'from-teal-400 to-cyan-500';
    }
  };

  return (
    <div className="relative mb-6 mx-auto w-24 h-24">
      <div className={`absolute inset-0 rounded-full transition-all duration-1000 ${isListening
          ? `animate-ping bg-gradient-to-r ${getMoodColor()} opacity-75`
          : isPlaying
            ? `animate-pulse bg-gradient-to-r ${getMoodColor()} opacity-60`
            : `bg-gradient-to-r ${getMoodColor()} opacity-40`
        }`}></div>

      <div className="absolute inset-2 rounded-full bg-white/80 backdrop-blur-sm border border-teal-200/50"></div>

      <div className={`relative w-20 h-20 mx-auto mt-2 rounded-full bg-gradient-to-br from-white to-teal-50 flex items-center justify-center shadow-lg border-2 border-white transition-all duration-300 ${isListening || isPlaying ? 'scale-110' : 'scale-100'
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
  );
}
