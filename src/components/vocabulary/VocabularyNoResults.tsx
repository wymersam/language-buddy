import React from "react";

interface VocabularyNoResultsProps {
  searchTerm: string;
}

const VocabularyNoResults: React.FC<VocabularyNoResultsProps> = ({
  searchTerm,
}) => {
  return (
    <div className="vocabulary-no-results">
      <p>No words found matching "{searchTerm}"</p>
    </div>
  );
};

export default VocabularyNoResults;
