import { ChatMessage, Persona, ScenarioId, BugTrail } from "./types";
import { defaultPersona } from "./persona";

const STORAGE_KEYS = {
  CHAT: "bugtrail_chat",
  PERSONA: "bugtrail_persona", 
  SCENARIO: "bugtrail_scenario",
  BUGTRAIL: "bugtrail_report"
} as const;

export function saveChat(messages: ChatMessage[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.CHAT, JSON.stringify(messages));
  }
}

export function loadChat(): ChatMessage[] {
  if (typeof window === "undefined") return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CHAT);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function savePersona(persona: Persona): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.PERSONA, JSON.stringify(persona));
  }
}

export function loadPersona(): Persona {
  if (typeof window === "undefined") return defaultPersona;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PERSONA);
    return stored ? JSON.parse(stored) : defaultPersona;
  } catch {
    return defaultPersona;
  }
}

export function saveScenario(scenarioId: ScenarioId): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.SCENARIO, scenarioId);
  }
}

export function loadScenario(): ScenarioId | null {
  if (typeof window === "undefined") return null;
  
  return localStorage.getItem(STORAGE_KEYS.SCENARIO) as ScenarioId | null;
}

export function saveBugTrail(bugtrail: BugTrail): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.BUGTRAIL, JSON.stringify(bugtrail));
  }
}

export function loadBugTrail(): BugTrail | null {
  if (typeof window === "undefined") return null;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.BUGTRAIL);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function clearAllStorage(): void {
  if (typeof window !== "undefined") {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}
