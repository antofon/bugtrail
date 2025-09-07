"use client";

import { ChatMessage } from "@/lib/types";
import { motion } from "framer-motion";
import { User, Bot } from "lucide-react";

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
    <motion.div 
      className={`flex ${isAgent ? "justify-end" : "justify-start"} mb-6`}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${isAgent ? "flex-row-reverse space-x-reverse" : ""}`}>
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isAgent 
            ? "bg-gradient-to-r from-blue-500 to-cyan-500" 
            : "bg-gradient-to-r from-purple-500 to-pink-500"
        }`}>
          {isAgent ? (
            <User className="w-4 h-4 text-white" />
          ) : (
            <Bot className="w-4 h-4 text-white" />
          )}
        </div>
        
        {/* Message Bubble */}
        <motion.div 
          className={`glass-subtle rounded-2xl px-4 py-3 border relative ${
            isAgent 
              ? "border-blue-400/30 bg-gradient-to-r from-blue-500/10 to-cyan-500/10" 
              : "border-purple-400/30 bg-gradient-to-r from-purple-500/10 to-pink-500/10"
          }`}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <div className="text-sm text-white whitespace-pre-wrap leading-relaxed">
            {message.text}
          </div>
          <div className={`text-xs mt-2 opacity-70 ${
            isAgent ? "text-blue-200" : "text-purple-200"
          }`}>
            {timestamp}
          </div>
          
          {/* Subtle glow effect */}
          <div className={`absolute inset-0 rounded-2xl opacity-20 -z-10 ${
            isAgent 
              ? "bg-gradient-to-r from-blue-400 to-cyan-400" 
              : "bg-gradient-to-r from-purple-400 to-pink-400"
          }`} />
        </motion.div>
      </div>
    </motion.div>
  );
}
