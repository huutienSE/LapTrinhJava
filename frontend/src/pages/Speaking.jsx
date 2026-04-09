const Speaking = () => {
  return (
    <div className="max-w-3xl mx-auto mt-10">
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-10 text-center shadow-2xl flex flex-col items-center justify-center min-h-[500px]">
        
        <h2 className="text-2xl font-bold text-white mb-2">Chủ đề: Giới thiệu bản thân</h2>
        <p className="text-zinc-400 mb-12 text-sm">Nhấn vào biểu tượng micro để bắt đầu trả lời.</p>

        {/* Nút Micro (Giả lập) */}
        <div className="relative flex items-center justify-center mb-8">
          {/* Hiệu ứng sóng âm bao quanh (Pulse ring) */}
          <div className="absolute w-32 h-32 bg-indigo-500/20 rounded-full animate-ping"></div>
          <div className="absolute w-24 h-24 bg-indigo-500/40 rounded-full animate-pulse"></div>
          
          {/* Nút chính */}
          <button className="relative z-10 w-20 h-20 bg-indigo-500 hover:bg-indigo-400 text-white rounded-full flex items-center justify-center shadow-xl shadow-indigo-500/30 transition-all active:scale-90">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
        </div>

        <p className="text-zinc-500 animate-pulse">Đang chờ bạn bắt đầu...</p>
      </div>
    </div>
  );
};

export default Speaking;