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
    // Scroll to show both the latest message and the input buttons
    if (messagesEndRef.current) {
      const chatContainer = messagesEndRef.current.closest('.overflow-y-auto');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }
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
    <div className="glass-strong rounded-2xl border border-white/20 flex flex-col h-[500px] sm:h-[600px] card-hover relative overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-white/10 relative">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <h2 className="text-xl font-bold text-white">Live Roleplay</h2>
        </div>
        {isOfflineMode && (
          <div className="mt-3 p-3 glass-subtle border border-yellow-400/30 rounded-xl text-sm text-yellow-200 flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <span>Running in offline customer mode</span>
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">💬</span>
              </div>
              <p className="text-gray-400 text-base px-4">
                Start by asking the customer what is going on.
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="glass-subtle max-w-xs lg:max-w-md px-4 py-3 rounded-2xl border border-white/10">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 sm:p-6 border-t border-white/10 bg-gradient-to-r from-white/5 to-white/10">
        <div className="flex flex-col sm:flex-row gap-3">
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
          <div className="flex flex-row sm:flex-col gap-3 justify-stretch">
            <Button
              onClick={handleSend}
              disabled={!input.trim() || !scenarioId || isLoading}
              size="sm"
              className="flex-1 sm:flex-none"
            >
              Send
            </Button>
            <Button
              onClick={handleExtract}
              disabled={messages.length === 0 || isExtracting}
              variant="secondary"
              size="sm"
              className="flex-1 sm:flex-none"
            >
              {isExtracting ? "Generating..." : "Generate BugTrail"}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-purple-500/5 pointer-events-none" />
    </div>
  );
}
