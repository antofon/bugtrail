import { ChatMessage, ScenarioBrief } from "./types";
import { scenarioBriefs } from "./scenarioBriefs";
import { nowIso, truncatedToken } from "./util";

export function generateOfflineReply(history: ChatMessage[], scenarioId: string): ChatMessage {
  const scenario = scenarioBriefs.find(s => s.id === scenarioId);
  if (!scenario) {
    return {
      id: crypto.randomUUID(),
      role: "customer",
      text: "I'm having some issues with your app. Can you help?",
      ts: nowIso()
    };
  }

  const customerMessages = history.filter(m => m.role === "customer");
  const turnCount = customerMessages.length;

  let response = "";

  switch (turnCount) {
    case 0:
      // Initial symptom
      response = getSymptomResponse(scenario);
      break;
    case 1:
      // Environment details
      response = getEnvironmentResponse(scenario);
      break;
    case 2:
      // Scope and timing
      response = getScopeResponse(scenario);
      break;
    case 3:
      // Attempts made
      response = getAttemptsResponse(scenario);
      break;
    case 4:
      // Evidence available
      response = getEvidenceResponse(scenario);
      break;
    default:
      // Additional details or clarifications
      response = getAdditionalResponse(scenario, turnCount);
  }

  return {
    id: crypto.randomUUID(),
    role: "customer",
    text: response,
    ts: nowIso()
  };
}

function getSymptomResponse(scenario: ScenarioBrief): string {
  const customerName = scenario.facts.customerName || "Customer";
  const responses = {
    auth_reset_expired: `Hi, I'm ${customerName} from ${scenario.facts.customerCompany}. I'm trying to reset my password but the link isn't working. It says the link has expired or is invalid.`,
    auth_2fa_delay: `Hello, this is ${customerName} from ${scenario.facts.customerCompany}. I'm not receiving my 2FA SMS codes. Been waiting like 20 minutes now and still nothing.`,
    billing_double_charge: `Hi there, I'm ${customerName} from ${scenario.facts.customerCompany}. I think I was charged twice for my premium upgrade. My card shows two $49.99 charges.`,
    mobile_faceid_crash: `Hey, this is ${customerName} from ${scenario.facts.customerCompany}. Your iOS app keeps crashing when I try to use Face ID login. It worked fine before the update.`
  };
  return responses[scenario.id as keyof typeof responses] || `Hi, I'm ${customerName}. I'm having some issues with your service.`;
}

function getEnvironmentResponse(scenario: ScenarioBrief): string {
  const env = scenario.facts.environment;
  const responses = {
    auth_reset_expired: `I'm using ${env}. The error shows up right when I click the reset link.`,
    auth_2fa_delay: `I'm on ${env}. My carrier is ${scenario.facts.carrier}. Email 2FA works fine though.`,
    billing_double_charge: `Using ${env}. Both charges happened within seconds of each other.`,
    mobile_faceid_crash: `${env}. The crash happens every single time I try Face ID authentication.`
  };
  return responses[scenario.id as keyof typeof responses] || `I'm using ${env}.`;
}

function getScopeResponse(scenario: ScenarioBrief): string {
  const responses = {
    auth_reset_expired: `This affects all password reset attempts. The link worked initially but stopped after about 2 hours.`,
    auth_2fa_delay: `Seems to be US mobile numbers only. The delay is usually 15-20 minutes, sometimes longer.`,
    billing_double_charge: `This was for the premium plan upgrade. The page seemed to freeze after I clicked, so maybe I clicked twice?`,
    mobile_faceid_crash: `Only happens with Face ID. Passcode login works perfectly fine. Started right after yesterday's app update.`
  };
  return responses[scenario.id as keyof typeof responses] || "It seems to affect multiple users.";
}

function getAttemptsResponse(scenario: ScenarioBrief): string {
  const responses = {
    auth_reset_expired: `I tried 3 different browsers and cleared my cache. Same error every time. The token looks like ${truncatedToken()}`,
    auth_2fa_delay: `I've tried resending the SMS 4 times now. Still waiting. This started about 3 days ago.`,
    billing_double_charge: `I only clicked the upgrade button once, I swear! The transaction IDs are ${scenario.facts.transactionIds}.`,
    mobile_faceid_crash: `I've tried restarting the app, restarting my phone. Nothing works. Error code is ${scenario.facts.errorCode}.`
  };
  return responses[scenario.id as keyof typeof responses] || "I've tried several things but nothing works.";
}

function getEvidenceResponse(scenario: ScenarioBrief): string {
  const evidence = scenario.evidence[0] || "I have some screenshots";
  const responses = {
    auth_reset_expired: `I have ${evidence.toLowerCase()} and browser console logs showing the 401 error.`,
    auth_2fa_delay: `I have ${evidence.toLowerCase()} and can show you the carrier delivery reports too.`,
    billing_double_charge: `I have ${evidence.toLowerCase()} and the payment gateway logs if you need them.`,
    mobile_faceid_crash: `I have ${evidence.toLowerCase()} from iOS Settings and can send the crash symbolication.`
  };
  return responses[scenario.id as keyof typeof responses] || `I have ${evidence.toLowerCase()} if that helps.`;
}

function getAdditionalResponse(scenario: ScenarioBrief, turnCount: number): string {
  const clarifications = [
    "Is there anything else you need to know?",
    "I can provide more details if needed.",
    "Let me know what other info would help.",
    "Should I try anything else while we troubleshoot?",
    "Actually, let me double-check that detail... yes, that's correct."
  ];
  
  return clarifications[turnCount % clarifications.length];
}
