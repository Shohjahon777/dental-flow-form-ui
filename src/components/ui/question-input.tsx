
import { Button } from "@/components/ui/button";

interface QuestionInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isListening: boolean;
  loading: boolean;
  disabled?: boolean;
}

export function QuestionInput({ 
  value, 
  onChange, 
  onSend, 
  isListening, 
  loading, 
  disabled = false 
}: QuestionInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !disabled) {
      onSend();
    }
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={isListening ? "Listening..." : "Type your question here or use voice..."}
        disabled={isListening || disabled}
        className="flex-1 px-3 py-2 border border-teal-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
      <Button
        onClick={onSend}
        disabled={!value.trim() || loading || isListening || disabled}
        className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md text-sm disabled:opacity-50"
      >
        Ask
      </Button>
    </div>
  );
}
