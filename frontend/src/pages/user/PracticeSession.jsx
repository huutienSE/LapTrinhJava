import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import { topicService, practiceService } from "../../services";
import { formatLevel } from "../../utils/assessmentLevels.js";
import { PageLoading, PageInlineError } from "../../components/learner/layout/PageStates.jsx";
import { getEnvelopeError, getHttpAwareErrorMessage } from "../../utils/apiError.js";
import { getSpeechRecognition, isSpeechRecognitionSupported } from "../../utils/speechRecognition.js";
import ActionButton from "../../components/common/ActionButton.jsx";

const PracticeSession = () => {
  const { topicId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [topic, setTopic] = useState(location.state?.topic ?? null);
  const [sessionId, setSessionId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [step, setStep] = useState("loading"); // "loading", "question", "feedback", "result"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Speech Recognition States
  const [listening, setListening] = useState(false);
  const [liveText, setLiveText] = useState("");
  const [answerText, setAnswerText] = useState("");

  const recognitionRef = useRef(null);
  const transcriptRef = useRef("");

  // Initialize Speech Recognition
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
        setError("Vui lòng cho phép quyền micro trong trình duyệt để thực hiện luyện nói.");
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

  const initSession = async () => {
    setStep("loading");
    setError(null);
    try {
      let loadedTopic = topic;
      if (!loadedTopic) {
        const topicRes = await topicService.getTopicById(topicId);
        if (topicRes.success) {
          loadedTopic = topicRes.data;
          setTopic(loadedTopic);
        } else {
          setError("Không thể tải thông tin chủ đề.");
          return;
        }
      }

      const startRes = await practiceService.start(Number(topicId));
      const envelopeError = getEnvelopeError(startRes, "Không thể bắt đầu phiên luyện tập.");
      if (envelopeError) {
        setError(envelopeError);
        return;
      }

      if (startRes.success && startRes.data) {
        const { sessionId: sId, questions: qList } = startRes.data;
        if (!sId || !qList?.length) {
          setError("Chưa có câu hỏi luyện tập nào được khởi tạo.");
          return;
        }
        setSessionId(sId);
        setQuestions(qList);
        setStep("question");
      } else {
        setError("Không thể khởi tạo phiên luyện tập.");
      }
    } catch (err) {
      setError(getHttpAwareErrorMessage(err, "Không thể bắt đầu phiên luyện tập."));
    }
  };

  useEffect(() => {
    initSession();
  }, [topicId]);

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

  const handleCancelPractice = () => {
    if (listening) {
      try {
        recognitionRef.current?.abort();
      } catch {
        // ignore
      }
    }
    navigate(`/practice/${topicId}`);
  };

  const handleSubmitAnswer = async () => {
    // Placeholder cho Phase 3
    console.log("Submitting:", answerText);
  };

  if (step === "loading") {
    return <PageLoading message="Đang chuẩn bị phiên luyện tập..." />;
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <Link
          to={`/practice/${topicId}`}
          className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm mb-6"
        >
          ← Quay lại chi tiết chủ đề
        </Link>
        <PageInlineError message={error} onRetry={initSession} />
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  
  // Difficulty levels styles
  const levelStyles = {
    BEGINNER: "bg-green-500/10 text-green-400 border-green-500/30",
    INTERMEDIATE: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    ADVANCED: "bg-red-500/10 text-red-400 border-red-500/30",
  };
  const levelKey = String(currentQuestion?.difficultyLevel || "").toUpperCase();
  const badgeClass = levelStyles[levelKey] ?? "bg-zinc-800 text-zinc-400 border-zinc-700";

  const canSubmit = Boolean(answerText.trim()) && !listening;

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      <Link
        to={`/practice/${topicId}`}
        onClick={handleCancelPractice}
        className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm mb-2"
      >
        ← Hủy và quay lại chi tiết chủ đề
      </Link>

      <header className="text-center">
        <p className="text-zinc-500 text-sm uppercase tracking-wider mb-2">
          Phiên luyện tập · {topic?.topicName}
        </p>
        <h2 className="text-3xl font-bold text-white">
          Câu hỏi {currentIndex + 1} / {questions.length}
        </h2>
      </header>

      {/* Speech Support Banner Warning */}
      {!isSpeechRecognitionSupported() && (
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-200 text-sm">
          ⚠️ Trình duyệt của bạn không hỗ trợ nhận dạng giọng nói (Khuyên dùng Chrome). Bạn vẫn có thể nhập câu trả lời bằng bàn phím ở bên dưới.
        </div>
      )}

      {/* Main Question Card */}
      <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-8 text-center space-y-4">
        <div className="flex justify-center">
          <span className={`text-xs px-2.5 py-1 rounded-md border ${badgeClass}`}>
            Độ khó: {currentQuestion ? formatLevel(currentQuestion.difficultyLevel) : "Chưa xác định"}
          </span>
        </div>
        <h3 className="text-2xl font-bold text-white leading-relaxed">
          {currentQuestion?.description || "Không tìm thấy nội dung câu hỏi."}
        </h3>
      </div>

      {/* Voice Controls (only show if Speech Recognition is supported) */}
      {isSpeechRecognitionSupported() && (
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            type="button"
            onClick={handleRecordStart}
            disabled={listening || loading}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold bg-indigo-500 hover:bg-indigo-600 text-white disabled:opacity-50 transition-all duration-200 active:scale-95"
          >
            🎤 Bắt đầu nói
          </button>
          <button
            type="button"
            onClick={handleRecordStop}
            disabled={!listening || loading}
            aria-pressed={listening}
            className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-bold border transition-all duration-200 active:scale-95 disabled:opacity-50 ${
              listening
                ? "bg-red-500/20 text-red-400 border-red-500/55 animate-pulse"
                : "bg-zinc-800/50 text-zinc-500 border-zinc-800"
            }`}
          >
            ⏹️ Dừng thu âm
          </button>
        </div>
      )}

      {/* Real-time Status Banner */}
      {listening && (
        <p className="text-center text-sm text-amber-300 animate-pulse">
          Đang thu âm giọng nói của bạn... Hãy nhấn "Dừng thu âm" khi bạn nói xong.
        </p>
      )}

      {/* Transcription container (Supports speaking & direct typing) */}
      <div className="bg-zinc-900/80 rounded-2xl p-6 border border-zinc-800 text-left space-y-2">
        <label className="text-zinc-500 text-xs uppercase tracking-wider block font-semibold">
          Nội dung câu trả lời
        </label>
        {listening ? (
          <p className="text-zinc-200 text-lg min-h-[80px] italic leading-relaxed py-2">
            {liveText || "Đang lắng nghe giọng nói của bạn..."}
          </p>
        ) : (
          <textarea
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            placeholder={
              isSpeechRecognitionSupported()
                ? "Nhấn 'Bắt đầu nói' để phát âm, hoặc gõ trực tiếp câu trả lời bằng tiếng Anh tại đây..."
                : "Trình duyệt không hỗ trợ micro. Vui lòng gõ trực tiếp câu trả lời bằng tiếng Anh tại đây..."
            }
            className="w-full bg-transparent text-zinc-200 text-lg min-h-[80px] focus:outline-none resize-none border-0 p-0 leading-relaxed py-2 placeholder-zinc-600 focus:ring-0"
          />
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
        <ActionButton
          variant="add"
          size="lg"
          onClick={handleSubmitAnswer}
          disabled={!canSubmit || loading}
        >
          {loading ? "Đang xử lý..." : "Nộp câu trả lời"}
        </ActionButton>
        <ActionButton variant="primary" size="lg" onClick={handleCancelPractice}>
          Hủy luyện tập
        </ActionButton>
      </div>
    </div>
  );
};

export default PracticeSession;
