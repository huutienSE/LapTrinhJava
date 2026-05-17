import { useState } from "react";
import { useAssessmentSession } from "../../../hooks/useAssessmentSession.js";
import AssessmentIntro from "./AssessmentIntro.jsx";
import AssessmentAnswerFeedback from "./AssessmentAnswerFeedback.jsx";
import AssessmentFinalResult from "./AssessmentFinalResult.jsx";
import AssessmentQuestionRecorder from "./AssessmentQuestionRecorder.jsx";

const AssessmentActiveTest = () => {
  const {
    view,
    currentQuestion,
    currentIndex,
    totalQuestions,
    isLastQuestion,
    answerResult,
    finalResult,
    isLoading,
    error,
    setError,
    start,
    submitAnswer,
    advanceAfterFeedback,
    reset,
  } = useAssessmentSession();

  const [submitError, setSubmitError] = useState(null);

  const handleSubmitAnswer = async (text) => {
    setSubmitError(null);
    return submitAnswer(text);
  };

  const displayError = error || submitError;

  if (view === "intro") {
    return (
      <>
        {displayError && (
          <p className="text-red-400 text-sm mb-4 text-center">{displayError}</p>
        )}
        <AssessmentIntro onStart={start} isLoading={isLoading} />
      </>
    );
  }

  if (view === "final" && finalResult) {
    return (
      <AssessmentFinalResult result={finalResult} onRestart={reset} />
    );
  }

  if (view === "feedback" && answerResult) {
    return (
      <>
        {displayError && (
          <p className="text-red-400 text-sm mb-4 text-center">{displayError}</p>
        )}
        <AssessmentAnswerFeedback
          result={answerResult}
          questionNumber={currentIndex + 1}
          isLastQuestion={isLastQuestion}
          onContinue={advanceAfterFeedback}
          isLoading={isLoading}
        />
      </>
    );
  }

  if (view === "question" && currentQuestion) {
    return (
      <AssessmentQuestionRecorder
        key={currentQuestion.questionId}
        question={currentQuestion}
        questionNumber={currentIndex + 1}
        totalQuestions={totalQuestions}
        isLoading={isLoading}
        submitError={submitError}
        onSubmit={handleSubmitAnswer}
        onCancel={() => {
          setError(null);
          reset();
        }}
      />
    );
  }

  return null;
};

export default AssessmentActiveTest;
