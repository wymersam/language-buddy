import React from "react";
import { Send } from "lucide-react";
import type { MessageInputProps } from "../../types";

const MessageInput: React.FC<MessageInputProps> = ({
  inputMessage,
  setInputMessage,
  onSendMessage,
  onKeyPress,
  isTyping,
}) => {
  return (
    <div className="input-container">
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
