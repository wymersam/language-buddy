import React, { useState } from "react";
import { BookOpen, MessageCircle, Zap } from "lucide-react";
import type { ExerciseViewProps } from "../../types";
import ExerciseHeader from "./ExerciseHeader";
import ExerciseContent from "./ExerciseContent";
import ExerciseResult from "./ExerciseResult";
import ExerciseNavigation from "./ExerciseNavigation";

const ExerciseView: React.FC<ExerciseViewProps> = ({
  exercises,
  onComplete,
  onNewExercises,
  isGeneratingExercises,
}) => {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [lastExercisesLength, setLastExercisesLength] = useState(
    exercises.length,
  );

  // Reset state when exercises array changes
  if (exercises.length !== lastExercisesLength) {
    setCurrentExercise(0);
    setUserAnswer("");
    setSelectedOption(null);
    setShowResult(false);
    setIsCorrect(false);
    setLastExercisesLength(exercises.length);
  }

  if (!exercises.length) {
    return (
      <div className="exercise-container">
        <div className="welcome-container">
          <div className="welcome-card">
            <div className="welcome-icon">
              <BookOpen size={32} className="text-white" />
            </div>
            <h2 className="welcome-title">Ready to Practice?</h2>
            <p className="welcome-description">
              No exercises yet! Here's how to get started with personalized
              practice:
            </p>

            <div className="exercise-tips">
              <div className="tip-item">
                <MessageCircle size={20} className="tip-icon" />
                <div className="tip-content">
                  <strong>Chat with your tutor</strong>
                  <p>
                    Start a conversation in the Chat tab to learn new topics
                  </p>
                </div>
              </div>

              <div className="tip-item">
                <Zap size={20} className="tip-icon" />
                <div className="tip-content">
                  <strong>Generate exercises now</strong>
                  <p>
                    Click the button below to create practice exercises based on
                    your level
                  </p>
                </div>
              </div>
            </div>
            <div className="generate-exercises-btn-container">
              <button
                onClick={() => {
                  console.log("🔥 Generate exercises from empty state");
                  onNewExercises?.();
                }}
                disabled={isGeneratingExercises}
                className="generate-exercises-button"
              >
                {isGeneratingExercises ? (
                  <>
                    <span className="loading-spinner">⏳</span>
                    Generating Exercises...
                  </>
                ) : (
                  <>
                    <BookOpen size={18} />
                    Generate Practice Exercises
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const exercise = exercises[currentExercise];

  // Safety check in case currentExercise index is out of bounds
  if (!exercise) {
    return null;
  }

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
        onNewExercises={onNewExercises || (() => {})}
        isGeneratingExercises={isGeneratingExercises}
      />
    </div>
  );
};

export default ExerciseView;
