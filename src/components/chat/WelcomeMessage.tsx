import React from "react";
import { Bot } from "lucide-react";

const WelcomeMessage: React.FC = () => {
  return (
    <div className="welcome-container">
      <div className="welcome-card">
        <div className="welcome-icon">
          <Bot size={32} className="text-white" />
        </div>
        <h2 className="welcome-title">Hallo! I'm your German tutor</h2>
        <p className="welcome-description">
          Start chatting with me in English or German! I'll help you learn by
          creating personalised exercises based on our conversations.
        </p>
        <p className="welcome-description">
          💡 <strong>Exercise Tips:</strong> Use the 🎯/💬 button next to the
          send button to toggle exercise generation on/off. When enabled, I'll
          automatically create practice exercises from our conversations that
          appear in the Practice tab!
        </p>
      </div>
    </div>
  );
};

export default WelcomeMessage;
