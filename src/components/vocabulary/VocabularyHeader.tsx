import React from "react";
import { Trash2 } from "lucide-react";

interface VocabularyHeaderProps {
  wordCount: number;
  onClearAll: () => void;
  disabled?: boolean;
}

const VocabularyHeader: React.FC<VocabularyHeaderProps> = ({
  wordCount,
  onClearAll,
  disabled = false,
}) => {
  return (
    <div className="vocabulary-header">
      <div className="vocabulary-title-section">
        <h1 className="vocabulary-title">My Vocabulary</h1>
        <div className="vocabulary-stats">
          <span className="word-count">{wordCount} words learned</span>
        </div>
      </div>

      <div className="vocabulary-actions">
        <button
          onClick={onClearAll}
          className="clear-all-button"
          disabled={disabled}
        >
          <Trash2 size={16} />
          Clear All
        </button>
      </div>
    </div>
  );
};

export default VocabularyHeader;
