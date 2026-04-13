import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      
      <div className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-sm text-zinc-400 mb-8">
        <span className="flex h-2 w-2 rounded-full bg-indigo-500 mr-2 animate-pulse"></span>
        AI-Powered Learning
      </div>

      
      <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
        Master English <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
          with AI Tutor 🎙️
        </span>
      </h1>
      
      <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mb-10">
        Luyện tập kỹ năng nói tiếng Anh mọi lúc, mọi nơi. Nhận phản hồi chi tiết về phát âm, ngữ pháp và từ vựng ngay lập tức.
      </p>

      
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link 
          to="/speaking" 
          className="w-full sm:w-auto px-8 py-3.5 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl transition-all active:scale-95 shadow-lg shadow-indigo-500/25"
        >
          Bắt đầu luyện tập
        </Link>
        <Link 
          to="/history" 
          className="w-full sm:w-auto px-8 py-3.5 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-xl border border-zinc-700 transition-all active:scale-95"
        >
          Xem lịch sử
        </Link>
      </div>
    </div>
  );
};

export default Home;