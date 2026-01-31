import React from "react";

interface TextInputExerciseProps {
  userAnswer: string;
  onAnswerChange: (answer: string) => void;
  disabled: boolean;
  placeholder?: string;
}

const TextInputExercise: React.FC<TextInputExerciseProps> = ({
  userAnswer,
  onAnswerChange,
  disabled,
  placeholder = "Type your answer here...",
}) => {
  return (
    <div className="exercise-text-input">
      <textarea
        value={userAnswer}
        onChange={(e) => onAnswerChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className="exercise-textarea"
        rows={3}
      />
    </div>
  );
};

export default TextInputExercise;
