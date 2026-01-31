import React from "react";

interface ExerciseNavigationProps {
  showResult: boolean;
  canCheckAnswer: boolean;
  onCheckAnswer: () => void;
  currentIndex: number;
  totalExercises: number;
  onPrevious: () => void;
  onNext: () => void;
  onNewExercises: () => void;
}

const ExerciseNavigation: React.FC<ExerciseNavigationProps> = ({
  showResult,
  canCheckAnswer,
  onCheckAnswer,
  currentIndex,
  totalExercises,
  onPrevious,
  onNext,
  onNewExercises,
}) => {
  if (!showResult) {
    return (
      <div className="exercise-actions">
        <button
          className="btn-primary"
          onClick={onCheckAnswer}
          disabled={!canCheckAnswer}
        >
          Check Answer
        </button>
      </div>
    );
  }

  return (
    <div className="exercise-actions">
      <div className="exercise-navigation">
        {currentIndex > 0 && (
          <button className="btn-secondary" onClick={onPrevious}>
            Previous
          </button>
        )}
        {currentIndex < totalExercises - 1 && (
          <button className="btn-primary" onClick={onNext}>
            Next Exercise
          </button>
        )}
        {currentIndex === totalExercises - 1 && (
          <button className="btn-primary" onClick={onNewExercises}>
            New Exercises
          </button>
        )}
      </div>
    </div>
  );
};

export default ExerciseNavigation;
