import React from "react";

interface FillInBlankExerciseProps {
  question: string;
  userAnswer: string;
  onAnswerChange: (answer: string) => void;
  disabled: boolean;
}

const FillInBlankExercise: React.FC<FillInBlankExerciseProps> = ({
  userAnswer,
  onAnswerChange,
  disabled,
}) => {
  return (
    <div className="exercise-fill-blank">
      <p className="exercise-sentence">
        <input
          type="text"
          value={userAnswer}
          onChange={(e) => onAnswerChange(e.target.value)}
          disabled={disabled}
          className="fill-blank-input"
          placeholder="..."
        />
      </p>
    </div>
  );
};

export default FillInBlankExercise;
