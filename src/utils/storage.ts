import type {
  User,
  ChatSession,
  Exercise,
  StoredMessage,
  VocabularyWord,
} from "../types";

// Storage keys
const STORAGE_KEYS = {
  USER: "language-buddy-user",
  CURRENT_SESSION: "language-buddy-current-session",
  EXERCISES: "language-buddy-exercises",
  VOCABULARY: "language-buddy-vocabulary",
} as const;

// Check if localStorage is available
const isLocalStorageAvailable = (): boolean => {
  try {
    const test = "__localStorage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

// User data persistence
export const saveUser = (user: User): void => {
  if (!isLocalStorageAvailable()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (error) {
    console.warn("Failed to save user data:", error);
  }
};

export const loadUser = (): User | null => {
  if (!isLocalStorageAvailable()) return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USER);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch (error) {
    console.warn("Failed to load user data:", error);
    return null;
  }
};

// Chat session persistence
export const saveCurrentSession = (session: ChatSession): void => {
  if (!isLocalStorageAvailable()) return;
  try {
    // Convert dates to strings for JSON serialization
    const sessionToSave = {
      ...session,
      startTime: session.startTime?.toISOString() || new Date().toISOString(),
      endTime: session.endTime?.toISOString(),
      messages: session.messages.map((msg) => ({
        ...msg,
        timestamp: msg.timestamp?.toISOString() || new Date().toISOString(),
      })),
    };
    localStorage.setItem(
      STORAGE_KEYS.CURRENT_SESSION,
      JSON.stringify(sessionToSave),
    );
  } catch (error) {
    console.warn("Failed to save current session:", error);
  }
};

export const loadCurrentSession = (): ChatSession | null => {
  if (!isLocalStorageAvailable()) return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
    if (!stored) return null;

    const parsedSession = JSON.parse(stored);

    return {
      ...parsedSession,
      startTime: new Date(parsedSession.startTime),
      endTime: parsedSession.endTime
        ? new Date(parsedSession.endTime)
        : undefined,
      messages: parsedSession.messages.map((msg: StoredMessage) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      })),
    };
  } catch (error) {
    console.warn("Failed to load current session:", error);
    return null;
  }
};

export const clearCurrentSession = (): void => {
  if (!isLocalStorageAvailable()) return;
  try {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
  } catch (error) {
    console.warn("Failed to clear current session:", error);
  }
};

// Exercises persistence
export const saveExercises = (exercises: Exercise[]): void => {
  if (!isLocalStorageAvailable()) return;
  try {
    localStorage.setItem(STORAGE_KEYS.EXERCISES, JSON.stringify(exercises));
  } catch (error) {
    console.warn("Failed to save exercises:", error);
  }
};

export const loadExercises = (): Exercise[] => {
  if (!isLocalStorageAvailable()) return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.EXERCISES);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.warn("Failed to load exercises:", error);
    return [];
  }
};

// Vocabulary persistence
export const saveVocabulary = (vocabulary: VocabularyWord[]): void => {
  if (!isLocalStorageAvailable()) return;
  try {
    const vocabularyToSave = vocabulary.map((word) => ({
      ...word,
      dateAdded: word.dateAdded.toISOString(),
      lastReviewed: word.lastReviewed?.toISOString(),
    }));
    localStorage.setItem(
      STORAGE_KEYS.VOCABULARY,
      JSON.stringify(vocabularyToSave),
    );
  } catch (error) {
    console.warn("Failed to save vocabulary:", error);
  }
};

export const loadVocabulary = (): VocabularyWord[] => {
  if (!isLocalStorageAvailable()) return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.VOCABULARY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    return parsed.map((word: any) => ({
      ...word,
      dateAdded: new Date(word.dateAdded),
      lastReviewed: word.lastReviewed ? new Date(word.lastReviewed) : undefined,
    }));
  } catch (error) {
    console.warn("Failed to load vocabulary:", error);
    return [];
  }
};

export const addVocabularyWord = (word: VocabularyWord): void => {
  const currentVocabulary = loadVocabulary();

  // Check if word already exists (avoid duplicates)
  const existingWord = currentVocabulary.find(
    (w) =>
      w.word.toLowerCase() === word.word.toLowerCase() &&
      w.sourceLanguage === word.sourceLanguage,
  );

  if (!existingWord) {
    const updatedVocabulary = [...currentVocabulary, word];
    saveVocabulary(updatedVocabulary);
  }
};

export const clearAllData = (): void => {
  if (!isLocalStorageAvailable()) return;
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.warn("Failed to clear all data:", error);
  }
};
