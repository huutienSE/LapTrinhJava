const PageLoading = ({ message = "Đang tải dữ liệu..." }) => (
  <div className="text-center py-20 text-zinc-500">{message}</div>
);

const PageEmpty = ({
  icon = "📭",
  message = "Không có dữ liệu.",
  children,
}) => (
  <div className="text-center py-20 bg-zinc-900/50 rounded-2xl border border-zinc-800">
    <span className="text-4xl mb-4 block">{icon}</span>
    <p className="text-zinc-400">{message}</p>
    {children}
  </div>
);

const PageError = ({ message = "Đã xảy ra lỗi.", onRetry }) => (
  <div className="text-center py-20">
    <p className="text-red-400 mb-4">{message}</p>
    {onRetry && (
      <button
        type="button"
        onClick={onRetry}
        className="text-sm font-medium px-4 py-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500 hover:text-white transition-all"
      >
        Thử lại
      </button>
    )}
  </div>
);

const PageInlineError = ({ message, onRetry }) => {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm"
    >
      <p>{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="shrink-0 text-sm font-medium px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors"
        >
          Thử lại
        </button>
      )}
    </div>
  );
};

export { PageLoading, PageEmpty, PageError, PageInlineError };
