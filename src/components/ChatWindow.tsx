"use client";

import { useState, useRef, useEffect } from "react";
import { ChatMessage, ScenarioId, BugTrail } from "@/lib/types";
import { nowIso } from "@/lib/util";
import MessageBubble from "./MessageBubble";
import Textarea from "./Textarea";
import Button from "./Button";

interface ChatWindowProps {
  scenarioId: ScenarioId | null;
  messages: ChatMessage[];
  onMessagesChange: (messages: ChatMessage[]) => void;
  onExtract: (bugtrail: BugTrail) => void;
}

export default function ChatWindow({ 
  scenarioId, 
  messages, 
  onMessagesChange, 
  onExtract 
}: ChatWindowProps) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !scenarioId || isLoading) return;

    const agentMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "agent",
      text: input.trim(),
      ts: nowIso()
    };

    const newMessages = [...messages, agentMessage];
    onMessagesChange(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/roleplay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioId,
          history: newMessages
        })
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();
      
      if (data.offline) {
        setIsOfflineMode(true);
      }

      onMessagesChange([...newMessages, data.message]);
    } catch (error) {
      console.error("Failed to get customer response:", error);
      setIsOfflineMode(true);
      
      // Fallback to offline mode
      try {
        const offlineResponse = await fetch("/api/roleplay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            scenarioId,
            history: newMessages,
            forceOffline: true
          })
        });

        if (offlineResponse.ok) {
          const offlineData = await offlineResponse.json();
          onMessagesChange([...newMessages, offlineData.message]);
        }
      } catch (offlineError) {
        console.error("Offline fallback also failed:", offlineError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleExtract = async () => {
    if (messages.length === 0 || isExtracting) return;

    setIsExtracting(true);

    try {
      const response = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: messages })
      });

      if (!response.ok) {
        throw new Error("Extraction failed");
      }

      const data = await response.json();
      onExtract(data.bugtrail);
    } catch (error) {
      console.error("Failed to extract BugTrail:", error);
      
      // Fallback to heuristic extraction
      const { heuristicExtract } = await import("@/lib/extractor");
      const fallbackBugtrail = heuristicExtract(messages);
      onExtract(fallbackBugtrail);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 flex flex-col h-[600px]">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Live Roleplay</h2>
        {isOfflineMode && (
          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
            Running in offline customer mode.
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-sm">
              Start by asking the customer what is going on.
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-lg bg-gray-100">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <div className="flex-1">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              rows={2}
              disabled={!scenarioId || isLoading}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Button
              onClick={handleSend}
              disabled={!input.trim() || !scenarioId || isLoading}
              size="sm"
            >
              Send
            </Button>
            <Button
              onClick={handleExtract}
              disabled={messages.length === 0 || isExtracting}
              variant="secondary"
              size="sm"
            >
              {isExtracting ? "Generating..." : "Generate BugTrail"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
