import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import { topicService, practiceService } from "../../services";
import { PageLoading, PageInlineError } from "../../components/learner/layout/PageStates.jsx";
import { getEnvelopeError, getHttpAwareErrorMessage } from "../../utils/apiError.js";
import { getSpeechRecognition, isSpeechRecognitionSupported } from "../../utils/speechRecognition.js";
import ActionButton from "../../components/common/ActionButton.jsx";
import ScoreBadge from "../../components/learner/session/ScoreBadge.jsx";

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

  // AI Evaluation Feedback
  const [feedback, setFeedback] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);

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
    const text = answerText.trim();
    if (!text) {
      setError("Vui lòng ghi âm giọng nói hoặc nhập câu trả lời trước khi nộp.");
      return;
    }

    const question = questions[currentIndex];
    setLoading(true);
    setError(null);
    try {
      const response = await practiceService.answerQuestion(sessionId, {
        questionId: question.questionId,
        answer: text,
      });
      const envelopeError = getEnvelopeError(response, "Không thể nộp câu trả lời.");
      if (envelopeError) {
        setError(envelopeError);
        return;
      }
      setFeedback(response.data);
      setLiveText("");
      setAnswerText("");
      transcriptRef.current = "";
      setStep("feedback");
    } catch (err) {
      setError(getHttpAwareErrorMessage(err, "Không thể nộp câu trả lời."));
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = async () => {
    const isLast = currentIndex >= questions.length - 1;
    if (!isLast) {
      setFeedback(null);
      setLiveText("");
      setAnswerText("");
      transcriptRef.current = "";
      setCurrentIndex((i) => i + 1);
      setStep("question");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const commitRes = await practiceService.commit({ sessionId });
      const envelopeError = getEnvelopeError(commitRes, "Không thể hoàn thành phiên luyện tập.");
      if (envelopeError) {
        setError(envelopeError);
        return;
      }

      const detailRes = await practiceService.getSessionDetail(sessionId);
      const detailError = getEnvelopeError(detailRes, "Không thể tải chi tiết kết quả.");
      if (detailError) {
        setError(detailError);
        return;
      }

      setSummaryData({
        score: commitRes.data.score,
        answeredQuestions: commitRes.data.answeredQuestions,
        totalQuestions: commitRes.data.totalQuestions,
        questions: detailRes.data.questions,
      });
      setStep("result");
    } catch (err) {
      setError(getHttpAwareErrorMessage(err, "Có lỗi xảy ra khi hoàn thành phiên luyện tập."));
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = () => {
    setSessionId(null);
    setQuestions([]);
    setCurrentIndex(0);
    setFeedback(null);
    setSummaryData(null);
    setExpandedIndex(null);
    setLiveText("");
    setAnswerText("");
    transcriptRef.current = "";
    setError(null);
    initSession();
  };

  if (step === "loading") {
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
    return <PageLoading message="Đang chuẩn bị phiên luyện tập..." />;
  }

  const currentQuestion = questions[currentIndex];

  if (!isSpeechRecognitionSupported()) {
    return (
      <div className="max-w-3xl mx-auto py-8 text-center">
        <Link
          to={`/practice/${topicId}`}
          className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm mb-6"
        >
          ← Quay lại chi tiết chủ đề
        </Link>
        <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-8 text-center">
          <span className="text-4xl mb-4 block">⚠️</span>
          <p className="text-red-400 font-semibold">
            Trình duyệt không hỗ trợ nhận diện giọng nói. Vui lòng sử dụng Google Chrome để thực hiện luyện tập nói.
          </p>
        </div>
      </div>
    );
  }

  const displayText = listening ? liveText : answerText;
  const canSubmit = Boolean(answerText.trim()) && !listening;

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      <Link
        to={`/practice/${topicId}`}
        onClick={step !== "result" ? handleCancelPractice : undefined}
        className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm mb-2"
      >
        {step === "result" ? "← Quay lại chi tiết chủ đề" : "← Hủy và quay lại chi tiết chủ đề"}
      </Link>

      <header className="text-center">
        <p className="text-zinc-500 text-sm uppercase tracking-wider mb-2">
          Phiên luyện tập · {topic?.topicName}
        </p>
        {step !== "result" && (
          <h2 className="text-3xl font-bold text-white">
            Câu hỏi {currentIndex + 1} / {questions.length}
          </h2>
        )}
      </header>

      {step !== "result" && error && (
        <PageInlineError
          message={error}
          onRetry={step === "question" ? handleSubmitAnswer : undefined}
        />
      )}

      {/* STEP 2: ACTIVE QUESTION VIEW */}
      {step === "question" && currentQuestion && (
        <>
          {/* Main Question Card */}
          <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-8 text-center space-y-4">
            <h3 className="text-2xl font-bold text-white leading-relaxed">
              {currentQuestion.description}
            </h3>
          </div>

          {/* Voice Controls */}
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
              ⏹️ Stop Recording
            </button>
          </div>

          {/* Real-time Status Banner */}
          {listening && (
            <p className="text-center text-sm text-amber-300 animate-pulse">
              Đang thu âm giọng nói của bạn... Hãy nhấn "Stop Recording" khi bạn nói xong.
            </p>
          )}

          {/* Transcription container */}
          <div className="bg-zinc-900/80 rounded-2xl p-6 border border-zinc-800 text-left space-y-2">
            <p className="text-zinc-500 text-xs uppercase tracking-wider font-semibold">Nội dung nhận diện</p>
            <p className="text-zinc-200 text-lg min-h-[28px] leading-relaxed">
              {displayText || (
                <span className="text-zinc-600 italic">Chưa có dữ liệu... Nhấp "Bắt đầu nói" để trả lời.</span>
              )}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <ActionButton
              variant="add"
              size="lg"
              onClick={handleSubmitAnswer}
              disabled={!canSubmit || loading}
            >
              {loading ? "Đang chấm điểm..." : "Nộp câu trả lời"}
            </ActionButton>
            <ActionButton variant="primary" size="lg" onClick={handleCancelPractice} disabled={loading}>
              Hủy luyện tập
            </ActionButton>
          </div>
        </>
      )}

      {/* STEP 3: REAL-TIME FEEDBACK DISPLAY VIEW */}
      {step === "feedback" && feedback && (
        <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-8 space-y-6">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
            <h3 className="text-xl font-semibold text-white">
              Kết quả câu {currentIndex + 1}
            </h3>
            <ScoreBadge score={feedback.score} variant="success" suffix=" điểm" />
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1 font-semibold">Câu hỏi</p>
              <p className="text-white text-lg font-medium bg-zinc-900/40 p-4 rounded-xl border border-zinc-800/40 leading-relaxed">
                {feedback.question}
              </p>
            </div>
            
            <div>
              <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1 font-semibold">Câu trả lời của bạn</p>
              <p className="text-zinc-200 text-lg bg-zinc-900/45 p-4 rounded-xl border border-zinc-800/40 leading-relaxed">
                {feedback.userAnswer}
              </p>
            </div>

            <div>
              <p className="text-zinc-500 text-xs uppercase tracking-wider mb-1 font-semibold">Nhận xét chi tiết của AI</p>
              <div className="text-indigo-300 text-lg bg-indigo-500/5 p-5 rounded-2xl border border-indigo-500/10 leading-relaxed">
                {feedback.feedback}
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <ActionButton variant="add" size="lg" onClick={handleContinue}>
              {currentIndex >= questions.length - 1 ? "Hoàn thành phiên luyện tập" : "Câu tiếp theo"}
            </ActionButton>
          </div>
        </div>
      )}

      {/* STEP 4: DETAILED SESSION COMPLETION DASHBOARD */}
      {step === "result" && summaryData && (
        <div className="space-y-6 animate-fadeIn">
          {/* Main Results Card */}
          <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-8 text-center space-y-6 relative overflow-hidden">
            {/* Visual gradient backdrop */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />
            
            <div className="relative space-y-4">
              <span className="text-sm font-semibold tracking-wider text-indigo-400 uppercase">
                Kết quả phiên luyện tập
              </span>
              <h3 className="text-3xl font-extrabold text-white leading-tight">
                {topic?.topicName}
              </h3>
              
              <div className="flex justify-center py-4">
                <div className="relative flex items-center justify-center w-36 h-36 rounded-full border-4 border-zinc-850 bg-zinc-900/90 shadow-2xl">
                  {/* Subtle inner circular gradient */}
                  <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-indigo-500/10 to-emerald-500/5 animate-pulse" />
                  
                  <div className="relative text-center">
                    <span className="block text-4xl font-extrabold text-white">
                      {summaryData.score}
                    </span>
                    <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest block mt-0.5">
                      Điểm TB
                    </span>
                  </div>
                </div>
              </div>

              <div className="max-w-md mx-auto">
                <p className="text-lg font-semibold text-zinc-200">
                  {summaryData.score >= 80 ? (
                    <span className="text-emerald-400 flex items-center justify-center gap-1.5">
                      🎉 Tuyệt vời! Bạn hoàn thành xuất sắc.
                    </span>
                  ) : summaryData.score >= 50 ? (
                    <span className="text-amber-400 flex items-center justify-center gap-1.5">
                      👍 Khá tốt! Hãy tiếp tục phát huy nhé.
                    </span>
                  ) : (
                    <span className="text-rose-400 flex items-center justify-center gap-1.5">
                      💪 Cố lên! Hãy luyện tập thêm để cải thiện điểm số.
                    </span>
                  )}
                </p>
                <p className="text-zinc-500 text-sm mt-1">
                  Hệ thống đã ghi nhận điểm số của bạn vào lịch sử học tập.
                </p>
              </div>
            </div>

            {/* Micro Stats Grid */}
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto pt-4 border-t border-zinc-800/60 relative">
              <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-850 text-center">
                <span className="block text-zinc-500 text-[10px] uppercase font-semibold tracking-wider">
                  Số câu đã trả lời
                </span>
                <span className="block text-xl font-bold text-white mt-1">
                  {summaryData.answeredQuestions} / {summaryData.totalQuestions}
                </span>
              </div>
              <div className="bg-zinc-900/40 p-4 rounded-xl border border-zinc-850 text-center">
                <span className="block text-zinc-500 text-[10px] uppercase font-semibold tracking-wider">
                  Trình độ tương đương
                </span>
                <span className="block text-xl font-bold text-indigo-400 mt-1">
                  {summaryData.score >= 80 ? "Advanced" : summaryData.score >= 50 ? "Intermediate" : "Beginner"}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Review Accordion */}
          <div className="bg-zinc-900/30 rounded-2xl border border-zinc-800 p-6 space-y-4">
            <div className="border-b border-zinc-800/80 pb-4">
              <h4 className="text-lg font-bold text-white">Xem lại chi tiết bài làm</h4>
              <p className="text-zinc-500 text-xs mt-1">
                Nhấp vào từng câu bên dưới để xem lại câu hỏi, câu trả lời và nhận xét từ AI Gemini.
              </p>
            </div>

            <div className="space-y-3">
              {summaryData.questions.map((q, idx) => {
                const isExpanded = expandedIndex === idx;
                return (
                  <div
                    key={q.questionId || idx}
                    className="bg-zinc-900/60 rounded-xl border border-zinc-800/60 overflow-hidden transition-all duration-200"
                  >
                    {/* Accordion Header */}
                    <button
                      type="button"
                      onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                      className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/30 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3 pr-4 min-w-0">
                        <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-zinc-850 text-zinc-400 font-bold text-xs">
                          {idx + 1}
                        </span>
                        <p className="text-zinc-200 font-medium text-sm truncate">
                          {q.question}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <ScoreBadge score={q.score} variant="tier" suffix="đ" />
                        <span className={`text-zinc-500 text-xs transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}>
                          ▼
                        </span>
                      </div>
                    </button>

                    {/* Accordion Body */}
                    {isExpanded && (
                      <div className="border-t border-zinc-850 p-5 bg-zinc-900/20 space-y-4 text-sm leading-relaxed">
                        <div>
                          <span className="block text-zinc-500 text-xs uppercase font-bold tracking-wider mb-1">
                            Câu hỏi đầy đủ
                          </span>
                          <p className="text-white font-medium bg-zinc-950/40 p-3 rounded-lg border border-zinc-850">
                            {q.question}
                          </p>
                        </div>
                        
                        <div>
                          <span className="block text-zinc-500 text-xs uppercase font-bold tracking-wider mb-1">
                            Câu trả lời của bạn
                          </span>
                          <p className="text-zinc-300 bg-zinc-950/40 p-3 rounded-lg border border-zinc-850 italic">
                            {q.userAnswer || <span className="text-zinc-650 italic">Không có câu trả lời</span>}
                          </p>
                        </div>

                        <div>
                          <span className="block text-indigo-400 text-xs uppercase font-bold tracking-wider mb-1">
                            Nhận xét từ AI Gemini
                          </span>
                          <div className="text-indigo-200 bg-indigo-500/5 p-4 rounded-lg border border-indigo-550/10 whitespace-pre-line">
                            {q.feedback || "Không có nhận xét."}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <ActionButton variant="add" size="lg" onClick={handleRestart}>
              🔄 Luyện tập lại
            </ActionButton>
            <ActionButton variant="primary" size="lg" onClick={() => navigate("/history")}>
              📊 Lịch sử học tập
            </ActionButton>
            <ActionButton variant="primary" size="lg" onClick={() => navigate("/practice")}>
              📚 Chủ đề khác
            </ActionButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default PracticeSession;
