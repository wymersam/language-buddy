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
  weakAreas: ["adjective endings", "der/die/das articles"],
  strengths: ["basic vocabulary", "present tense"],
  responseLanguage: "bilingual",
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

  const handleNewExercises = (newExercises: Exercise[]) => {
    setExercises(newExercises);
    // Auto-switch to exercises tab when new exercises are generated
    setActiveTab("exercises");
  };

  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser);
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

      <main className="main-content">
        {activeTab === "chat" && (
          <ChatInterface
            user={user}
            currentSession={currentSession}
            setCurrentSession={setCurrentSession}
            onNewExercises={handleNewExercises}
          />
        )}

        {activeTab === "profile" && (
          <ProfileView user={user} setUser={handleUserUpdate} />
        )}

        {activeTab === "exercises" && <ExerciseView exercises={exercises} />}
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
