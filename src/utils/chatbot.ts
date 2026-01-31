import type { User, Message, Exercise } from "../types";
import OpenAI from "openai";

// Initialise OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY || "",
  dangerouslyAllowBrowser: true, // Note: In production, use a backend API
});

export async function generateBotResponse(
  userMessage: string,
  user: User,
  conversationHistory: Message[],
): Promise<{ botResponse: string; exercises?: Exercise[] }> {
  try {
    // Check if OpenAI API key is available
    if (!import.meta.env.VITE_OPENAI_API_KEY) {
      return {
        botResponse: "Sorry, the OpenAI API key is not configured.",
      };
    }

    // Build conversation context for OpenAI
    const systemPrompt = `You are a friendly and encouraging German language tutor. Your student is at ${user.level} level learning ${user.targetLanguage} and wants to talk to you to practice and improve their German. 

Current student profile:
- Level: ${user.level}
- Target Language: ${user.targetLanguage}
- Native Language: ${user.nativeLanguage}
- Weak areas: ${user.weakAreas.join(", ")}
- Strengths: ${user.strengths.join(", ")}
- Response Language Preference: ${user.responseLanguage}

Language Guidelines:
${
  user.responseLanguage === "german-only"
    ? "- IMPORTANT: Respond ONLY in German. Do not use English translations or explanations."
    : "- Use both German and English. For beginners (A1/A2), provide English translations and explanations."
}

IMPORTANT: Your response should have two parts separated by "|||EXERCISES|||":
1. First part: Normal conversational response for the chat
2. Second part: ONLY valid JSON array of exercise objects (no extra text before or after)

Exercise JSON format (MUST be valid JSON):
[{
  "type": "fill-in-blank",
  "question": "exercise question",
  "correctAnswer": "correct answer",
  "explanation": "why this is correct",
  "difficulty": "${user.level}",
  "topic": "grammar topic"
}]

For multiple-choice exercises, add: "options": ["option1", "option2", "option3", "option4"]

CRITICAL: 
- Only create exercises when the user mentions topics related to: ${user.weakAreas.join(", ")}
- The second part must be PURE JSON with no additional text
- If no exercises, omit the "|||EXERCISES|||" section entirely

General Guidelines:
1. If the user's level is A1 or A2, use simple vocabulary and short sentences.
2. Adapt complexity to their level.
3. Create 1-2 targeted exercises based on their input and weak areas.

Remember: You're helping them learn German through conversation and practice.`;

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      ...conversationHistory.slice(-6).map(
        (msg): OpenAI.Chat.Completions.ChatCompletionMessageParam => ({
          role: msg.isUser ? "user" : "assistant",
          content: msg.content,
        }),
      ),
      { role: "user", content: userMessage },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
      max_tokens: 300,
      temperature: 0.8,
    });

    const fullResponse = completion.choices[0]?.message?.content || "";

    // Split response into chat and exercises
    const parts = fullResponse.split("|||EXERCISES|||");
    const chatResponse = parts[0]?.trim() || fullResponse;
    let exercisesPart = parts[1]?.trim();

    let exercises: Exercise[] | undefined;

    if (exercisesPart) {
      try {
        // Clean up the exercises part - remove any extra text before/after JSON
        const jsonMatch = exercisesPart.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          exercisesPart = jsonMatch[0];
        }

        interface ParsedExercise {
          type:
            | "fill-in-blank"
            | "multiple-choice"
            | "translation"
            | "word-order";
          question: string;
          options?: string[];
          correctAnswer: string;
          explanation?: string;
          difficulty: string;
          topic: string;
        }

        const parsedExercises: ParsedExercise[] = JSON.parse(exercisesPart);
        exercises = parsedExercises.map((ex, index) => ({
          id: `exercise_${Date.now()}_${index}`,
          ...ex,
        }));
        
        console.log(`Generated ${exercises.length} exercises`);
      } catch (error) {
        console.warn("Failed to parse exercises:", error);
        console.warn("Raw exercises part:", exercisesPart);
      }
    }

    return {
      botResponse: chatResponse,
      exercises,
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    return {
      botResponse:
        "I'm having trouble connecting to my brain right now. Let's try again later!",
    };
  }
}
