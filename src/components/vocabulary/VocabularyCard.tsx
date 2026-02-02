import React, { useState } from "react";
import { Trash2, Calendar, RotateCcw, Lightbulb, Loader2 } from "lucide-react";
import type { VocabularyWord } from "../../types";
import { generateExampleSentences } from "../../utils/exampleGenerator";

interface VocabularyCardProps {
  word: VocabularyWord;
  onRemoveWord: (wordId: string) => void;
  onUpdateWord?: (updatedWord: VocabularyWord) => void;
}

const VocabularyCard: React.FC<VocabularyCardProps> = ({
  word,
  onRemoveWord,
  onUpdateWord,
}) => {
  const [isGeneratingExamples, setIsGeneratingExamples] = useState(false);
  const [showExamples, setShowExamples] = useState(false);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  };

  const handleGenerateExamples = async () => {
    if (isGeneratingExamples || !onUpdateWord) return;

    setIsGeneratingExamples(true);
    try {
      const examples = await generateExampleSentences(
        word.word,
        word.translation,
      );
      const updatedWord = { ...word, examples };
      onUpdateWord(updatedWord);
      setShowExamples(true);
    } catch (error) {
      console.error("Failed to generate examples:", error);
    } finally {
      setIsGeneratingExamples(false);
    }
  };

  const toggleExamples = () => {
    setShowExamples(!showExamples);
  };

  return (
    <div className="vocabulary-card">
      <div className="vocabulary-card-main">
        <div className="vocabulary-word-section">
          <div className="vocabulary-word">{word.word}</div>
          <div className="vocabulary-translation">{word.translation}</div>
        </div>

        <button
          onClick={() => onRemoveWord(word.id)}
          className="remove-word-button"
          aria-label={`Remove ${word.word} from vocabulary`}
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="vocabulary-card-details">
        {word.examples && word.examples.length > 0 && (
          <div className="vocabulary-examples">
            <div className="examples-header">
              <button
                onClick={toggleExamples}
                className="toggle-examples-button"
              >
                {showExamples ? "Hide" : "Show"} Examples
              </button>
            </div>

            <div className={`examples-list ${!showExamples ? "hidden" : ""}`}>
              {word.examples.map((example, index) => (
                <div
                  key={index}
                  className={`example-item difficulty-${example.difficulty}`}
                >
                  <div className="difficulty-badge">{example.difficulty}</div>
                  <div className="example-sentences">
                    <div className="german-sentence">🇩🇪 {example.german}</div>
                    <div className="english-sentence">🇺🇸 {example.english}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!word.examples && onUpdateWord && (
          <div className="generate-examples-section">
            <button
              onClick={handleGenerateExamples}
              disabled={isGeneratingExamples}
              className="generate-examples-button"
            >
              {isGeneratingExamples ? (
                <>
                  <Loader2 size={14} className="spinning" />
                  Generating examples...
                </>
              ) : (
                <>
                  <Lightbulb size={14} />
                  Generate Example Sentences
                </>
              )}
            </button>
          </div>
        )}

        <div className="vocabulary-meta">
          <div className="vocabulary-date">
            <Calendar size={14} />
            Added {formatDate(word.dateAdded)}
          </div>
          {word.timesReviewed && word.timesReviewed > 0 && (
            <div className="vocabulary-reviews">
              <RotateCcw size={14} />
              Reviewed {word.timesReviewed} times
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VocabularyCard;
