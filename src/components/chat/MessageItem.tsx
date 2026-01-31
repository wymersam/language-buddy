import React from "react";
import { Bot, User as UserIcon } from "lucide-react";
import type { MessageItemProps } from "../../types";

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  return (
    <div className={`message-item ${message.isUser ? "user" : "bot"} fade-in`}>
      <div className={`message-content ${message.isUser ? "user" : "bot"}`}>
        <div className={`message-avatar ${message.isUser ? "user" : "bot"}`}>
          {message.isUser ? (
            <UserIcon size={18} className="text-white" />
          ) : (
            <Bot size={18} className="text-blue-600" />
          )}
        </div>
        <div className={`message-bubble ${message.isUser ? "user" : "bot"}`}>
          <p className="message-text">{message.content}</p>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
