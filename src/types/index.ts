export interface User {
  id: string;
  name: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  targetLanguage: string;
  nativeLanguage: string;
  responseLanguage: "bilingual" | "german-only";
  // generateExercises: boolean;
  avatar?: string; // Base64 encoded image data
}

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export interface MessageInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  isTyping: boolean;
}

export interface Exercise {
  id: string;
  type: "fill-in-blank" | "multiple-choice" | "translation" | "word-order";
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation?: string;
  difficulty: string;
  topic: string;
}

export interface ExampleSentence {
  german: string;
  english: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

export interface VocabularyWord {
  id: string;
  word: string;
  translation: string;
  context: string; // The full message where it was found
  examples?: ExampleSentence[]; // Generated example sentences
  dateAdded: Date;
  sourceLanguage: string;
  targetLanguage: string;
  difficulty?: string;
  timesReviewed?: number;
  lastReviewed?: Date;
}

export interface ExerciseViewProps {
  exercises: Exercise[];
  onComplete?: (exerciseId: string, isCorrect: boolean) => void;
  onNewExercises?: () => void;
  isGeneratingExercises?: boolean;
}

export interface ChatSession {
  id: string;
  messages: Message[];
  startTime: Date;
  endTime?: Date;
}

export interface MessageItemProps {
  message: Message;
}

export interface MessagesListProps {
  messages: Message[];
  isTyping: boolean;
}

export interface StoredMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
}
