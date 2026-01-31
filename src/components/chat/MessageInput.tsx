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
  const [showStatusTooltip, setShowStatusTooltip] = useState(false);

  const handleToggleExercises = () => {
    onToggleExercises();
    setShowToggleFeedback(true);
    setTimeout(() => setShowToggleFeedback(false), 2000);
  };

  const handleStatusTouch = () => {
    setShowStatusTooltip(!showStatusTooltip);
    // Auto-hide after 3 seconds on mobile
    if (!showStatusTooltip) {
      setTimeout(() => setShowStatusTooltip(false), 2500);
    }
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

      {/* Status indicator */}
      <div className="input-status">
        <span
          className={`status-indicator ${user.generateExercises ? "exercises" : "chat"}`}
          title={
            user.generateExercises
              ? "Practice exercises will be created in the 'Practice' tab"
              : "Regular conversation without exercise generation"
          }
          onClick={handleStatusTouch}
          onTouchStart={handleStatusTouch}
        >
          {user.generateExercises ? "🎯 Exercises ON" : "💬 Chat Only"}
        </span>

        {/* Mobile tooltip */}
        {showStatusTooltip && (
          <div className="mobile-tooltip">
            {user.generateExercises
              ? "Practice exercises will be created in the 'Practice' tab"
              : "Regular conversation without exercise generation"}
          </div>
        )}
      </div>

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
