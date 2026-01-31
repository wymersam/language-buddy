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
          creating personalized exercises based on our conversations.
        </p>
        <div className="welcome-badge">✨ AI-powered learning</div>
      </div>
    </div>
  );
};

export default WelcomeMessage;
