import React from "react";

interface FillInBlankExerciseProps {
  question: string;
  userAnswer: string;
  onAnswerChange: (answer: string) => void;
  disabled: boolean;
}

const FillInBlankExercise: React.FC<FillInBlankExerciseProps> = ({
  question,
  userAnswer,
  onAnswerChange,
  disabled,
}) => {
  const parts = question.split("___");

  return (
    <div className="exercise-fill-blank">
      <p className="exercise-sentence">
        {parts[0]}
        <input
          type="text"
          value={userAnswer}
          onChange={(e) => onAnswerChange(e.target.value)}
          disabled={disabled}
          className="fill-blank-input"
          placeholder="..."
        />
        {parts[1]}
      </p>
    </div>
  );
};

export default FillInBlankExercise;
