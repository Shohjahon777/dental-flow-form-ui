
import { Wifi, WifiOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ConnectionStatusProps {
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
  isListening: boolean;
  isPlaying: boolean;
}

export function ConnectionStatus({ connectionStatus, isListening, isPlaying }: ConnectionStatusProps) {
  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'connected': return <Wifi className="w-3 h-3 text-green-600" />;
      case 'connecting': return <Wifi className="w-3 h-3 text-yellow-600 animate-pulse" />;
      case 'error': return <WifiOff className="w-3 h-3 text-red-600" />;
      default: return <WifiOff className="w-3 h-3 text-gray-400" />;
    }
  };

  return (
    <div className="flex items-center justify-center space-x-2">
      <Badge variant="outline" className={`text-xs font-medium transition-all duration-300 ${isListening
          ? 'bg-teal-100 text-teal-700 border-teal-300'
          : isPlaying
            ? 'bg-blue-100 text-blue-700 border-blue-300'
            : 'bg-gray-100 text-gray-600 border-gray-300'
        }`}>
        <div className={`w-2 h-2 rounded-full mr-1 ${isListening
            ? 'bg-teal-500 animate-pulse'
            : isPlaying
              ? 'bg-blue-500 animate-pulse'
              : 'bg-gray-400'
          }`}></div>
        {isListening ? 'Listening...' : isPlaying ? 'Responding' : 'Standby'}
      </Badge>

      <Badge variant="outline" className="text-xs bg-gradient-to-r from-teal-50 to-cyan-50 text-teal-700 border-teal-200">
        {getConnectionIcon()}
        <span className="ml-1">{connectionStatus === 'connected' ? 'Online' : 'Offline'}</span>
      </Badge>
    </div>
  );
}
