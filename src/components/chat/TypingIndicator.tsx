import React from "react";
import { Bot } from "lucide-react";

const TypingIndicator: React.FC = () => {
  return (
    <div className="typing-container fade-in">
      <div className="typing-content">
        <div className="typing-avatar">
          <Bot size={18} className="text-blue-600" />
        </div>
        <div className="typing-bubble">
          <div className="typing-dots">
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
