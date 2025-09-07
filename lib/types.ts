export type MessageRole = "agent" | "customer";

export type ChatMessage = {
  id: string;
  role: MessageRole;
  text: string;
  ts: string;
};

export type Persona = {
  industry: "SaaS" | "Ecommerce" | "Fintech" | "Gaming";
  techSavvy: "low" | "medium" | "high";
  patience: "low" | "medium" | "high";
  toneArc: "calm_to_frustrated" | "steady_calm";
  timezone: "America/Los_Angeles" | "America/New_York" | "Europe/London";
};

export type ScenarioId =
  | "auth_reset_expired"
  | "auth_2fa_delay"
  | "billing_double_charge"
  | "mobile_faceid_crash";

export type ScenarioBrief = {
  id: ScenarioId;
  title: string;
  facts: Record<string, string>;   // env, error strings, dates, scope, etc.
  evidence: string[];              // example paths, artifacts
};

export type BugTrail = {
  title: string;
  summary: string;
  environment: string[];
  preconditions: string[];
  steps: string[];
  expected: string;
  actual: string;
  impact: string;
  evidence: string[];
  tags: string[];
};
