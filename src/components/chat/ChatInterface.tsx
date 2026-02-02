import React, { useState, useRef } from "react";
import type {
  User,
  Message,
  ChatSession,
  Exercise,
  VocabularyWord,
} from "../../types";
import { v4 as uuidv4 } from "uuid";
import { generateBotResponse } from "../../utils/chatbot";
import { translateText } from "../../utils/translation";
import WelcomeMessage from "./WelcomeMessage";
import MessagesList from "./MessagesList";
import MessageInput from "./MessageInput";

interface ChatInterfaceProps {
  user: User;
  currentSession: ChatSession | null;
  setCurrentSession: (session: ChatSession | null) => void;
  onNewExercises?: (exercises: Exercise[]) => void;
  onUserUpdate?: (user: User) => void;
  onAddVocabularyWord?: (word: VocabularyWord) => void;
}

export default function ChatInterface({
  user,
  currentSession,
  setCurrentSession,
  onAddVocabularyWord,
}: ChatInterfaceProps) {
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [visibleMessageCount, setVisibleMessageCount] = useState(5); // Show last 5 messages initially
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLoadMoreMessages = () => {
    if (!currentSession || isLoadingMore) return;

    setIsLoadingMore(true);

    // Remember the current scroll position
    const messagesContainer = document.querySelector(".messages-container");
    const currentScrollTop = messagesContainer?.scrollTop || 0;

    // Load 5 more messages
    setTimeout(() => {
      setVisibleMessageCount((prev) => {
        const newCount = Math.min(prev + 5, currentSession.messages.length);

        // Restore scroll position after new messages are loaded
        setTimeout(() => {
          if (messagesContainer) {
            const newScrollHeight = messagesContainer.scrollHeight;
            const scrollDiff = newScrollHeight - currentScrollTop;
            messagesContainer.scrollTop = scrollDiff;
          }
          setIsLoadingMore(false);
        }, 100);

        return newCount;
      });
    }, 300); // Small delay for loading effect
  };

  // Get visible messages (last N messages)
  const getVisibleMessages = () => {
    if (!currentSession) return [];
    const totalMessages = currentSession.messages.length;
    const startIndex = Math.max(0, totalMessages - visibleMessageCount);
    return currentSession.messages.slice(startIndex);
  };

  // Check if there are more messages to load
  const hasMoreMessages = () => {
    if (!currentSession) return false;
    return visibleMessageCount < currentSession.messages.length;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: uuidv4(),
      content: inputMessage.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    // Initialise session if needed
    if (!currentSession) {
      const newSession: ChatSession = {
        id: uuidv4(),
        messages: [userMessage],
        startTime: new Date(),
      };
      setCurrentSession(newSession);
    } else {
      setCurrentSession({
        ...currentSession,
        messages: [...currentSession.messages, userMessage],
      });
    }

    setInputMessage("");
    setIsTyping(true);

    // Simulate bot processing time
    setTimeout(
      async () => {
        const { botResponse } = await generateBotResponse(
          userMessage.content,
          user,
          currentSession?.messages || [],
        );

        const botMessage: Message = {
          id: uuidv4(),
          content: botResponse,
          isUser: false,
          timestamp: new Date(),
        };

        const updatedSession = {
          ...currentSession!,
          messages: [
            ...(currentSession?.messages || []),
            userMessage,
            botMessage,
          ],
        };

        setCurrentSession(updatedSession);
        setIsTyping(false);

        // Scroll to bottom after new message is added (async)
        setTimeout(() => {
          scrollToBottom();
        }, 100);
      },
      1000 + Math.random() * 2000,
    ); // Random delay 1-3 seconds
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTextSelection = async (
    selectedText: string,
    fullText: string,
  ) => {
    // Add selected word to vocabulary
    if (onAddVocabularyWord && selectedText.trim()) {
      try {
        // Get translation for the selected word
        const translationResult = await translateText(selectedText.trim());

        const newVocabularyWord: VocabularyWord = {
          id: uuidv4(),
          word: selectedText.trim(),
          translation: translationResult.translation,
          dateAdded: new Date(),
          context: fullText,
          sourceLanguage: "german",
          targetLanguage: "english",
        };

        onAddVocabularyWord(newVocabularyWord);
      } catch (error) {
        console.error("Failed to translate word:", error);

        // Fallback: add word without translation
        const newVocabularyWord: VocabularyWord = {
          id: uuidv4(),
          word: selectedText.trim(),
          translation: `[${selectedText.trim()}]`, // Fallback translation
          dateAdded: new Date(),
          context: fullText,
          sourceLanguage: "german",
          targetLanguage: "english",
        };

        onAddVocabularyWord(newVocabularyWord);
      }
    }
  };

  return (
    <div className="chat-container">
      {/* Welcome message if no session */}
      {!currentSession && <WelcomeMessage />}

      {/* Messages list */}
      {currentSession && (
        <>
          {hasMoreMessages() && (
            <div className="load-more-container">
              <button
                onClick={handleLoadMoreMessages}
                disabled={isLoadingMore}
                className="load-more-button"
              >
                {isLoadingMore ? (
                  <>
                    <span className="loading-spinner">⟳</span>
                    Loading...
                  </>
                ) : (
                  `Load ${Math.min(5, currentSession.messages.length - visibleMessageCount)} more messages`
                )}
              </button>
            </div>
          )}

          <MessagesList
            messages={getVisibleMessages()}
            isTyping={isTyping}
            userAvatar={user.avatar}
            onTextSelection={handleTextSelection}
            ref={messagesEndRef}
          />
        </>
      )}

      {/* Input container */}
      <MessageInput
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        onSendMessage={handleSendMessage}
        onKeyPress={handleKeyPress}
        isTyping={isTyping}
      />
    </div>
  );
}
