import type { User, Message } from "../types";
import OpenAI from "openai";

export async function generateBotResponse(
  userMessage: string,
  user: User,
  conversationHistory: Message[],
): Promise<{ botResponse: string }> {
  try {
    // Build conversation context for OpenAI
    const systemPrompt = `You are a friendly German language tutor. 
    Your student is at ${user.level} level learning ${user.targetLanguage} 
    and wants to talk to you to practice and improve their German. 

Current student profile:
- Level: ${user.level}
- Target Language: ${user.targetLanguage}
- Native Language: ${user.nativeLanguage}
- Response Language Preference: ${user.responseLanguage}

Language Guidelines:
${
  user.responseLanguage === "german-only"
    ? "- CRITICAL: Respond ONLY in German. Do NOT use English translations or explanations."
    : user.responseLanguage === "bilingual"
      ? "Provide English translations alongside the German."
      : ""
}

General Guidelines:
1. If the user's level is A1 or A2, use simple vocabulary and short sentences.
2. Adapt complexity to user's level.
3. When the exercise is about 'spelling', don't show the answer in the question.
`;

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...conversationHistory.slice(-3).map(
        (msg): OpenAI.Chat.Completions.ChatCompletionMessageParam => ({
          role: msg.isUser ? "user" : "assistant",
          content: msg.content,
        }),
      ),
      { role: "user", content: userMessage },
    ];

    const res = await fetch("/.netlify/functions/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    });

    if (!res.ok) {
      throw new Error(`Function error: ${res.status}`);
    }

    const completion = await res.json();

    const chatResponse = completion.choices[0]?.message?.content || "";

    return {
      botResponse: chatResponse,
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    return {
      botResponse:
        "I'm having trouble connecting to my brain right now. Let's try again later!",
    };
  }
}
