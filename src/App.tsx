import { useState, useEffect } from "react";
import { MessageCircle, User as UserIcon, BookOpen } from "lucide-react";
import ChatInterface from "./components/chat/ChatInterface";
import ProfileView from "./components/profile/ProfileView";
import ExerciseView from "./components/exercise/ExerciseView";
import type { User, ChatSession, Exercise } from "./types";
import { v4 as uuidv4 } from "uuid";
import {
  saveUser,
  loadUser,
  saveCurrentSession,
  loadCurrentSession,
  saveExercises,
  loadExercises,
} from "./utils/storage";
import { TabButton } from "./components/TabButton";

const initialUser: User = {
  id: uuidv4(),
  name: "Language Learner",
  level: "A1",
  targetLanguage: "German",
  nativeLanguage: "English",
  responseLanguage: "bilingual",
  generateExercises: true,
};

export default function App() {
  const [activeTab, setActiveTab] = useState<"chat" | "profile" | "exercises">(
    "chat",
  );
  const [user, setUser] = useState<User>(() => loadUser() || initialUser);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(() =>
    loadCurrentSession(),
  );
  const [exercises, setExercises] = useState<Exercise[]>(() => loadExercises());
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

  const handleMoreExercises = async () => {
    setIsGeneratingExercises(true);
    console.log("🔄 Generating new exercises...");

    try {
      // Generate new exercises based on user's overall interaction
      const { generateBotResponse } = await import("./utils/chatbot");
      const genericPrompt = `Please create new practice exercises for me to help me learn German. Mix different types of exercises.`;

      const result = await generateBotResponse(
        genericPrompt,
        user,
        currentSession?.messages || [], // Include conversation history
        true, // Force exercise generation
      );

      console.log("✅ Generated exercises:", result.exercises);

      if (result.exercises && result.exercises.length > 0) {
        setExercises(result.exercises);
        console.log("📝 Updated exercises state");
        // Force re-render by updating key or triggering reset
        setActiveTab("exercises"); // This will re-mount the component
        console.log("🏠 Set active tab to exercises");
      } else {
        console.log("❌ No exercises generated");
      }
    } catch (error) {
      console.error("Failed to generate new exercises:", error);
    } finally {
      setIsGeneratingExercises(false);
    }
  };

  const handleNewExercises = (newExercises: Exercise[]) => {
    setExercises(newExercises);
    // Auto-switch to exercises tab when new exercises are generated
    setActiveTab("exercises");
  };

  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser);
    saveUser(updatedUser);
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
        className={`main-content ${activeTab === "profile" ? "main-content-compact" : ""}`}
      >
        {activeTab === "chat" && (
          <ChatInterface
            user={user}
            currentSession={currentSession}
            setCurrentSession={setCurrentSession}
            onNewExercises={handleNewExercises}
            onUserUpdate={handleUserUpdate}
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
