import type { User, Message, Exercise } from "../types";
import OpenAI from "openai";

export async function generateBotResponse(
  userMessage: string,
  user: User,
  conversationHistory: Message[],
  forceExercises: boolean = false,
): Promise<{ botResponse: string; exercises?: Exercise[] }> {
  try {
    // Build conversation context for OpenAI
    const systemPrompt = `You are a friendly German language tutor. Your student is at ${user.level} level learning ${user.targetLanguage} and wants to talk to you to practice and improve their German. 

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

IMPORTANT: Your response should have two parts separated by "|||EXERCISES|||":
1. First part: Normal conversational response for the chat
2. Second part: ONLY valid JSON array of exercise objects (no extra text before or after)
Only create exercises when the user has enabled exercise generation: ${user.generateExercises}, otherwise omit the second part entirely and just have the chat response.

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
- ${
      forceExercises
        ? `USER CLICKED NEW EXERCISES BUTTON - MUST GENERATE NOW!
        
Create 5 quick exercises (not 10) based on:
1. User's level (${user.level}) 
2. Mix: fill-in-blank, multiple-choice
3. Focus on common German topics: articles, verbs, adjectives
        
Respond with exercises like this:
"Here are new exercises!

|||EXERCISES|||
[{"type": "fill-in-blank", "question": "Der Mann geht ___ Schule.", "correctAnswer": "zur", "explanation": "Dative feminine", "difficulty": "${user.level}", "topic": "articles"},{"type": "multiple-choice", "question": "Ein klein___ Hund", "options": ["e", "en", "es", "er"], "correctAnswer": "er", "explanation": "Masculine nominative", "difficulty": "${user.level}", "topic": "adjectives"}]"`
        : user.generateExercises
          ? `Create 3-5 exercises when user shows interest in practicing.

CREATE exercises based on:
1. Current conversation topic
2. User's level (${user.level})
3. Keep it simple and focused

Format: First give a brief response, then |||EXERCISES||| then valid JSON array.`
          : "Do NOT create any exercises - omit the |||EXERCISES||| section entirely"
    }
- The second part must be PURE JSON with no additional text
- If no exercises, omit the "|||EXERCISES|||" section entirely

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

    const fullResponse = completion.choices[0]?.message?.content || "";

    // Debug logging for forced exercise generation
    if (forceExercises) {
      console.log("🤖 Full AI Response for forced exercises:", fullResponse);
    }

    // Split response into chat and exercises
    const parts = fullResponse.split("|||EXERCISES|||");
    const chatResponse = parts[0]?.trim() || fullResponse;
    let exercisesPart = parts[1]?.trim();

    if (forceExercises) {
      console.log("📝 Parts split:", { chatResponse, exercisesPart });
    }

    let exercises: Exercise[] | undefined;

    if (exercisesPart) {
      try {
        // Clean up the exercises part - remove any extra text before/after JSON
        const jsonMatch = exercisesPart.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          exercisesPart = jsonMatch[0];
        }

        const parsedExercises: Exercise[] = JSON.parse(exercisesPart);
        exercises = parsedExercises.map((ex, index) => ({
          ...ex,
          id: `exercise_${Date.now()}_${index}`,
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
