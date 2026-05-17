import ScoreBadge from "../session/ScoreBadge.jsx";
import ActionButton from "../../common/ActionButton.jsx";

const LEVEL_LABELS = {
  BEGINNER: "Người mới bắt đầu",
  INTERMEDIATE: "Trung cấp",
  ADVANCED: "Nâng cao",
};

const formatLevel = (level) =>
  LEVEL_LABELS[level] ?? level ?? "—";

const AssessmentFinalResult = ({ result, onRestart }) => (
  <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-8 text-center space-y-6">
    <span className="text-4xl block">✅</span>
    <h3 className="text-2xl font-bold text-white">Hoàn thành bài đánh giá</h3>

    <div className="flex flex-col items-center gap-2">
      <p className="text-zinc-500 text-sm">Điểm trung bình</p>
      <ScoreBadge
        score={result?.score}
        variant="tier"
        size="md"
        suffix="/100"
        className="text-2xl !px-6 !py-2"
      />
    </div>

    <div className="inline-block bg-indigo-500/10 border border-indigo-500/30 rounded-xl px-6 py-3">
      <p className="text-zinc-500 text-xs mb-1">Trình độ được gán</p>
      <p className="text-indigo-300 font-semibold text-lg">
        {formatLevel(result?.levelAssigned)}
      </p>
    </div>

    <p className="text-zinc-500 text-sm">
      Kết quả đã được lưu và cập nhật vào hồ sơ của bạn (nếu trình độ cao hơn).
    </p>

    <ActionButton variant="primary" size="lg" onClick={onRestart}>
      Làm bài đánh giá mới
    </ActionButton>
  </div>
);

export default AssessmentFinalResult;
