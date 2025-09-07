import { ScenarioBrief } from "./types";

export const scenarioBriefs: ScenarioBrief[] = [
  {
    id: "auth_reset_expired",
    title: "Reset link expires",
    facts: {
      environment: "Chrome 120.0.6099.109, Windows 11 Pro",
      errorString: "This password reset link has expired or is invalid",
      dateIssued: "2024-01-15 14:30 UTC",
      linkFormat: "/auth/reset?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      scope: "All users requesting password reset",
      attempts: "Tried 3 different browsers, cleared cache",
      timing: "Link worked initially, stopped working after 2 hours"
    },
    evidence: [
      "Screenshot of error page",
      "Browser console showing 401 error",
      "Email timestamp showing reset request",
      "Network tab showing expired token response"
    ]
  },
  {
    id: "auth_2fa_delay",
    title: "2FA SMS delay",
    facts: {
      environment: "iPhone 15 Pro, iOS 17.5.1, Safari",
      carrier: "Verizon",
      delay: "15-20 minutes average delay",
      scope: "US mobile numbers only",
      attempts: "Tried resending 4 times",
      workaround: "Email 2FA works instantly",
      timing: "Started happening 3 days ago"
    },
    evidence: [
      "SMS timestamps showing delay",
      "Carrier delivery reports",
      "Multiple test phone numbers affected",
      "Server logs showing SMS API latency"
    ]
  },
  {
    id: "billing_double_charge",
    title: "Double charge",
    facts: {
      environment: "Safari 17.1, macOS Sonoma 14.1",
      amount: "$49.99 charged twice",
      paymentMethod: "Visa ending in 4532",
      transactionIds: "txn_1234567890, txn_1234567891",
      timing: "Both charges within 2 seconds",
      scope: "Premium plan upgrade",
      attempts: "Clicked upgrade button once, page seemed to freeze"
    },
    evidence: [
      "Bank statement showing duplicate charges",
      "Payment gateway transaction logs",
      "Browser network tab showing duplicate POST requests",
      "Session recording of the upgrade flow"
    ]
  },
  {
    id: "mobile_faceid_crash",
    title: "iOS Face ID crash",
    facts: {
      environment: "iPhone 14, iOS 17.5, BugTrail app v2.1.3",
      trigger: "Face ID authentication prompt",
      errorCode: "EXC_BAD_ACCESS (SIGSEGV)",
      scope: "Only devices with Face ID enabled",
      frequency: "100% reproduction rate",
      workaround: "Passcode login works fine",
      timing: "Started after app update yesterday"
    },
    evidence: [
      "Crash logs from iOS Settings",
      "Xcode crash symbolication",
      "Device console logs",
      "TestFlight crash reports from beta users"
    ]
  }
];
