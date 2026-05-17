import ActionButton from "../../common/ActionButton.jsx";

const AssessmentIntro = ({ onStart, isLoading }) => (
  <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-8 text-center">
    <span className="text-4xl mb-4 block">🎯</span>
    <h3 className="text-xl font-semibold text-white mb-2">
      Bài đánh giá trình độ
    </h3>
    <p className="text-zinc-400 text-sm max-w-md mx-auto mb-6">
      Bạn sẽ trả lời 10 câu hỏi bằng giọng nói. Sau mỗi câu, hệ thống chấm điểm
      và gửi nhận xét ngay. Kết thúc bài sẽ có trình độ tổng thể.
    </p>
    <ActionButton
      variant="add"
      size="lg"
      onClick={() => {
        if (!isLoading) onStart();
      }}
    >
      {isLoading ? "Đang tạo bài..." : "Bắt đầu đánh giá"}
    </ActionButton>
  </div>
);

export default AssessmentIntro;
