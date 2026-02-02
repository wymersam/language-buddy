import React from "react";
import { BookOpen } from "lucide-react";

const VocabularyEmptyState: React.FC = () => {
  return (
    <div className="vocabulary-empty-state">
      <div className="vocabulary-empty-content">
        <div className="vocabulary-empty-icon-container">
          <BookOpen size={80} className="vocabulary-empty-icon" />
          <div className="vocabulary-empty-sparkle">
            <div className="sparkle sparkle-1">✨</div>
            <div className="sparkle sparkle-2">✨</div>
            <div className="sparkle sparkle-3">✨</div>
          </div>
        </div>

        <div className="vocabulary-empty-text">
          <h2>Build Your German Vocabulary!</h2>
          <p>
            Your personal vocabulary collection is waiting to grow. Start
            exploring German words in your conversations.
          </p>
        </div>

        <div className="vocabulary-empty-steps">
          <h3>🚀 How to get started:</h3>
          <div className="vocabulary-step-cards">
            <div className="vocabulary-step-card">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>💬 Chat in German</h4>
                <p>Head to the Chat tab and start a conversation</p>
              </div>
            </div>

            <div className="vocabulary-step-card">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>🔍 Select Words</h4>
                <p>Tap any German word in bot messages</p>
              </div>
            </div>

            <div className="vocabulary-step-card">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>📚 Build Library</h4>
                <p>Words automatically save here with context</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VocabularyEmptyState;
