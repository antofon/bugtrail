export function nowIso(): string {
  return new Date().toISOString();
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function truncatedToken(): string {
  const tokens = [
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9...",
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik1UaEV...",
    "sk-proj-1234567890abcdef...",
    "sess_1234567890abcdef..."
  ];
  return tokens[Math.floor(Math.random() * tokens.length)];
}
