import React, { useState } from "react";
import type { Exercise } from "../../types";
import ExerciseHeader from "./ExerciseHeader";
import ExerciseContent from "./ExerciseContent";
import ExerciseResult from "./ExerciseResult";
import ExerciseNavigation from "./ExerciseNavigation";
interface ExerciseViewProps {
  exercises: Exercise[];
  onComplete?: (exerciseId: string, isCorrect: boolean) => void;
}

const ExerciseView: React.FC<ExerciseViewProps> = ({
  exercises,
  onComplete,
}) => {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  if (!exercises.length) {
    return null;
  }

  const exercise = exercises[currentExercise];

  const checkAnswer = () => {
    const answer =
      exercise.type === "multiple-choice" ? selectedOption : userAnswer;
    const correct =
      answer?.toLowerCase().trim() ===
      exercise.correctAnswer.toLowerCase().trim();

    setIsCorrect(correct);
    setShowResult(true);

    if (onComplete) {
      onComplete(exercise.id, correct);
    }
  };

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise((prev) => prev + 1);
      resetExerciseState();
    }
  };

  const previousExercise = () => {
    if (currentExercise > 0) {
      setCurrentExercise((prev) => prev - 1);
      resetExerciseState();
    }
  };

  const resetExerciseState = () => {
    setUserAnswer("");
    setSelectedOption(null);
    setShowResult(false);
    setIsCorrect(false);
  };

  const canCheckAnswer =
    exercise.type === "multiple-choice"
      ? selectedOption !== null
      : userAnswer.trim() !== "";

  return (
    <div className="exercise-container">
      <ExerciseHeader
        currentIndex={currentExercise}
        totalExercises={exercises.length}
        exercise={exercise}
      />

      <ExerciseContent
        exercise={exercise}
        userAnswer={userAnswer}
        selectedOption={selectedOption}
        showResult={showResult}
        onAnswerChange={setUserAnswer}
        onOptionSelect={setSelectedOption}
      />

      {showResult && (
        <ExerciseResult isCorrect={isCorrect} exercise={exercise} />
      )}

      <ExerciseNavigation
        showResult={showResult}
        canCheckAnswer={canCheckAnswer}
        onCheckAnswer={checkAnswer}
        currentIndex={currentExercise}
        totalExercises={exercises.length}
        onPrevious={previousExercise}
        onNext={nextExercise}
        onNewExercises={() => window.location.reload()}
      />
    </div>
  );
};

export default ExerciseView;
