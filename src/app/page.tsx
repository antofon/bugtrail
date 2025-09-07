"use client";

import { useState, useEffect } from "react";
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              BugTrail
              <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent"> Live Roleplay</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ask questions like an agent. The AI plays the customer. Then generate a BugTrail (the trail of steps that led to the bug).
            </p>
          </div>

          {/* Main App Container */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            {/* Scenario & Persona Section */}
            <div className="bg-gradient-to-r from-orange-50 to-pink-50 p-8 border-b border-white/20">
              <div className="space-y-8">
                <ScenarioPicker
                  selectedScenario={selectedScenario}
                  onScenarioChange={handleScenarioChange}
                />
                <PersonaControls
                  persona={persona}
                  onPersonaChange={setPersona}
                />
              </div>
            </div>

            {/* Main Content - Chat and Report */}
            <div className="p-8">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <ChatWindow
                  scenarioId={selectedScenario}
                  messages={messages}
                  onMessagesChange={setMessages}
                  onExtract={handleExtract}
                />
                <ExtractPanel
                  bugtrail={bugtrail}
                  onCopyMarkdown={handleCopyMarkdown}
                  onCopyJira={handleCopyJira}
                />
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div id="about" className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">About BugTrail</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">How it Works</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">1</span>
                    Choose a realistic support scenario
                  </li>
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">2</span>
                    Chat with the AI customer who reveals facts gradually
                  </li>
                  <li className="flex items-start">
                    <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">3</span>
                    Generate a professional BugTrail report
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Features</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Realistic customer personas with consistent identities</li>
                  <li>• Gradual fact revelation following support best practices</li>
                  <li>• Professional bug report generation</li>
                  <li>• Offline mode for demos without API access</li>
                  <li>• Export to Markdown or Jira formats</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}