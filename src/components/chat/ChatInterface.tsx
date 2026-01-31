import React, { useState, useRef, useEffect } from "react";
import type { User, Message, ChatSession, Exercise } from "../../types";
import { v4 as uuidv4 } from "uuid";
import { generateBotResponse } from "../../utils/chatbot";
import WelcomeMessage from "./WelcomeMessage";
import MessagesList from "./MessagesList";
import MessageInput from "./MessageInput";

interface ChatInterfaceProps {
  user: User;
  currentSession: ChatSession | null;
  setCurrentSession: (session: ChatSession | null) => void;
  onNewExercises?: (exercises: Exercise[]) => void;
  onUserUpdate?: (user: User) => void;
}

export default function ChatInterface({
  user,
  currentSession,
  setCurrentSession,
  onNewExercises,
  onUserUpdate,
}: ChatInterfaceProps) {
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [currentSession?.messages]);

  const toggleExerciseGeneration = () => {
    if (onUserUpdate) {
      onUserUpdate({
        ...user,
        generateExercises: !user.generateExercises,
      });
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: uuidv4(),
      content: inputMessage.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    // Initialize session if needed
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
        const { botResponse, exercises } = await generateBotResponse(
          userMessage.content,
          user,
          currentSession?.messages || [],
          false, // Don't force exercises in chat - let natural conversation trigger them
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

        // Handle exercises if generated
        if (exercises && exercises.length > 0 && onNewExercises) {
          onNewExercises(exercises);
        }
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

  return (
    <div className="chat-container">
      {/* Welcome message if no session */}
      {!currentSession && <WelcomeMessage />}

      {/* Messages list */}
      {currentSession && (
        <MessagesList
          messages={currentSession.messages}
          isTyping={isTyping}
          userAvatar={user.avatar}
          ref={messagesEndRef}
        />
      )}

      {/* Input container */}
      <MessageInput
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        onSendMessage={handleSendMessage}
        onKeyPress={handleKeyPress}
        isTyping={isTyping}
        user={user}
        onToggleExercises={toggleExerciseGeneration}
      />
    </div>
  );
}
