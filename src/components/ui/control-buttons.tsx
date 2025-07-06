
import { Mic, MicOff, Volume2, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ControlButtonsProps {
  isListening: boolean;
  isPlaying: boolean;
  microphoneSupported: boolean;
  connectionStatus: string;
  lastResponse: string;
  loading: boolean;
  onToggleListening: () => void;
  onTogglePlayback: () => void;
  onReset: () => void;
}

export function ControlButtons({ 
  isListening, 
  isPlaying, 
  microphoneSupported, 
  connectionStatus, 
  lastResponse, 
  loading,
  onToggleListening,
  onTogglePlayback,
  onReset
}: ControlButtonsProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="text-center">
        <Button
          onClick={onToggleListening}
          disabled={loading || !microphoneSupported || connectionStatus !== 'connected'}
          variant={isListening ? "default" : "outline"}
          className={`w-full py-3 px-3 rounded-lg font-semibold transition-all duration-300 text-sm ${isListening
              ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md'
              : 'border-2 border-teal-300 hover:border-teal-400 text-teal-700 hover:bg-teal-50'
            }`}
        >
          {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>
        <p className="text-xs text-gray-600 mt-1 leading-tight">
          {isListening ? 'Stop Recording' : 'Voice Question'}
        </p>
      </div>

      <div className="text-center">
        <Button
          onClick={onTogglePlayback}
          disabled={!lastResponse}
          variant="outline"
          className="w-full py-3 px-3 rounded-lg font-semibold border-2 border-teal-300 hover:border-teal-400 text-teal-700 hover:bg-teal-50 transition-all duration-300 text-sm disabled:opacity-50"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
        <p className="text-xs text-gray-600 mt-1 leading-tight">
          {isPlaying ? 'Stop Audio' : 'Replay Response'}
        </p>
      </div>

      <div className="text-center">
        <Button
          onClick={onReset}
          variant="outline"
          className="w-full py-3 px-3 rounded-lg font-semibold border-2 border-red-300 hover:border-red-400 text-red-700 hover:bg-red-50 transition-all duration-300 text-sm"
        >
          Reset
        </Button>
        <p className="text-xs text-gray-600 mt-1 leading-tight">
          End Session
        </p>
      </div>
    </div>
  );
}
