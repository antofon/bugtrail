"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChatMessage, Persona, ScenarioId, BugTrail } from "@/lib/types";
import { defaultPersona } from "@/lib/persona";
import { saveChat, loadChat, savePersona, loadPersona, saveScenario, loadScenario, saveBugTrail, loadBugTrail } from "@/lib/storage";
import ScenarioPicker from "@/components/ScenarioPicker";
import PersonaControls from "@/components/PersonaControls";
import ChatWindow from "@/components/ChatWindow";
import ExtractPanel from "@/components/ExtractPanel";

export default function Home() {
  const [selectedScenario, setSelectedScenario] = useState<ScenarioId | null>(null);
  const [persona, setPersona] = useState<Persona>(defaultPersona);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [bugtrail, setBugtrail] = useState<BugTrail | null>(null);

  // Load saved state on mount
  useEffect(() => {
    setSelectedScenario(loadScenario());
    setPersona(loadPersona());
    setMessages(loadChat());
    setBugtrail(loadBugTrail());
  }, []);

  // Save state when it changes
  useEffect(() => {
    if (selectedScenario) {
      saveScenario(selectedScenario);
    }
  }, [selectedScenario]);

  useEffect(() => {
    savePersona(persona);
  }, [persona]);

  useEffect(() => {
    saveChat(messages);
  }, [messages]);

  useEffect(() => {
    if (bugtrail) {
      saveBugTrail(bugtrail);
    }
  }, [bugtrail]);

  const handleScenarioChange = (scenarioId: ScenarioId) => {
    setSelectedScenario(scenarioId);
    // Clear chat when scenario changes
    setMessages([]);
    setBugtrail(null);
  };

  const handleExtract = (extractedBugtrail: BugTrail) => {
    setBugtrail(extractedBugtrail);
  };

  const generateMarkdown = (bugtrail: BugTrail): string => {
    return `# ${bugtrail.title}

## Summary
${bugtrail.summary}

## Environment Markers
${bugtrail.environment.map(env => `- ${env}`).join('\n')}

## Preconditions
${bugtrail.preconditions.map(pre => `- ${pre}`).join('\n')}

## Steps to Reproduce
${bugtrail.steps.map((step, i) => `${i + 1}. ${step}`).join('\n')}

## Expected vs Actual
**Expected:** ${bugtrail.expected}

**Actual:** ${bugtrail.actual}

## Impact
${bugtrail.impact}

## Evidence
${bugtrail.evidence.map(ev => `- ${ev}`).join('\n')}

## Tags
${bugtrail.tags.map(tag => `\`${tag}\``).join(', ')}`;
  };

  const generateJiraFormat = (bugtrail: BugTrail): string => {
    return `h1. ${bugtrail.title}

h2. Summary
${bugtrail.summary}

h2. Environment
${bugtrail.environment.map(env => `* ${env}`).join('\n')}

h2. Preconditions
${bugtrail.preconditions.map(pre => `* ${pre}`).join('\n')}

h2. Steps to Reproduce
${bugtrail.steps.map((step) => `# ${step}`).join('\n')}

h2. Expected vs Actual
*Expected:* ${bugtrail.expected}

*Actual:* ${bugtrail.actual}

h2. Impact
${bugtrail.impact}

h2. Evidence
${bugtrail.evidence.map(ev => `* ${ev}`).join('\n')}

h2. Labels
${bugtrail.tags.join(', ')}`;
  };

  const handleCopyMarkdown = () => {
    if (bugtrail) {
      navigator.clipboard.writeText(generateMarkdown(bugtrail));
    }
  };

  const handleCopyJira = () => {
    if (bugtrail) {
      navigator.clipboard.writeText(generateJiraFormat(bugtrail));
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Hero Section */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
          <motion.div 
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 px-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              BugTrail
              <motion.span 
                className="gradient-text-primary block sm:inline"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {" "}Live Roleplay
              </motion.span>
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto px-4 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Ask questions like an agent. The AI plays the customer. Then generate a BugTrail (the trail of steps that led to the bug).
            </motion.p>
          </motion.div>

          {/* Scenario & Persona Controls - Floating Cards */}
          <motion.div 
            className="glass-strong rounded-3xl p-6 sm:p-8 md:p-10 mb-8 card-hover border border-white/20 relative overflow-hidden"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="space-y-8 md:space-y-10">
              <ScenarioPicker
                selectedScenario={selectedScenario}
                onScenarioChange={handleScenarioChange}
              />
              <div className="border-t border-white/10 pt-8">
                <PersonaControls
                  persona={persona}
                  onPersonaChange={setPersona}
                />
              </div>
            </div>
            
            {/* Decorative gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />
          </motion.div>

          {/* Main Content - Chat and Report - Floating Side-by-Side Cards */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              className="card-hover"
            >
              <ChatWindow
                scenarioId={selectedScenario}
                messages={messages}
                onMessagesChange={setMessages}
                onExtract={handleExtract}
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="card-hover"
            >
              <ExtractPanel
                bugtrail={bugtrail}
                onCopyMarkdown={handleCopyMarkdown}
                onCopyJira={handleCopyJira}
              />
            </motion.div>
          </div>
        </div>

        {/* About Section - Enhanced with Floating Badges */}
        <motion.div 
          id="about" 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="glass-strong rounded-3xl p-6 sm:p-8 md:p-10 border border-white/20 card-hover relative overflow-hidden">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-white mb-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              About BugTrail
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              <div>
                <motion.h3 
                  className="text-xl md:text-2xl font-semibold text-white mb-6 flex items-center"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  How it Works
                </motion.h3>
                <ul className="space-y-4 text-gray-300">
                  {[
                    "Choose a realistic support scenario",
                    "Chat with the AI customer who reveals facts gradually", 
                    "Generate a professional BugTrail report"
                  ].map((step, index) => (
                    <motion.li 
                      key={index}
                      className="flex items-start"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <motion.span 
                        className="w-8 h-8 bg-gradient-to-r from-orange-400 to-pink-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4 mt-0.5 flex-shrink-0 shadow-lg"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        {index + 1}
                      </motion.span>
                      <span className="text-base leading-relaxed">{step}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
              
              <div>
                <motion.h3 
                  className="text-xl md:text-2xl font-semibold text-white mb-6"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  Features
                </motion.h3>
                <ul className="space-y-3 text-gray-300">
                  {[
                    "Realistic customer personas with consistent identities",
                    "Gradual fact revelation following support best practices",
                    "Professional bug report generation",
                    "Offline mode for demos without API access",
                    "Export to Markdown or Jira formats"
                  ].map((feature, index) => (
                    <motion.li 
                      key={index}
                      className="flex items-start text-base"
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <span className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mr-3 mt-2.5 flex-shrink-0"></span>
                      {feature}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Decorative gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}