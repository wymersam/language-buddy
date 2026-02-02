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
  isGeneratingExercises?: boolean;
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
  isGeneratingExercises,
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
        <button
          className="btn-secondary ml-2"
          onClick={() => {
            onNewExercises();
          }}
          disabled={isGeneratingExercises}
        >
          {isGeneratingExercises ? (
            <>
              <span className="loading-spinner">⏳</span>
              Generating...
            </>
          ) : (
            "New Exercises"
          )}
        </button>
      </div>
    </div>
  );
};

export default ExerciseNavigation;
