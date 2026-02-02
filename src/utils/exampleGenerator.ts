export interface ExampleSentence {
  german: string;
  english: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

export const generateExampleSentences = async (
  germanWord: string,
  translation: string,
): Promise<ExampleSentence[]> => {
  try {
    // Try to use Netlify function for example generation
    const response = await fetch("/.netlify/functions/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: `You are a German language teacher. Generate 3 example sentences using the German word "${germanWord}" (${translation}) at different difficulty levels: beginner, intermediate, and advanced. 

Return the response as a JSON array with this exact format:
[
  {"german": "sentence in German", "english": "sentence in English", "difficulty": "beginner"},
  {"german": "sentence in German", "english": "sentence in English", "difficulty": "intermediate"},
  {"german": "sentence in German", "english": "sentence in English", "difficulty": "advanced"}
]

Make the sentences practical and natural. For beginner level, use simple vocabulary and basic sentence structure. For intermediate, use more complex grammar. For advanced, use sophisticated vocabulary and sentence construction.`,
          },
          {
            role: "user",
            content: `Generate 3 example sentences which use the German word "${germanWord}" in a sentence with the English translation "${translation}"`,
          },
        ],
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content?.trim();

      if (content) {
        try {
          const examples = JSON.parse(content);
          if (Array.isArray(examples) && examples.length > 0) {
            return examples;
          }
        } catch (parseError) {
          console.error("Failed to parse example sentences JSON:", parseError);
        }
      }
    }
  } catch (error) {
    console.error("Error generating example sentences:", error);
  }

  // Fallback examples
  return generateFallbackExamples(germanWord, translation);
};

const generateFallbackExamples = (
  germanWord: string,
  translation: string,
): ExampleSentence[] => {
  const lowerWord = germanWord.toLowerCase().trim();

  // Basic fallback examples for common words
  const fallbacks: Record<string, ExampleSentence[]> = {
    hallo: [
      {
        german: "Hallo! Wie geht es dir?",
        english: "Hello! How are you?",
        difficulty: "beginner",
      },
      {
        german: "Er sagte hallo zu allen Gästen.",
        english: "He said hello to all the guests.",
        difficulty: "intermediate",
      },
      {
        german: "Mit einem freundlichen Hallo begrüßte sie ihre Kollegen.",
        english: "With a friendly hello, she greeted her colleagues.",
        difficulty: "advanced",
      },
    ],
    danke: [
      {
        german: "Danke für deine Hilfe.",
        english: "Thank you for your help.",
        difficulty: "beginner",
      },
      {
        german: "Ich möchte dir herzlich danken.",
        english: "I would like to thank you warmly.",
        difficulty: "intermediate",
      },
      {
        german: "Ohne ein Wort des Dankes verließ er den Raum.",
        english: "Without a word of thanks, he left the room.",
        difficulty: "advanced",
      },
    ],
    haus: [
      {
        german: "Das ist mein Haus.",
        english: "This is my house.",
        difficulty: "beginner",
      },
      {
        german: "Wir haben gestern ein neues Haus gekauft.",
        english: "We bought a new house yesterday.",
        difficulty: "intermediate",
      },
      {
        german: "Das imposante Haus wurde im 19. Jahrhundert erbaut.",
        english: "The imposing house was built in the 19th century.",
        difficulty: "advanced",
      },
    ],
  };

  if (fallbacks[lowerWord]) {
    return fallbacks[lowerWord];
  }

  // Generic fallback
  return [
    {
      german: `Das ist ${germanWord}.`,
      english: `This is ${translation}.`,
      difficulty: "beginner",
    },
    {
      german: `Ich kenne ${germanWord} sehr gut.`,
      english: `I know ${translation} very well.`,
      difficulty: "intermediate",
    },
    {
      german: `${germanWord} spielt eine wichtige Rolle.`,
      english: `${translation} plays an important role.`,
      difficulty: "advanced",
    },
  ];
};
