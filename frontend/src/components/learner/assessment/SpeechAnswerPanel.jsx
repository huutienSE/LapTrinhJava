const SpeechAnswerPanel = ({
  listening,
  displayText,
  onStart,
  onStop,
  onSubmit,
  canSubmit,
  isSubmitting,
}) => (
  <div className="flex flex-col items-center gap-6">
    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
      <button
        type="button"
        onClick={onStart}
        disabled={listening || isSubmitting}
        className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-lg transition-all ${
          listening || isSubmitting
            ? "bg-zinc-800/50 text-zinc-600 border border-zinc-800 cursor-not-allowed"
            : "bg-indigo-500 hover:bg-indigo-600 text-white shadow-[0_0_30px_rgba(99,102,241,0.3)]"
        }`}
      >
        🎤 Bắt đầu nói
      </button>
      <button
        type="button"
        onClick={onStop}
        disabled={!listening || isSubmitting}
        className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-lg transition-all ${
          !listening || isSubmitting
            ? "bg-zinc-800/50 text-zinc-600 border border-zinc-800 cursor-not-allowed"
            : "bg-red-500/20 text-red-500 border-2 border-red-500 animate-pulse"
        }`}
      >
        ⏹️ Dừng thu
      </button>
    </div>

    <p className="text-zinc-400 text-sm h-6">
      {listening
        ? "Đang lắng nghe..."
        : isSubmitting
          ? "Đang chấm bài..."
          : "Nhấn «Bắt đầu nói» rồi «Dừng thu» trước khi nộp"}
    </p>

    <div className="w-full bg-zinc-900/80 rounded-2xl p-6 min-h-[100px] border border-zinc-800 text-left">
      <p className="text-zinc-500 text-xs mb-3 uppercase tracking-wider">
        Nội dung nhận diện
      </p>
      <p className="text-zinc-200 text-lg leading-relaxed min-h-[28px]">
        {displayText || (
          <span className="text-zinc-600 italic">Chưa có dữ liệu...</span>
        )}
      </p>
    </div>

    <button
      type="button"
      onClick={onSubmit}
      disabled={!canSubmit || isSubmitting}
      className={`w-full sm:w-auto px-8 py-3 rounded-xl font-semibold transition-all ${
        !canSubmit || isSubmitting
          ? "bg-zinc-800 text-zinc-600 cursor-not-allowed"
          : "bg-indigo-500 hover:bg-indigo-600 text-white"
      }`}
    >
      {isSubmitting ? "Đang nộp..." : "Nộp câu trả lời"}
    </button>
  </div>
);

export default SpeechAnswerPanel;
