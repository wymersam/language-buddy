import React from "react";
import type { Exercise } from "../../types";

interface ExerciseHeaderProps {
  currentIndex: number;
  totalExercises: number;
  exercise: Exercise;
}

const ExerciseHeader: React.FC<ExerciseHeaderProps> = ({
  currentIndex,
  totalExercises,
  exercise,
}) => {
  return (
    <div className="exercise-header">
      <div className="exercise-progress">
        <span className="exercise-number">
          {currentIndex + 1} of {totalExercises}
        </span>
        <span className="exercise-topic">{exercise.topic}</span>
      </div>
      <span className="exercise-difficulty">{exercise.difficulty}</span>
    </div>
  );
};

export default ExerciseHeader;
