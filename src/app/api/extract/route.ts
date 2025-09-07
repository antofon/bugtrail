import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { ChatMessage, BugTrail } from "@/lib/types";
import { extractorSystemPrompt } from "@/lib/prompts";
import { heuristicExtract } from "@/lib/extractor";

export async function POST(request: NextRequest) {
  try {
    const { history }: { history: ChatMessage[] } = await request.json();

    if (!history || history.length === 0) {
      return NextResponse.json({ error: "No conversation history provided" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    
    // If no API key, return a skeleton BugTrail
    if (!apiKey) {
      const skeletonBugtrail: BugTrail = {
        title: "User Reported Issue",
        summary: "Issue reported through support conversation",
        environment: [],
        preconditions: [],
        steps: [],
        expected: "",
        actual: "",
        impact: "",
        evidence: [],
        tags: []
      };
      return NextResponse.json({ bugtrail: skeletonBugtrail });
    }

    try {
      const openai = new OpenAI({ apiKey });

      // Format conversation for OpenAI
      const transcript = history
        .map(m => `${m.role.toUpperCase()}: ${m.text}`)
        .join('\n');

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        max_tokens: 600,
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content: extractorSystemPrompt()
          },
          {
            role: "user",
            content: transcript
          }
        ]
      });

      const responseText = completion.choices[0]?.message?.content?.trim();
      if (!responseText) {
        throw new Error("Empty response from OpenAI");
      }

      try {
        const bugtrail: BugTrail = JSON.parse(responseText);
        return NextResponse.json({ bugtrail });
      } catch (parseError) {
        console.error("Failed to parse OpenAI response as JSON:", parseError);
        // Fallback to heuristic extraction
        const fallbackBugtrail = heuristicExtract(history);
        return NextResponse.json({ bugtrail: fallbackBugtrail });
      }

    } catch (openaiError) {
      console.error("OpenAI API error:", openaiError);
      // Fallback to heuristic extraction
      const fallbackBugtrail = heuristicExtract(history);
      return NextResponse.json({ bugtrail: fallbackBugtrail });
    }

  } catch (error) {
    console.error("Extract API error:", error);
    return NextResponse.json(
      { error: "extract_failed" },
      { status: 500 }
    );
  }
}
