import { useEffect, useRef, useState } from "react";
import { assessmentService } from "../../../services/api.jsx";
import {
  getSpeechRecognition,
  isSpeechRecognitionSupported,
} from "../../../utils/speechRecognition.js";
import { getApiErrorMessage } from "../../../utils/apiError.js";
import ScoreBadge from "../session/ScoreBadge.jsx";
import ActionButton from "../../common/ActionButton.jsx";
import { formatLevel } from "../../../utils/assessmentLevels.js";

const AssessmentTestTab = () => {
  const [step, setStep] = useState("intro");
  const [sessionId, setSessionId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [listening, setListening] = useState(false);
  const [liveText, setLiveText] = useState("");
  const [answerText, setAnswerText] = useState("");

  const recognitionRef = useRef(null);
  const transcriptRef = useRef("");

  useEffect(() => {
    const Recognition = getSpeechRecognition();
    if (!Recognition) return undefined;

    const recognition = new Recognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let text = "";
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      transcriptRef.current = text;
      setLiveText(text);
    };

    recognition.onend = () => {
      setListening(false);
      setAnswerText(transcriptRef.current.trim());
    };

    recognition.onerror = (event) => {
      setListening(false);
      if (event.error === "not-allowed") {
        setError("Vui lòng cho phép quyền micro trong trình duyệt.");
      }
    };

    recognitionRef.current = recognition;

    return () => {
      try {
        recognition.abort();
      } catch {
        // ignore
      }
    };
  }, []);

  const stopRecognition = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    try {
      if (listening) {
        recognition.stop();
      } else {
        recognition.abort();
      }
    } catch {
      setListening(false);
    }
  };

  const resetTest = () => {
    stopRecognition();
    setStep("intro");
    setSessionId(null);
    setQuestions([]);
    setCurrentIndex(0);
    setFeedback(null);
    setResult(null);
    setError(null);
    setLiveText("");
    setAnswerText("");
    transcriptRef.current = "";
    setListening(false);
  };

  const handleStart = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await assessmentService.start();
      if (!response.success) {
        setError(response.message || "Không thể bắt đầu bài đánh giá.");
        return;
      }
      const { sessionId: id, questions: list } = response.data ?? {};
      if (!id || !list?.length) {
        setError("Không đủ câu hỏi để bắt đầu.");
        return;
      }
      setSessionId(id);
      setQuestions(list);
      setCurrentIndex(0);
      setStep("question");
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleRecordStart = () => {
    const recognition = recognitionRef.current;
    if (!recognition || listening) return;

    setError(null);
    setLiveText("");
    setAnswerText("");
    transcriptRef.current = "";

    try {
      recognition.start();
      setListening(true);
    } catch {
      try {
        recognition.abort();
        recognition.start();
        setListening(true);
      } catch {
        setError("Không thể bắt đầu ghi âm. Hãy thử lại.");
      }
    }
  };

  const handleRecordStop = () => {
    if (!listening) return;
    recognitionRef.current?.stop();
  };

  const handleSubmitAnswer = async () => {
    const text = answerText.trim();
    if (!text) {
      setError("Vui lòng ghi âm và dừng thu trước khi nộp.");
      return;
    }

    const question = questions[currentIndex];
    setLoading(true);
    setError(null);
    try {
      const response = await assessmentService.submitAnswer(sessionId, {
        questionId: question.questionId,
        answer: text,
      });
      if (!response.success) {
        setError(response.message || "Không thể nộp câu trả lời.");
        return;
      }
      setFeedback(response.data);
      setLiveText("");
      setAnswerText("");
      transcriptRef.current = "";
      setStep("feedback");
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = async () => {
    const isLast = currentIndex >= questions.length - 1;
    if (!isLast) {
      setFeedback(null);
      setCurrentIndex((i) => i + 1);
      setStep("question");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await assessmentService.commit({ sessionId });
      if (!response.success) {
        setError(response.message || "Không thể hoàn tất bài đánh giá.");
        return;
      }
      setResult(response.data);
      setStep("result");
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (!isSpeechRecognitionSupported()) {
    return (
      <p className="text-red-400 text-center py-8">
        Trình duyệt không hỗ trợ nhận diện giọng nói. Hãy dùng Chrome.
      </p>
    );
  }

  const question = questions[currentIndex];
  const displayText = listening ? liveText : answerText;
  const canSubmit = Boolean(answerText.trim()) && !listening;

  return (
    <div className="space-y-6">
      {error && <p className="text-red-400 text-sm text-center">{error}</p>}

      {step === "intro" && (
        <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-8 text-center">
          <span className="text-4xl mb-4 block">🎯</span>
          <h3 className="text-xl font-semibold text-white mb-2">
            Bài đánh giá trình độ
          </h3>
          <p className="text-zinc-400 text-sm max-w-md mx-auto mb-6">
            10 câu hỏi ngẫu nhiên. Trả lời bằng giọng nói, xem nhận xét sau mỗi
            câu.
          </p>
          <ActionButton variant="add" size="lg" onClick={handleStart}>
            {loading ? "Đang tạo bài..." : "Bắt đầu đánh giá"}
          </ActionButton>
        </div>
      )}

      {step === "question" && question && (
        <>
          <p className="text-sm text-zinc-500 text-center">
            Câu {currentIndex + 1}/{questions.length}
          </p>

          <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-8 text-center">
            <p className="text-zinc-500 text-xs uppercase tracking-widest mb-4">
              Câu hỏi
            </p>
            <h3 className="text-2xl font-bold text-white">{question.description}</h3>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              type="button"
              onClick={handleRecordStart}
              disabled={listening || loading}
              className="px-8 py-4 rounded-2xl font-bold bg-indigo-500 hover:bg-indigo-600 text-white disabled:opacity-50"
            >
              🎤 Bắt đầu nói
            </button>
            <button
              type="button"
              onClick={handleRecordStop}
              disabled={!listening || loading}
              aria-pressed={listening}
              className={`px-8 py-4 rounded-2xl font-bold border-2 transition-all disabled:opacity-50 ${
                listening
                  ? "bg-red-500/20 text-red-400 border-red-500 animate-pulse"
                  : "bg-zinc-800/50 text-zinc-600 border-zinc-800"
              }`}
            >
              ⏹️ Stop Recording
            </button>
          </div>

          {listening && (
            <p className="text-center text-sm text-amber-300/90">
              Đang ghi âm — nhấn Stop Recording khi bạn nói xong.
            </p>
          )}

          <div className="bg-zinc-900/80 rounded-2xl p-6 border border-zinc-800">
            <p className="text-zinc-500 text-xs mb-2 uppercase">Nội dung nhận diện</p>
            <p className="text-zinc-200 text-lg min-h-[28px]">
              {displayText || (
                <span className="text-zinc-600 italic">Chưa có dữ liệu...</span>
              )}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              type="button"
              onClick={handleSubmitAnswer}
              disabled={!canSubmit || loading}
              className="px-8 py-3 rounded-xl font-semibold bg-indigo-500 text-white disabled:opacity-50"
            >
              {loading ? "Đang nộp..." : "Nộp câu trả lời"}
            </button>
            <ActionButton variant="primary" onClick={resetTest}>
              Hủy bài
            </ActionButton>
          </div>
        </>
      )}

      {step === "feedback" && feedback && (
        <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-8 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">
              Kết quả câu {currentIndex + 1}
            </h3>
            <ScoreBadge score={feedback.score} variant="success" suffix=" điểm" />
          </div>
          <div>
            <p className="text-zinc-500 text-sm">Câu trả lời</p>
            <p className="text-zinc-300">{feedback.userAnswer}</p>
          </div>
          <div>
            <p className="text-zinc-500 text-sm">Nhận xét</p>
            <p className="text-indigo-300">{feedback.feedback}</p>
          </div>
          <ActionButton variant="add" size="lg" onClick={handleContinue}>
            {loading
              ? "Đang xử lý..."
              : currentIndex >= questions.length - 1
                ? "Hoàn thành bài đánh giá"
                : "Câu tiếp theo"}
          </ActionButton>
        </div>
      )}

      {step === "result" && result && (
        <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-8 text-center space-y-4">
          <h3 className="text-2xl font-bold text-white">Hoàn thành</h3>
          <ScoreBadge score={result.score} variant="tier" size="md" suffix="/100" />
          <p className="text-indigo-300 font-semibold">
            {formatLevel(result.levelAssigned)}
          </p>
          <ActionButton variant="add" size="lg" onClick={resetTest}>
            Làm bài mới
          </ActionButton>
        </div>
      )}
    </div>
  );
};

export default AssessmentTestTab;
