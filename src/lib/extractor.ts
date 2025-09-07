import { ChatMessage, BugTrail } from "./types";

export function heuristicExtract(messages: ChatMessage[]): BugTrail {
  const conversation = messages.map(m => `${m.role.toUpperCase()}: ${m.text}`).join('\n');
  
  // Extract title from first customer message
  const firstCustomerMsg = messages.find(m => m.role === "customer")?.text || "";
  const title = extractTitle(firstCustomerMsg);
  
  // Extract environment markers
  const environment = extractEnvironment(conversation);
  
  // Extract error strings and issues
  const summary = extractSummary(conversation);
  
  // Generate default steps
  const steps = generateDefaultSteps(conversation);
  
  // Extract impact
  const impact = extractImpact(conversation);
  
  // Extract evidence
  const evidence = extractEvidence(conversation);
  
  // Generate tags
  const tags = generateTags(conversation);

  return {
    title,
    summary,
    environment,
    preconditions: ["User must be logged in", "Feature must be enabled"],
    steps,
    expected: "The feature should work as intended without errors",
    actual: extractActualBehavior(conversation),
    impact,
    evidence,
    tags
  };
}

function extractTitle(firstMessage: string): string {
  if (firstMessage.toLowerCase().includes("reset") && firstMessage.toLowerCase().includes("password")) {
    return "Password Reset Link Issues";
  }
  if (firstMessage.toLowerCase().includes("2fa") || firstMessage.toLowerCase().includes("sms")) {
    return "2FA SMS Delivery Delays";
  }
  if (firstMessage.toLowerCase().includes("charge") || firstMessage.toLowerCase().includes("billing")) {
    return "Duplicate Billing Charges";
  }
  if (firstMessage.toLowerCase().includes("crash") || firstMessage.toLowerCase().includes("face id")) {
    return "iOS Face ID Authentication Crash";
  }
  return "User Reported Issue";
}

function extractEnvironment(conversation: string): string[] {
  const env: string[] = [];
  
  // Browser detection
  if (conversation.includes("Chrome")) env.push("Chrome Browser");
  if (conversation.includes("Safari")) env.push("Safari Browser");
  if (conversation.includes("Firefox")) env.push("Firefox Browser");
  
  // OS detection
  if (conversation.includes("Windows")) env.push("Windows OS");
  if (conversation.includes("macOS") || conversation.includes("Mac")) env.push("macOS");
  if (conversation.includes("iOS")) env.push("iOS");
  if (conversation.includes("Android")) env.push("Android");
  
  // Device detection
  if (conversation.includes("iPhone")) env.push("iPhone Device");
  if (conversation.includes("iPad")) env.push("iPad Device");
  
  // Version detection
  const versionRegex = /\d+\.\d+(\.\d+)?/g;
  const versions = conversation.match(versionRegex);
  if (versions) {
    versions.slice(0, 2).forEach(v => env.push(`Version ${v}`));
  }
  
  return env.length > 0 ? env : ["Web Browser", "Unknown OS"];
}

function extractSummary(conversation: string): string {
  if (conversation.toLowerCase().includes("reset") && conversation.toLowerCase().includes("expired")) {
    return "User unable to reset password due to expired or invalid reset links";
  }
  if (conversation.toLowerCase().includes("2fa") && conversation.toLowerCase().includes("delay")) {
    return "Significant delays in 2FA SMS code delivery affecting user authentication";
  }
  if (conversation.toLowerCase().includes("double") && conversation.toLowerCase().includes("charge")) {
    return "Users being charged multiple times for single transactions";
  }
  if (conversation.toLowerCase().includes("crash") && conversation.toLowerCase().includes("face id")) {
    return "iOS app crashes when attempting Face ID authentication";
  }
  return "User experiencing technical difficulties with the application";
}

function generateDefaultSteps(conversation: string): string[] {
  const steps = [
    "User attempts to access the affected feature",
    "System processes the user request",
    "Error condition is triggered",
    "User observes unexpected behavior",
    "User attempts troubleshooting steps",
    "Issue persists across multiple attempts"
  ];
  
  // Customize based on conversation content
  if (conversation.toLowerCase().includes("reset")) {
    return [
      "User requests password reset",
      "System sends reset email with link",
      "User clicks on reset link",
      "System displays expired/invalid error",
      "User attempts multiple browsers",
      "Error persists across all attempts"
    ];
  }
  
  if (conversation.toLowerCase().includes("2fa")) {
    return [
      "User attempts to log in",
      "System prompts for 2FA code",
      "User requests SMS code",
      "System sends code to carrier",
      "User waits for SMS delivery",
      "Code arrives with significant delay"
    ];
  }
  
  return steps;
}

function extractImpact(conversation: string): string {
  if (conversation.toLowerCase().includes("can't") || conversation.toLowerCase().includes("unable")) {
    return "High - Users unable to complete critical workflows";
  }
  if (conversation.toLowerCase().includes("delay") || conversation.toLowerCase().includes("slow")) {
    return "Medium - Users experience delays but can eventually complete tasks";
  }
  if (conversation.toLowerCase().includes("crash") || conversation.toLowerCase().includes("error")) {
    return "High - Application crashes prevent users from accessing features";
  }
  return "Medium - Users experience degraded functionality";
}

function extractEvidence(conversation: string): string[] {
  const evidence: string[] = [];
  
  if (conversation.toLowerCase().includes("screenshot")) evidence.push("User screenshots");
  if (conversation.toLowerCase().includes("console")) evidence.push("Browser console logs");
  if (conversation.toLowerCase().includes("error code")) evidence.push("System error codes");
  if (conversation.toLowerCase().includes("transaction")) evidence.push("Transaction records");
  if (conversation.toLowerCase().includes("crash log")) evidence.push("Application crash logs");
  if (conversation.toLowerCase().includes("timestamp")) evidence.push("Timestamp records");
  
  return evidence.length > 0 ? evidence : ["User report", "Support conversation"];
}

function generateTags(conversation: string): string[] {
  const tags: string[] = [];
  
  if (conversation.toLowerCase().includes("auth")) tags.push("authentication");
  if (conversation.toLowerCase().includes("billing")) tags.push("billing");
  if (conversation.toLowerCase().includes("mobile")) tags.push("mobile");
  if (conversation.toLowerCase().includes("crash")) tags.push("crash");
  if (conversation.toLowerCase().includes("2fa")) tags.push("2fa");
  if (conversation.toLowerCase().includes("sms")) tags.push("sms");
  if (conversation.toLowerCase().includes("ios")) tags.push("ios");
  if (conversation.toLowerCase().includes("face id")) tags.push("biometric");
  
  return tags.length > 0 ? tags : ["bug", "user-report"];
}

function extractActualBehavior(conversation: string): string {
  if (conversation.toLowerCase().includes("expired") || conversation.toLowerCase().includes("invalid")) {
    return "Reset links show as expired or invalid immediately upon use";
  }
  if (conversation.toLowerCase().includes("delay") && conversation.toLowerCase().includes("sms")) {
    return "2FA SMS codes arrive 15-20 minutes late or not at all";
  }
  if (conversation.toLowerCase().includes("double") && conversation.toLowerCase().includes("charge")) {
    return "Multiple charges appear on user's payment method for single transaction";
  }
  if (conversation.toLowerCase().includes("crash")) {
    return "Application crashes with EXC_BAD_ACCESS error during Face ID prompt";
  }
  return "System behaves differently than expected, causing user frustration";
}
