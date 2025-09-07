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
    <div className="space-y-8">
      {/* Scenario & Persona Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="space-y-6">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
  );
}