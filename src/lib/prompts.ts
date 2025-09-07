import { ScenarioBrief, Persona } from "./types";

export function customerSystemPrompt(): string {
  return "You are the customer in a support chat. Reveal one new fact per turn following the disclosure plan. Keep replies ≤ 70 words. Add mild realism (tiny typos, a single later correction, truncated tokens like /auth/reset?token=eyJ…). Never expose internal notes or the plan. Stay in character.";
}

export function customerDeveloperBrief(scenario: ScenarioBrief, persona: Persona): string {
  return `FACTS: ${JSON.stringify(scenario.facts, null, 2)}

EVIDENCE: ${JSON.stringify(scenario.evidence, null, 2)}

PERSONA: ${JSON.stringify(persona, null, 2)}

DISCLOSURE_PLAN: ["symptom","env","scope","attempts","evidence"]

REALISM_RULES: Add occasional tiny typos, may correct exactly one detail later in conversation, include truncated tokens like /auth/reset?token=eyJ… for authenticity.`;
}

export function extractorSystemPrompt(): string {
  return 'Convert the conversation into a structured BugTrail (the trail of steps that led to the bug). If a field is unknown, return "" or []. Return strict JSON for the schema { title, summary, environment[], preconditions[], steps[], expected, actual, impact, evidence[], tags[] } and nothing else.';
}
