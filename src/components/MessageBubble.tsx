import { ChatMessage } from "@/lib/types";

interface MessageBubbleProps {
  message: ChatMessage;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isAgent = message.role === "agent";
  const timestamp = new Date(message.ts).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className={`flex ${isAgent ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
        isAgent 
          ? "bg-blue-600 text-white" 
          : "bg-gray-100 text-gray-900"
      }`}>
        <div className="text-sm whitespace-pre-wrap">{message.text}</div>
        <div className={`text-xs mt-1 ${
          isAgent ? "text-blue-100" : "text-gray-500"
        }`}>
          {timestamp}
        </div>
      </div>
    </div>
  );
}
