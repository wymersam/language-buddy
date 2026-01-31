export interface User {
  id: string;
  name: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  targetLanguage: string;
  nativeLanguage: string;
  responseLanguage: "bilingual" | "german-only";
  generateExercises: boolean;
  avatar?: string; // Base64 encoded image data
}

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
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
