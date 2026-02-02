import React, { useState } from "react";
import type { VocabularyWord } from "../../types";
import VocabularyEmptyState from "./VocabularyEmptyState";
import VocabularyHeader from "./VocabularyHeader";
import VocabularyControls from "./VocabularyControls";
import VocabularyList from "./VocabularyList";
import VocabularyNoResults from "./VocabularyNoResults";
import { filterAndSortVocabulary } from "./vocabularyUtils";

interface VocabularyViewProps {
  vocabulary: VocabularyWord[];
  onRemoveWord: (wordId: string) => void;
  onClearAll: () => void;
  onUpdateWord?: (updatedWord: VocabularyWord) => void;
}

const VocabularyView: React.FC<VocabularyViewProps> = ({
  vocabulary,
  onRemoveWord,
  onClearAll,
  onUpdateWord,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "alphabetical">("date");

  // Filter and sort vocabulary
  const filteredVocabulary = filterAndSortVocabulary(
    vocabulary,
    searchTerm,
    sortBy,
  );

  if (vocabulary.length === 0) {
    return <VocabularyEmptyState />;
  }

  return (
    <div className="vocabulary-container">
      <VocabularyHeader
        wordCount={vocabulary.length}
        onClearAll={onClearAll}
        disabled={vocabulary.length === 0}
      />

      <VocabularyControls
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <VocabularyList
        vocabulary={filteredVocabulary}
        onRemoveWord={onRemoveWord}
        onUpdateWord={onUpdateWord}
      />

      {filteredVocabulary.length === 0 && searchTerm && (
        <VocabularyNoResults searchTerm={searchTerm} />
      )}
    </div>
  );
};

export default VocabularyView;
