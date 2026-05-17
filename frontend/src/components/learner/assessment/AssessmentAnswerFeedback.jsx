import ScoreBadge from "../session/ScoreBadge.jsx";
import ActionButton from "../../common/ActionButton.jsx";

const AssessmentAnswerFeedback = ({
  result,
  questionNumber,
  isLastQuestion,
  onContinue,
  isLoading,
}) => (
  <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-8 space-y-6">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold text-white">
        Kết quả câu {questionNumber}
      </h3>
      <ScoreBadge score={result?.score} variant="success" suffix=" điểm" />
    </div>

    <section>
      <p className="text-zinc-500 text-sm mb-1">Câu trả lời của bạn</p>
      <p className="text-zinc-300">{result?.userAnswer || "—"}</p>
    </section>

    <section>
      <p className="text-zinc-500 text-sm mb-1">Nhận xét</p>
      <p className="text-indigo-300 leading-relaxed">
        {result?.feedback || "—"}
      </p>
    </section>

    <ActionButton
      variant="add"
      size="lg"
      onClick={() => {
        if (!isLoading) onContinue();
      }}
    >
      {isLoading
        ? "Đang xử lý..."
        : isLastQuestion
          ? "Hoàn thành bài đánh giá"
          : "Câu tiếp theo"}
    </ActionButton>
  </div>
);

export default AssessmentAnswerFeedback;
