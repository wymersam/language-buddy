import { forwardRef } from "react";
import type { MessagesListProps } from "../../types";
import MessageItem from "./MessageItem";
import TypingIndicator from "./TypingIndicator";

const MessagesList = forwardRef<HTMLDivElement, MessagesListProps>(
  ({ messages, isTyping }, ref) => {
    return (
      <div className="messages-container">
        {messages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}

        {isTyping && <TypingIndicator />}

        <div ref={ref} />
      </div>
    );
  },
);

MessagesList.displayName = "MessagesList";

export default MessagesList;
