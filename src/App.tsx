import { useState, useEffect } from "react";
import { MessageCircle, User as UserIcon, BookOpen, Book } from "lucide-react";
import ChatInterface from "./components/chat/ChatInterface";
import ProfileView from "./components/profile/ProfileView";
import ExerciseView from "./components/exercise/ExerciseView";
import VocabularyView from "./components/vocabulary/VocabularyView";
import type { User, ChatSession, Exercise, VocabularyWord } from "./types";
import { v4 as uuidv4 } from "uuid";
import {
  saveUser,
  loadUser,
  saveCurrentSession,
  loadCurrentSession,
  saveExercises,
  loadExercises,
  loadVocabulary,
  saveVocabulary,
} from "./utils/storage";
import { TabButton } from "./components/TabButton";

const initialUser: User = {
  id: uuidv4(),
  name: "Language Learner",
  level: "A1",
  targetLanguage: "German",
  nativeLanguage: "English",
  responseLanguage: "bilingual",
};

export default function App() {
  const [activeTab, setActiveTab] = useState<
    "chat" | "profile" | "exercises" | "vocabulary"
  >("chat");
  const [user, setUser] = useState<User>(() => loadUser() || initialUser);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(() =>
    loadCurrentSession(),
  );
  const [exercises, setExercises] = useState<Exercise[]>(() => loadExercises());
  const [vocabulary, setVocabulary] = useState<VocabularyWord[]>(() =>
    loadVocabulary(),
  );
  const [isGeneratingExercises, setIsGeneratingExercises] = useState(false);

  // Save user data when it changes
  useEffect(() => {
    saveUser(user);
  }, [user]);

  // Save session when it changes
  useEffect(() => {
    if (currentSession) {
      saveCurrentSession(currentSession);
    }
  }, [currentSession]);

  // Save exercises when they change
  useEffect(() => {
    saveExercises(exercises);
  }, [exercises]);

  // Save vocabulary when it changes
  useEffect(() => {
    saveVocabulary(vocabulary);
  }, [vocabulary]);

  const handleMoreExercises = async () => {
    setIsGeneratingExercises(true);

    try {
      const exercisePrompt = `Based on our conversation history, create 3-5 new, diverse German language practice exercises for a ${user.level} level student. 
      
Create exercises in this JSON format:
      [
        {
          "id": "unique-id",
          "type": "fill-in-blank" | "multiple-choice" | "translation" | "word-order",
          "question": "Question text in ${user.responseLanguage === "german-only" ? "German" : "English"}",
          "options": ["option1", "option2", "option3", "option4"] // for multiple-choice only
          "correctAnswer": "correct answer",
          "explanation": "Explanation of the answer",
          "difficulty": "${user.level}",
          "topic": "topic name"
        }
      ]
      
Mix different exercise types. Focus on vocabulary and grammar concepts from our conversation. Return only valid JSON, no additional text.`;

      const response = await fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: `You are a German language exercise generator. Create diverse practice exercises in valid JSON format only. No explanations, just JSON.`,
            },
            ...(currentSession?.messages.slice(-5).map((msg) => ({
              role: msg.isUser ? "user" : "assistant",
              content: msg.content,
            })) || []),
            {
              role: "user",
              content: exercisePrompt,
            },
          ],
        }),
      });

      if (response.ok) {
        const completion = await response.json();
        const exerciseContent = completion.choices[0]?.message?.content || "";

        try {
          // Extract JSON from response (in case there's extra text)
          const jsonMatch = exerciseContent.match(/\[.*\]/s);
          const jsonText = jsonMatch ? jsonMatch[0] : exerciseContent;
          const newExercises = JSON.parse(jsonText);

          if (Array.isArray(newExercises) && newExercises.length > 0) {
            const exercisesWithIds = newExercises.map((ex, index) => ({
              ...ex,
              id: ex.id || `exercise-${Date.now()}-${index}`,
            }));

            setExercises(exercisesWithIds);
          } else {
            throw new Error("No valid exercises returned");
          }
        } catch (parseError) {
          console.error("Failed to parse exercises JSON:", parseError);
        }
      } else {
        throw new Error(`API request failed: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to generate new exercises:", error);
    } finally {
      setIsGeneratingExercises(false);
    }
  };

  const handleNewExercises = (newExercises: Exercise[]) => {
    setExercises(newExercises);
  };

  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser);
    saveUser(updatedUser);
  };

  const handleRemoveVocabularyWord = (wordId: string) => {
    setVocabulary((prev) => prev.filter((word) => word.id !== wordId));
  };

  const handleUpdateVocabularyWord = (updatedWord: VocabularyWord) => {
    setVocabulary((prev) =>
      prev.map((word) => (word.id === updatedWord.id ? updatedWord : word)),
    );
  };

  const handleClearAllVocabulary = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all vocabulary words? This action cannot be undone.",
      )
    ) {
      setVocabulary([]);
    }
  };

  const handleAddVocabularyWord = (word: VocabularyWord) => {
    setVocabulary((prev) => {
      // Check if word already exists to avoid duplicates
      const exists = prev.some(
        (existingWord) =>
          existingWord.word.toLowerCase() === word.word.toLowerCase(),
      );

      if (!exists) {
        return [...prev, word];
      }
      return prev;
    });
  };

  return (
    <div className="app-container">
      <div className="bg-pattern"></div>

      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">Language Buddy</h1>
          <div className="user-info">
            {user.level} {user.targetLanguage}
          </div>
        </div>
      </header>

      <main
        className={`main-content ${activeTab === "profile" ? "main-content-compact" : activeTab === "exercises" ? "main-content-compact" : ""}`}
      >
        {activeTab === "chat" && (
          <ChatInterface
            user={user}
            currentSession={currentSession}
            setCurrentSession={setCurrentSession}
            onNewExercises={handleNewExercises}
            onUserUpdate={handleUserUpdate}
            onAddVocabularyWord={handleAddVocabularyWord}
          />
        )}

        {activeTab === "profile" && (
          <ProfileView user={user} setUser={handleUserUpdate} />
        )}

        {activeTab === "exercises" && (
          <ExerciseView
            exercises={exercises}
            onNewExercises={handleMoreExercises}
            isGeneratingExercises={isGeneratingExercises}
          />
        )}

        {activeTab === "vocabulary" && (
          <VocabularyView
            vocabulary={vocabulary}
            onRemoveWord={handleRemoveVocabularyWord}
            onClearAll={handleClearAllVocabulary}
            onUpdateWord={handleUpdateVocabularyWord}
          />
        )}
      </main>

      <nav className="bottom-nav">
        <div className="nav-content">
          <TabButton
            id="chat"
            icon={MessageCircle}
            label="Chat"
            active={activeTab === "chat"}
            onClick={setActiveTab}
          />
          <TabButton
            id="exercises"
            icon={BookOpen}
            label="Practice"
            active={activeTab === "exercises"}
            onClick={setActiveTab}
          />
          <TabButton
            id="vocabulary"
            icon={Book}
            label="Vocabulary"
            active={activeTab === "vocabulary"}
            onClick={setActiveTab}
          />
          <TabButton
            id="profile"
            icon={UserIcon}
            label="Profile"
            active={activeTab === "profile"}
            onClick={setActiveTab}
          />
        </div>
      </nav>
    </div>
  );
}
