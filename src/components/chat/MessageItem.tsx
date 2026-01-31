import React from "react";
import { Bot, User as UserIcon } from "lucide-react";
import type { MessageItemProps } from "../../types";

interface MessageItemPropsExtended extends MessageItemProps {
  userAvatar?: string;
}

const MessageItem: React.FC<MessageItemPropsExtended> = ({
  message,
  userAvatar,
}) => {
  return (
    <div className={`message-item ${message.isUser ? "user" : "bot"} fade-in`}>
      <div className={`message-content ${message.isUser ? "user" : "bot"}`}>
        <div className={`message-avatar ${message.isUser ? "user" : "bot"}`}>
          {message.isUser ? (
            userAvatar ? (
              <img
                src={userAvatar}
                alt="User avatar"
                className="avatar-image"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "1rem",
                }}
              />
            ) : (
              <UserIcon size={18} className="text-white" />
            )
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
