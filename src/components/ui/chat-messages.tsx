
interface ChatMessage {
  sender: string;
  message: string;
  type: string;
}

interface ChatMessagesProps {
  messages: ChatMessage[];
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  if (messages.length === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-md max-h-48 overflow-y-auto p-3 space-y-2">
      {messages.map((msg, index) => (
        <div key={index} className={`text-sm p-2 rounded ${msg.type === 'question' ? 'bg-blue-50 text-blue-700' :
            msg.type === 'answer' ? 'bg-green-50 text-green-700' :
              'bg-red-50 text-red-700'
          }`}>
          <strong>{msg.sender}:</strong> {msg.message}
        </div>
      ))}
    </div>
  );
}
