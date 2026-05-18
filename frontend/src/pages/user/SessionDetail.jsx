import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { practiceService } from "../../services";
import { getApiErrorMessage } from "../../utils/apiError.js";
import { PageLoading, PageError } from "../../components/learner/layout/PageStates.jsx";
import ScoreBadge from "../../components/learner/session/ScoreBadge.jsx";
import QuestionResultCard from "../../components/learner/session/QuestionResultCard.jsx";

const SessionDetail = () => {
  const { sessionId } = useParams();
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSessionDetail = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await practiceService.getSessionDetail(sessionId);
      if (response.success) {
        setSession(response.data);
      } else {
        setSession(null);
        setError(response.message || "Không tìm thấy session");
      }
    } catch (err) {
      setSession(null);
      setError(getApiErrorMessage(err, "Không thể tải chi tiết buổi luyện tập"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessionDetail();
  }, [sessionId]);

  if (isLoading) {
    return <PageLoading />;
  }

  if (error || !session) {
    return (
      <PageError
        message={error || "Không tìm thấy session"}
        onRetry={fetchSessionDetail}
      />
    );
  }

  const questions = session.questions ?? [];

  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="mb-8">
        <Link
          to="/history"
          className="text-indigo-400 hover:text-indigo-300 text-sm"
        >
          ← Quay lại lịch sử
        </Link>

        <h1 className="text-3xl font-bold text-white mt-4">
          {session.topicName}
        </h1>

        <p className="text-zinc-500 mt-2">Session ID: {session.sessionId}</p>

        <div className="mt-4 flex items-center gap-2">
          <span className="text-zinc-400 text-sm">Tổng điểm:</span>
          <ScoreBadge score={session.score} variant="highlight" size="md" />
        </div>
      </div>

      <div className="space-y-6">
        {questions.length === 0 ? (
          <p className="text-zinc-500 text-center py-8">
            Chưa có câu trả lời trong buổi luyện tập này.
          </p>
        ) : (
          questions.map((question, index) => (
            <QuestionResultCard
              key={question.questionId ?? index}
              index={index}
              question={question}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default SessionDetail;
