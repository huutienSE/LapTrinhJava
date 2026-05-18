import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { practiceService } from "../../services";
import {
  getEnvelopeError,
  getHttpAwareErrorMessage,
} from "../../utils/apiError.js";
import {
  PageLoading,
  PageEmpty,
  PageError,
} from "../../components/learner/layout/PageStates.jsx";
import ScoreBadge from "../../components/learner/session/ScoreBadge.jsx";

const History = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadHistory = async () => {
    if (!isLoggedIn) {
      setHistory([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await practiceService.getHistory();
      if (response.success) {
        setHistory(response.data ?? []);
      } else {
        setHistory([]);
        setError(
          getEnvelopeError(response, "Không thể tải lịch sử luyện tập.")
        );
      }
    } catch (err) {
      setHistory([]);
      setError(
        getHttpAwareErrorMessage(err, "Không thể tải lịch sử luyện tập.")
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [isLoggedIn]);

  if (isLoading) {
    return <PageLoading message="Đang tải lịch sử luyện tập..." />;
  }

  if (error) {
    return <PageError message={error} onRetry={loadHistory} />;
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white">Lịch sử luyện tập</h2>
        <p className="text-zinc-500 mt-2">
          Theo dõi tiến độ học tập của bạn tại đây.
        </p>
      </div>

      {history.length === 0 ? (
        <PageEmpty message="Bạn chưa có bài luyện tập nào." />
      ) : (
        <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800 overflow-hidden">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="bg-zinc-800/50 text-xs uppercase font-semibold text-zinc-300">
              <tr>
                <th className="px-6 py-4">Ngày giờ</th>
                <th className="px-6 py-4">Chủ đề</th>
                <th className="px-6 py-4 text-center">Điểm số</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {history.map((record) => (
                <tr
                  key={record.sessionId}
                  onClick={() => navigate(`/history/${record.sessionId}`)}
                  className="hover:bg-zinc-800/30 transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(record.time).toLocaleString("vi-VN")}
                  </td>
                  <td className="px-6 py-4 font-medium text-indigo-400">
                    {record.topicName}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <ScoreBadge score={record.score} variant="tier" size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default History;
