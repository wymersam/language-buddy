import type { VocabularyWord } from "../../types";

export const filterAndSortVocabulary = (
  vocabulary: VocabularyWord[],
  searchTerm: string,
  sortBy: "date" | "alphabetical",
): VocabularyWord[] => {
  return vocabulary
    .filter(
      (word) =>
        word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.translation.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (sortBy === "date") {
        return (
          new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
        );
      } else {
        return a.word.localeCompare(b.word);
      }
    });
};
