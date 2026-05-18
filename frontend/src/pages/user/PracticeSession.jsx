import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { topicService, practiceService } from "../../services";
import { formatLevel } from "../../utils/assessmentLevels.js";
import { PageLoading } from "../../components/learner/layout/PageStates.jsx";

const PracticeSession = () => {
  const { topicId } = useParams();
  const location = useLocation();

  const [topic, setTopic] = useState(location.state?.topic ?? null);
  const [questions, setQuestions] = useState(location.state?.questions ?? []);
  const [isLoading, setIsLoading] = useState(!location.state?.topic);
  const [backendReady, setBackendReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      setIsLoading(true);
      try {
        let loadedTopic = location.state?.topic ?? null;
        let loadedQuestions = location.state?.questions ?? [];

        if (!loadedTopic) {
          const topicRes = await topicService.getTopicById(topicId);
          if (topicRes.success) loadedTopic = topicRes.data;
        }

        if (loadedQuestions.length === 0) {
          const qRes = await topicService.getQuestionsByTopic(topicId);
          if (qRes.success) loadedQuestions = qRes.data ?? [];
        }

        if (!cancelled) {
          setTopic(loadedTopic);
          setQuestions(loadedQuestions);
        }

        try {
          const startRes = await practiceService.start(Number(topicId));
          if (!cancelled && startRes.success) setBackendReady(true);
        } catch {
          if (!cancelled) setBackendReady(false);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    init();
    return () => {
      cancelled = true;
    };
  }, [topicId, location.state]);

  if (isLoading) {
    return <PageLoading message="Đang chuẩn bị phiên luyện tập..." />;
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Link
        to={`/practice/${topicId}`}
        className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm mb-6"
      >
        ← Quay lại chi tiết chủ đề
      </Link>

      <header className="mb-8 text-center">
        <p className="text-zinc-500 text-sm uppercase tracking-wider mb-2">
          Phiên luyện tập
        </p>
        <h2 className="text-3xl font-bold text-white">
          {topic?.topicName || "Chủ đề luyện tập"}
        </h2>
        {topic?.description && (
          <p className="text-zinc-400 mt-2">{topic.description}</p>
        )}
      </header>

      {!backendReady && (
        <div className="mb-8 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-200 text-sm text-center">
          Tính năng ghi âm và chấm điểm đang chờ backend hoàn thiện (
          <code className="text-amber-100">POST /user/practice/start</code>
          ). Bạn có thể xem trước danh sách câu hỏi bên dưới.
        </div>
      )}

      <div className="space-y-4">
        {questions.map((question, index) => (
          <div
            key={question.questionId}
            className="p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800 opacity-75"
          >
            <p className="text-xs text-zinc-500 mb-2">
              Câu {index + 1} · {formatLevel(question.difficultyLevel)}
            </p>
            <p className="text-xl text-white font-medium mb-4">
              {question.description}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                disabled
                className="px-5 py-2.5 rounded-xl bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed text-sm font-medium"
              >
                🎤 Bắt đầu nói (sắp ra mắt)
              </button>
            </div>
          </div>
        ))}
      </div>

      {questions.length === 0 && (
        <p className="text-center text-zinc-500 py-12">
          Không có câu hỏi trong phiên này.
        </p>
      )}
    </div>
  );
};

export default PracticeSession;
