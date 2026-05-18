import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { practiceService } from "../../services/api.jsx";
import { getApiErrorMessage } from "../../utils/apiError.js";
import { formatLevel } from "../../utils/assessmentLevels.js";
import {
  PageLoading,
  PageError,
} from "../../components/learner/layout/PageStates.jsx";

const PracticeTopicDetail = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();

  const [topic, setTopic] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [topicRes, questionsRes] = await Promise.all([
        practiceService.getTopicById(topicId),
        practiceService.getQuestionsByTopic(topicId),
      ]);

      if (topicRes.success) {
        setTopic(topicRes.data);
      } else {
        setError(topicRes.message || "Không tìm thấy chủ đề.");
        return;
      }

      if (questionsRes.success) {
        setQuestions(questionsRes.data ?? []);
      } else {
        setQuestions([]);
      }
    } catch (err) {
      setError(getApiErrorMessage(err, "Không thể tải thông tin chủ đề."));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [topicId]);

  const handleStartPractice = () => {
    navigate(`/practice/${topicId}/session`, {
      state: { topic, questions },
    });
  };

  if (isLoading) {
    return <PageLoading message="Đang tải chủ đề..." />;
  }

  if (error || !topic) {
    return (
      <PageError
        message={error || "Không tìm thấy chủ đề."}
        onRetry={fetchData}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <Link
        to="/practice"
        className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm mb-6"
      >
        ← Quay lại danh sách chủ đề
      </Link>

      <header className="mb-8 p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h2 className="text-3xl font-bold text-white">{topic.topicName}</h2>
          <span className="text-xs px-2 py-1 rounded-md bg-zinc-800 text-zinc-400 border border-zinc-700">
            {formatLevel(topic.difficultyLevel)}
          </span>
        </div>
        <p className="text-zinc-400">
          {topic.description || "Chưa có mô tả cho chủ đề này."}
        </p>
        <p className="text-zinc-500 text-sm mt-3">
          {questions.length} câu hỏi trong chủ đề này
        </p>
      </header>

      <section className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">
          Danh sách câu hỏi
        </h3>

        {questions.length === 0 ? (
          <div className="text-center py-12 bg-zinc-900/50 rounded-2xl border border-zinc-800">
            <p className="text-zinc-500">
              Chủ đề này chưa có câu hỏi. Vui lòng chọn chủ đề khác.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {questions.map((question, index) => (
              <li
                key={question.questionId}
                className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-zinc-900/50 rounded-xl border border-zinc-800"
              >
                <span className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-800 text-zinc-400 text-sm font-medium">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-zinc-200">{question.description}</p>
                  <p className="text-xs text-zinc-500 mt-1">
                    Độ khó: {formatLevel(question.difficultyLevel)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          type="button"
          disabled={questions.length === 0}
          onClick={handleStartPractice}
          className="w-full sm:w-auto px-8 py-3.5 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-indigo-500"
        >
          Bắt đầu luyện tập
        </button>
        {questions.length === 0 && (
          <p className="text-sm text-zinc-500 self-center">
            Cần ít nhất một câu hỏi để bắt đầu.
          </p>
        )}
      </div>
    </div>
  );
};

export default PracticeTopicDetail;
