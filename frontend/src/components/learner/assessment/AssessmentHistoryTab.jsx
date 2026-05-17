import { useEffect, useState } from "react";
import { assessmentService } from "../../../services/api.jsx";
import { PageLoading, PageEmpty } from "../layout/PageStates.jsx";
import ScoreBadge from "../session/ScoreBadge.jsx";
import QuestionResultCard from "../session/QuestionResultCard.jsx";
import { formatLevel } from "../../../utils/assessmentLevels.js";

const formatDate = (value) => {
  if (!value) return "—";
  return new Date(value).toLocaleString("vi-VN");
};

const AssessmentHistoryTab = () => {
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await assessmentService.getHistory();
        if (response.success) {
          setItems(response.data ?? []);
        } else {
          setError(response.message || "Không thể tải lịch sử.");
        }
      } catch {
        setError("Không thể tải lịch sử đánh giá.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSelect = async (assessmentId) => {
    if (selectedId === assessmentId) {
      setSelectedId(null);
      setDetail(null);
      return;
    }

    setSelectedId(assessmentId);
    setDetailLoading(true);
    setError(null);
    try {
      const response = await assessmentService.getDetail(assessmentId);
      if (response.success) {
        setDetail(response.data);
      } else {
        setError(response.message || "Không thể tải chi tiết.");
        setDetail(null);
      }
    } catch {
      setError("Không thể tải chi tiết bài đánh giá.");
      setDetail(null);
    } finally {
      setDetailLoading(false);
    }
  };

  if (loading) {
    return <PageLoading />;
  }

  return (
    <div className="space-y-6">
      {error && <p className="text-red-400 text-sm text-center">{error}</p>}

      {items.length === 0 ? (
        <PageEmpty message="Bạn chưa có bài đánh giá nào." />
      ) : (
        <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800 overflow-hidden">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="bg-zinc-800/50 text-xs uppercase text-zinc-300">
              <tr>
                <th className="px-6 py-4">Ngày</th>
                <th className="px-6 py-4 text-center">Điểm</th>
                <th className="px-6 py-4">Trình độ</th>
                <th className="px-6 py-4 text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr
                  key={row.assessmentId}
                  className="border-t border-zinc-800 hover:bg-zinc-800/30"
                >
                  <td className="px-6 py-4">{formatDate(row.takenDate)}</td>
                  <td className="px-6 py-4 text-center">
                    <ScoreBadge score={row.score} variant="tier" />
                  </td>
                  <td className="px-6 py-4">
                    {formatLevel(row.levelAssigned)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleSelect(row.assessmentId)}
                      className="text-indigo-400 hover:text-indigo-300"
                    >
                      {selectedId === row.assessmentId ? "Đóng" : "Xem"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {detailLoading && <PageLoading />}

      {detail && !detailLoading && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              Chi tiết bài đánh giá
            </h3>
            <ScoreBadge
              score={detail.score}
              variant="tier"
              size="md"
              suffix="/100"
            />
          </div>
          <p className="text-zinc-500 text-sm">
            Trình độ: {formatLevel(detail.levelAssigned)} ·{" "}
            {formatDate(detail.takenDate)}
          </p>
          {(detail.questions ?? []).map((q, index) => (
            <QuestionResultCard key={q.questionId ?? index} index={index} question={q} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AssessmentHistoryTab;
