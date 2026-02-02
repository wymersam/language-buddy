import React from "react";

interface VocabularyControlsProps {
  searchTerm: string;
  onSearchChange: (searchTerm: string) => void;
  sortBy: "date" | "alphabetical";
  onSortChange: (sortBy: "date" | "alphabetical") => void;
}

const VocabularyControls: React.FC<VocabularyControlsProps> = ({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
}) => {
  return (
    <div className="vocabulary-controls">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search vocabulary..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="vocabulary-search"
        />
      </div>

      <div className="sort-container">
        <select
          value={sortBy}
          onChange={(e) =>
            onSortChange(e.target.value as "date" | "alphabetical")
          }
          className="vocabulary-sort"
        >
          <option value="date">Newest First</option>
          <option value="alphabetical">A-Z</option>
        </select>
      </div>
    </div>
  );
};

export default VocabularyControls;
