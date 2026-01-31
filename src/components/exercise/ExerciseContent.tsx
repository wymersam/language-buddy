import React from "react";
import type { Exercise } from "../../types";
import MultipleChoiceExercise from "./MultipleChoiceExercise";
import FillInBlankExercise from "./FillInBlankExercise";
import TextInputExercise from "./TextInputExercise";

interface ExerciseContentProps {
  exercise: Exercise;
  userAnswer: string;
  selectedOption: string | null;
  showResult: boolean;
  onAnswerChange: (answer: string) => void;
  onOptionSelect: (option: string) => void;
}

const ExerciseContent: React.FC<ExerciseContentProps> = ({
  exercise,
  userAnswer,
  selectedOption,
  showResult,
  onAnswerChange,
  onOptionSelect,
}) => {
  const renderExerciseInput = () => {
    switch (exercise.type) {
      case "multiple-choice":
        return (
          <MultipleChoiceExercise
            exercise={exercise}
            selectedOption={selectedOption}
            onOptionSelect={onOptionSelect}
            disabled={showResult}
          />
        );

      case "fill-in-blank":
        return (
          <FillInBlankExercise
            question={exercise.question}
            userAnswer={userAnswer}
            onAnswerChange={onAnswerChange}
            disabled={showResult}
          />
        );

      case "translation":
      case "word-order":
        return (
          <TextInputExercise
            userAnswer={userAnswer}
            onAnswerChange={onAnswerChange}
            disabled={showResult}
          />
        );

      default:
        return <p>Exercise type not supported</p>;
    }
  };

  return (
    <div className="exercise-content">
      <h3 className="exercise-title">
        {exercise.type.replace("-", " ").toUpperCase()}
      </h3>
      <p className="exercise-question">{exercise.question}</p>
      {renderExerciseInput()}
    </div>
  );
};

export default ExerciseContent;
