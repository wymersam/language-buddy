import { forwardRef } from "react";
import type { MessagesListProps } from "../../types";
import MessageItem from "./MessageItem";
import TypingIndicator from "./TypingIndicator";

interface MessagesListPropsExtended extends MessagesListProps {
  userAvatar?: string;
}

const MessagesList = forwardRef<HTMLDivElement, MessagesListPropsExtended>(
  ({ messages, isTyping, userAvatar }, ref) => {
    return (
      <div className="messages-container">
        {messages.map((message) => (
          <MessageItem
            key={message.id}
            message={message}
            userAvatar={userAvatar}
          />
        ))}

        {isTyping && <TypingIndicator />}

        <div ref={ref} />
      </div>
    );
  },
);

MessagesList.displayName = "MessagesList";

export default MessagesList;
