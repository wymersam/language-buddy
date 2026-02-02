import React, { useState, useRef, useEffect } from "react";
import { Bot, User as UserIcon } from "lucide-react";
import type { MessageItemProps } from "../../types";
import { translateText, type TranslationResult } from "../../utils/translation";

interface MessageItemPropsExtended extends MessageItemProps {
  userAvatar?: string;
  onTextSelection?: (selectedText: string, fullText: string) => void;
}

interface TooltipState {
  show: boolean;
  x: number;
  y: number;
  loading: boolean;
  result?: TranslationResult;
}

const MessageItem: React.FC<MessageItemPropsExtended> = ({
  message,
  userAvatar,
  onTextSelection,
}) => {
  const [tooltip, setTooltip] = useState<TooltipState>({
    show: false,
    x: 0,
    y: 0,
    loading: false,
  });
  const [isSelecting, setIsSelecting] = useState(false);
  const messageRef = useRef<HTMLParagraphElement>(null);
  const selectionTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const checkForSelection = async () => {
    if (message.isUser) return;

    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();

    if (selectedText && selectedText.length > 0 && messageRef.current) {
      // Get the bounding rect of the message for positioning
      const messageRect = messageRef.current.getBoundingClientRect();
      const x = messageRect.left + messageRect.width / 2;
      const y = messageRect.top - 70; // Above the message

      // Show loading tooltip
      setTooltip({ show: true, x, y, loading: true });

      try {
        const translationResult = await translateText(
          selectedText,
          "English",
          "German",
        );

        setTooltip({
          show: true,
          x,
          y,
          loading: false,
          result: translationResult,
        });

        // Auto-hide after 8 seconds (longer for mobile)
        setTimeout(() => {
          setTooltip({ show: false, x: 0, y: 0, loading: false });
        }, 8000);

        if (onTextSelection) {
          onTextSelection(selectedText, message.content);
        }
      } catch (error) {
        console.error("Translation failed:", error);
        setTooltip({ show: false, x: 0, y: 0, loading: false });
      }
    } else {
      setTooltip({ show: false, x: 0, y: 0, loading: false });
    }
  };

  const handleSelectionChange = () => {
    if (!isSelecting) return;

    // Clear any existing timeout
    if (selectionTimeoutRef.current) {
      clearTimeout(selectionTimeoutRef.current);
    }

    // Debounce selection checking
    selectionTimeoutRef.current = setTimeout(checkForSelection, 500);
  };

  const handleTouchStart = () => {
    setIsSelecting(true);
  };

  const handleTouchEnd = () => {
    // Give time for selection to settle
    setTimeout(() => {
      checkForSelection();
      setIsSelecting(false);
    }, 300);
  };

  const handleMouseUp = () => {
    setTimeout(checkForSelection, 100);
  };

  const handleClickOutside = () => {
    setTooltip({ show: false, x: 0, y: 0, loading: false });
    if (selectionTimeoutRef.current) {
      clearTimeout(selectionTimeoutRef.current);
    }
  };

  // Monitor selection changes for mobile
  useEffect(() => {
    const handleSelectionChangeGlobal = () => {
      if (message.isUser) return;
      handleSelectionChange();
    };

    document.addEventListener("selectionchange", handleSelectionChangeGlobal);
    return () => {
      document.removeEventListener(
        "selectionchange",
        handleSelectionChangeGlobal,
      );
      if (selectionTimeoutRef.current) {
        clearTimeout(selectionTimeoutRef.current);
      }
    };
  }, [isSelecting, message.isUser]);

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
          <p
            ref={messageRef}
            className="message-text"
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onClick={handleClickOutside}
            style={
              !message.isUser
                ? {
                    userSelect: "text",
                    WebkitUserSelect: "text",
                    WebkitTouchCallout: "none",
                    WebkitTapHighlightColor: "rgba(0,0,0,0)",
                    cursor: "text",
                    lineHeight: "1.6",
                  }
                : {}
            }

            // onDoubleClick={() => {
            //   if (!message.isUser) {
            //     navigator.clipboard.writeText(message.content);
            //     console.log(message.content, "copied to clipboard");
            //   }
            // }}
          >
            {message.content}
          </p>

          {/* Translation Tooltip */}
          {tooltip.show && (
            <div
              className={`translation-tooltip ${tooltip.loading ? "loading" : ""}`}
              style={{
                left: tooltip.x,
                top: tooltip.y,
              }}
            >
              {tooltip.loading ? (
                <>
                  <span className="translation-spinner">⟳</span>
                  Translating...
                </>
              ) : tooltip.result ? (
                <div className="tooltip-content">
                  <div className="tooltip-original">
                    {tooltip.result.original}
                  </div>
                  <div className="tooltip-translation">
                    {tooltip.result.translation}
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
