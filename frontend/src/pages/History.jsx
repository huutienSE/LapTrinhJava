import { useState, useEffect } from "react";
import { speakingService } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

const History = () => {
  const { currentUser } = useAuth();  
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
        speakingService.getHistory(currentUser.email).then(data => {
            setHistory(data);
            setIsLoading(false);
        });
    }
  }, [currentUser]);

  if (isLoading) return <div className="text-center py-20 text-zinc-500">Đang tải dữ liệu...</div>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white">Lịch sử luyện tập</h2>
        <p className="text-zinc-500 mt-2">Theo dõi tiến độ học tập của bạn tại đây.</p>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/50 rounded-2xl border border-zinc-800">
            <span className="text-4xl mb-4 block">📭</span>
            <p className="text-zinc-400">Bạn chưa có bài luyện tập nào.</p>
        </div>
      ) : (
        <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800 overflow-hidden">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="bg-zinc-800/50 text-xs uppercase font-semibold text-zinc-300">
              <tr>
                <th className="px-6 py-4">Ngày giờ</th>
                <th className="px-6 py-4">Chủ đề</th>
                <th className="px-6 py-4">Câu đã luyện</th>
                <th className="px-6 py-4 text-center">Điểm số</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {history.map((record) => (
                <tr key={record.id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">{record.createdAt}</td>
                  <td className="px-6 py-4 font-medium text-indigo-400">{record.topicTitle}</td>
                  <td className="px-6 py-4 text-zinc-300">"{record.sentenceText}"</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full font-bold text-xs ${
                        record.score >= 80 ? 'bg-green-500/20 text-green-400' : 
                        record.score >= 50 ? 'bg-orange-500/20 text-orange-400' : 
                        'bg-red-500/20 text-red-400'
                    }`}>
                        {record.score}
                    </span>
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