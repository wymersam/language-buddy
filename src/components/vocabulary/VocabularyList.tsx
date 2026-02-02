import React from "react";
import type { VocabularyWord } from "../../types";
import VocabularyCard from "./VocabularyCard";

interface VocabularyListProps {
  vocabulary: VocabularyWord[];
  onRemoveWord: (wordId: string) => void;
  onUpdateWord?: (updatedWord: VocabularyWord) => void;
}

const VocabularyList: React.FC<VocabularyListProps> = ({
  vocabulary,
  onRemoveWord,
  onUpdateWord,
}) => {
  return (
    <div className="vocabulary-list">
      {vocabulary.map((word) => (
        <VocabularyCard
          key={word.id}
          word={word}
          onRemoveWord={onRemoveWord}
          onUpdateWord={onUpdateWord}
        />
      ))}
    </div>
  );
};

export default VocabularyList;
