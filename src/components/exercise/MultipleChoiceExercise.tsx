import React from "react";
import type { Exercise } from "../../types";

interface MultipleChoiceExerciseProps {
  exercise: Exercise;
  selectedOption: string | null;
  onOptionSelect: (option: string) => void;
  disabled: boolean;
}

const MultipleChoiceExercise: React.FC<MultipleChoiceExerciseProps> = ({
  exercise,
  selectedOption,
  onOptionSelect,
  disabled,
}) => {
  return (
    <div className="exercise-options">
      {exercise.options?.map((option, index) => (
        <button
          key={index}
          className={`exercise-option ${selectedOption === option ? "selected" : ""}`}
          onClick={() => onOptionSelect(option)}
          disabled={disabled}
        >
          {String.fromCharCode(65 + index)}. {option}
        </button>
      ))}
    </div>
  );
};

export default MultipleChoiceExercise;
