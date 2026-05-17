import { useState } from "react";
import { useAssessmentSession } from "../../../hooks/useAssessmentSession.js";
import { useSpeechAnswer } from "../../../hooks/useSpeechAnswer.js";
import AssessmentIntro from "./AssessmentIntro.jsx";
import SpeechAnswerPanel from "./SpeechAnswerPanel.jsx";
import AssessmentAnswerFeedback from "./AssessmentAnswerFeedback.jsx";
import AssessmentFinalResult from "./AssessmentFinalResult.jsx";
import ActionButton from "../../common/ActionButton.jsx";

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

  const {
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
    listening,
    displayText,
    capturedText,
    canSubmit,
    micError,
    startRecording,
    stopRecording,
    clearRecording,
  } = useSpeechAnswer();

  const [submitError, setSubmitError] = useState(null);

  const handleSubmitAnswer = async () => {
    const text = capturedText.trim();
    if (!text) {
      setSubmitError("Vui lòng ghi âm và dừng thu trước khi nộp câu trả lời.");
      return;
    }
    setSubmitError(null);
    const ok = await submitAnswer(text);
    if (ok) clearRecording();
  };

  const displayError = error || submitError || micError;

  if (!browserSupportsSpeechRecognition) {
    return (
      <p className="text-red-400 text-center py-12">
        Trình duyệt không hỗ trợ nhận diện giọng nói. Hãy dùng Chrome.
      </p>
    );
  }

  if (isMicrophoneAvailable === false) {
    return (
      <p className="text-red-400 text-center py-12">
        Microphone bị chặn. Hãy bật quyền micro cho trang này trong cài đặt
        trình duyệt.
      </p>
    );
  }

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
      <div className="space-y-6">
        <div className="flex items-center justify-between text-sm text-zinc-500">
          <span>
            Câu {currentIndex + 1}/{totalQuestions}
          </span>
          <div className="flex-1 mx-4 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-8 text-center">
          <p className="text-zinc-500 text-xs uppercase tracking-widest mb-4">
            Câu hỏi
          </p>
          <h3 className="text-2xl md:text-3xl font-bold text-white leading-snug">
            {currentQuestion.description}
          </h3>
        </div>

        {displayError && (
          <p className="text-red-400 text-sm text-center">{displayError}</p>
        )}

        <SpeechAnswerPanel
          listening={listening}
          displayText={displayText}
          onStart={startRecording}
          onStop={stopRecording}
          onSubmit={handleSubmitAnswer}
          canSubmit={canSubmit}
          isSubmitting={isLoading}
        />

        <div className="text-center">
          <ActionButton
            variant="primary"
            onClick={() => {
              clearRecording();
              setError(null);
              reset();
            }}
          >
            Hủy bài đánh giá
          </ActionButton>
        </div>
      </div>
    );
  }

  return null;
};

export default AssessmentActiveTest;
