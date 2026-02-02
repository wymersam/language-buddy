import React, { useState } from "react";
import { Send } from "lucide-react";
import type { User } from "../../types";

interface MessageInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  isTyping: boolean;
  user: User;
  onToggleExercises: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  inputMessage,
  setInputMessage,
  onSendMessage,
  onKeyPress,
  isTyping,
  user,
  onToggleExercises,
}) => {
  const [showToggleFeedback, setShowToggleFeedback] = useState(false);

  const handleToggleExercises = () => {
    onToggleExercises();
    setShowToggleFeedback(true);
    setTimeout(() => setShowToggleFeedback(false), 2000);
  };

  return (
    <div className="input-container">
      {/* Toggle feedback message */}
      {showToggleFeedback && (
        <div className="toggle-feedback">
          {user.generateExercises
            ? "Exercises enabled"
            : "Switched to chat only"}
        </div>
      )}

      <div className="input-wrapper">
        <div className="input-field-wrapper">
          <textarea
            name="chatbot-input"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={onKeyPress}
            placeholder="Type your message..."
            className="input-field"
            rows={1}
            disabled={isTyping}
          />
        </div>

        <button
          onClick={handleToggleExercises}
          className={`input-exercise-toggle ${user.generateExercises ? "enabled" : "disabled"}`}
          title={
            user.generateExercises
              ? "Currently generating exercises from conversations. Click to switch to chat-only mode."
              : "Currently in chat-only mode. Click to enable automatic exercise generation based on your conversations."
          }
        >
          {user.generateExercises ? "🎯" : "💬"}
        </button>

        <button
          onClick={onSendMessage}
          disabled={!inputMessage.trim() || isTyping}
          className="send-button"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;
