export interface TranslationResult {
  original: string;
  translation: string;
  language: string;
}

// Mock translations for development/fallback
const mockTranslations: Record<string, string> = {
  hallo: "hello",
  danke: "thank you",
  bitte: "please",
  "guten morgen": "good morning",
  "guten tag": "good day",
  "guten abend": "good evening",
  "gute nacht": "good night",
  "auf wiedersehen": "goodbye",
  tschüss: "bye",
  entschuldigung: "excuse me",
  "es tut mir leid": "I'm sorry",
  "wie geht es dir": "how are you",
  "mir geht es gut": "I'm doing well",
  "ich liebe dich": "I love you",
  "sprechen sie englisch": "do you speak English",
  "ich verstehe nicht": "I don't understand",
  "können sie mir helfen": "can you help me",
  "wo ist": "where is",
  "wieviel kostet": "how much does it cost",
  "das ist schön": "that is beautiful",
  "sehr gut": "very good",
  "nicht gut": "not good",
  "ich bin müde": "I am tired",
  "ich habe hunger": "I am hungry",
  "ich habe durst": "I am thirsty",
  wasser: "water",
  essen: "food",
  haus: "house",
  auto: "car",
  buch: "book",
  zeit: "time",
  geld: "money",
  arbeit: "work",
  schule: "school",
  familie: "family",
  freund: "friend",
  heute: "today",
  morgen: "tomorrow",
  gestern: "yesterday",
};

export const translateText = async (
  text: string,
  targetLanguage: string = "English",
  sourceLanguage: string = "German",
): Promise<TranslationResult> => {
  try {
    // Check for mock translation first
    const lowerText = text.toLowerCase().trim();
    if (mockTranslations[lowerText]) {
      // Simulate API delay for realism
      await new Promise((resolve) =>
        setTimeout(resolve, 300 + Math.random() * 200),
      );

      return {
        original: text,
        translation: mockTranslations[lowerText],
        language: targetLanguage,
      };
    }

    // Try to use Netlify function for translation
    const response = await fetch("/.netlify/functions/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: `You are a professional translator. Translate ${sourceLanguage} text to ${targetLanguage} accurately and naturally. Return only the translation without explanations.`,
          },
          {
            role: "user",
            content: `Translate this ${sourceLanguage} text to ${targetLanguage}: "${text}"`,
          },
        ],
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const translation =
        data.choices?.[0]?.message?.content?.trim() || `[${text}]`;

      return {
        original: text,
        translation,
        language: targetLanguage,
      };
    } else {
      throw new Error(`API request failed: ${response.status}`);
    }
  } catch (error) {
    console.error("Translation error:", error);

    // Fallback to a generic translation format
    return {
      original: text,
      translation: `[${text}]`,
      language: targetLanguage,
    };
  }
};
