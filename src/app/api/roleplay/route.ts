import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { ChatMessage, ScenarioId } from "@/lib/types";
import { scenarioBriefs } from "@/lib/scenarioBriefs";
import { defaultPersona } from "@/lib/persona";
import { customerSystemPrompt, customerDeveloperBrief } from "@/lib/prompts";
import { generateOfflineReply } from "@/lib/offlineCustomer";
import { nowIso } from "@/lib/util";

export async function POST(request: NextRequest) {
  try {
    const { scenarioId, history, forceOffline }: { 
      scenarioId: ScenarioId; 
      history: ChatMessage[];
      forceOffline?: boolean;
    } = await request.json();

    const scenario = scenarioBriefs.find(s => s.id === scenarioId);
    if (!scenario) {
      return NextResponse.json({ error: "Invalid scenario" }, { status: 400 });
    }

    // Check if we should use offline mode
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey || forceOffline) {
      const offlineMessage = generateOfflineReply(history, scenarioId);
      return NextResponse.json({ 
        message: offlineMessage, 
        offline: true 
      });
    }

    // Get the last agent message
    const agentMessages = history.filter(m => m.role === "agent");
    const lastAgentMessage = agentMessages[agentMessages.length - 1];
    
    if (!lastAgentMessage) {
      return NextResponse.json({ error: "No agent message found" }, { status: 400 });
    }

    try {
      const openai = new OpenAI({ apiKey });

      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        max_tokens: 400,
        temperature: 0.3,
        top_p: 0.9,
        frequency_penalty: 0.1,
        stop: ["\n\nAgent:", "Agent:", "\n\n"],
        messages: [
          {
            role: "system",
            content: customerSystemPrompt()
          },
          {
            role: "developer",
            content: customerDeveloperBrief(scenario, defaultPersona)
          },
          {
            role: "user",
            content: `Previous conversation context:
${history.slice(-4).map(m => `${m.role.toUpperCase()}: ${m.text}`).join('\n')}

Agent just said: """${lastAgentMessage.text}"""

Reply as the customer with ≤ 70 words and reveal one new fact. Remember to maintain strict consistency with any facts you've already established about yourself (name, details, etc.). If the agent gets something wrong about you, politely correct them.`
          }
        ]
      });

      const responseText = completion.choices[0]?.message?.content?.trim();
      if (!responseText) {
        throw new Error("Empty response from OpenAI");
      }

      const customerMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "customer",
        text: responseText,
        ts: nowIso()
      };

      return NextResponse.json({ message: customerMessage });

    } catch (openaiError) {
      console.error("OpenAI API error:", openaiError);
      
      // Fallback to offline mode
      const offlineMessage = generateOfflineReply(history, scenarioId);
      return NextResponse.json({ 
        message: offlineMessage, 
        offline: true 
      });
    }

  } catch (error) {
    console.error("Roleplay API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
