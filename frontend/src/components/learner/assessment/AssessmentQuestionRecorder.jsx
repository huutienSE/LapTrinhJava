import { useEffect, useState } from "react";
import SpeechRecognition from "react-speech-recognition";
import { useSpeechAnswer } from "../../../hooks/useSpeechAnswer.js";
import SpeechAnswerPanel from "./SpeechAnswerPanel.jsx";
import ActionButton from "../../common/ActionButton.jsx";

const AssessmentQuestionRecorder = ({
  question,
  questionNumber,
  totalQuestions,
  isLoading,
  submitError,
  onSubmit,
  onCancel,
}) => {
  const {
    browserSupportsSpeechRecognition,
    listening,
    displayText,
    capturedText,
    canSubmit,
    startRecording,
    stopRecording,
    clearRecording,
  } = useSpeechAnswer();

  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    return () => {
      SpeechRecognition.abortListening();
    };
  }, []);

  if (!browserSupportsSpeechRecognition) {
    return (
      <p className="text-red-400 text-center py-6">
        Trình duyệt không hỗ trợ nhận diện giọng nói. Hãy dùng Chrome.
      </p>
    );
  }

  const handleSubmit = async () => {
    const text = capturedText.trim();
    if (!text) {
      setLocalError("Vui lòng ghi âm và dừng thu trước khi nộp câu trả lời.");
      return;
    }
    setLocalError(null);
    const ok = await onSubmit(text);
    if (ok) clearRecording();
  };

  const displayError = submitError || localError;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-sm text-zinc-500">
        <span>
          Câu {questionNumber}/{totalQuestions}
        </span>
        <div className="flex-1 mx-4 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 transition-all duration-300"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-8 text-center">
        <p className="text-zinc-500 text-xs uppercase tracking-widest mb-4">
          Câu hỏi
        </p>
        <h3 className="text-2xl md:text-3xl font-bold text-white leading-snug">
          {question.description}
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
        onSubmit={handleSubmit}
        canSubmit={canSubmit}
        isSubmitting={isLoading}
      />

      <div className="text-center">
        <ActionButton
          variant="primary"
          onClick={() => {
            clearRecording();
            onCancel();
          }}
        >
          Hủy bài đánh giá
        </ActionButton>
      </div>
    </div>
  );
};

export default AssessmentQuestionRecorder;
