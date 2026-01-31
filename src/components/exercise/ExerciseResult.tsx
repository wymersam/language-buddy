import React from "react";
import type { Exercise } from "../../types";

interface ExerciseResultProps {
  isCorrect: boolean;
  exercise: Exercise;
}

const ExerciseResult: React.FC<ExerciseResultProps> = ({
  isCorrect,
  exercise,
}) => {
  return (
    <div className={`exercise-result ${isCorrect ? "correct" : "incorrect"}`}>
      <div className="result-icon">{isCorrect ? "✅" : "❌"}</div>
      <div className="result-content">
        <p className="result-feedback">
          {isCorrect ? "Correct!" : "Not quite right."}
        </p>
        <p className="correct-answer">
          <strong>Correct answer:</strong> {exercise.correctAnswer}
        </p>
        {exercise.explanation && (
          <p className="exercise-explanation">{exercise.explanation}</p>
        )}
      </div>
    </div>
  );
};

export default ExerciseResult;
