import { useEffect, useState } from "react";
import { topicService } from "../../services";
import {
  getEnvelopeError,
  getHttpAwareErrorMessage,
} from "../../utils/apiError.js";
import TopicCard from "../../components/learner/practice/TopicCard.jsx";
import {
  PageLoading,
  PageEmpty,
  PageError,
} from "../../components/learner/layout/PageStates.jsx";

const PracticeTopics = () => {
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTopics = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await topicService.getTopics();
      if (response.success) {
        setTopics(response.data ?? []);
      } else {
        setTopics([]);
        setError(
          getEnvelopeError(response, "Không thể tải danh sách chủ đề.")
        );
      }
    } catch (err) {
      setTopics([]);
      setError(
        getHttpAwareErrorMessage(err, "Không thể tải danh sách chủ đề.")
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTopics();
  }, []);

  if (isLoading) {
    return <PageLoading message="Đang tải chủ đề luyện tập..." />;
  }

  if (error) {
    return <PageError message={error} onRetry={loadTopics} />;
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-white">Luyện tập</h2>
        <p className="text-zinc-500 mt-2">
          Chọn một chủ đề để xem câu hỏi và bắt đầu luyện nói.
        </p>
      </header>

      {topics.length === 0 ? (
        <PageEmpty
          icon="📚"
          message="Chưa có chủ đề luyện tập nào."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => (
            <TopicCard key={topic.topicId} topic={topic} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PracticeTopics;
