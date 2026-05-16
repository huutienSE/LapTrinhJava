import { useState, useEffect } from "react";
import { userService } from "../../services/api.jsx";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import {
  PageLoading,
  PageEmpty,
} from "../../components/learner/layout/PageStates.jsx";
import ScoreBadge from "../../components/learner/session/ScoreBadge.jsx";

const History = () => {
  const { isLoggedIn } = useAuth();
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await userService.getPracticeHistory();
        if (response.success) {
          setHistory(response.data ?? []);
        }
      } catch (error) {
        console.error("Lỗi khi lấy lịch sử:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchHistory();
    } else {
      setIsLoading(false);
    }
  }, [isLoggedIn]);

  if (isLoading) {
    return <PageLoading />;
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
