const History = () => {
  // Dữ liệu giả lập
  const mockHistory = [
    { id: 1, date: "15 Thg 10, 2023", topic: "Giới thiệu bản thân", score: "8.5/10", duration: "02:15" },
    { id: 2, date: "14 Thg 10, 2023", topic: "Sở thích và Đam mê", score: "7.0/10", duration: "03:40" },
    { id: 3, date: "12 Thg 10, 2023", topic: "Kế hoạch tương lai", score: "9.0/10", duration: "01:50" },
  ];

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Lịch sử học tập</h1>
          <p className="text-zinc-400 mt-1">Xem lại tiến độ và các bài luyện nói của bạn</p>
        </div>
      </div>

      {/* Danh sách các bài nói */}
      <div className="space-y-4">
        {mockHistory.map((item) => (
          <div 
            key={item.id} 
            className="bg-zinc-900/40 hover:bg-zinc-900/80 border border-zinc-800 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between transition-all group cursor-pointer"
          >
            <div className="flex gap-4 items-center mb-4 sm:mb-0">
              <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors">{item.topic}</h3>
                <p className="text-sm text-zinc-500">{item.date} • {item.duration}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              <div className="text-right">
                <span className="block text-sm text-zinc-500">Điểm đánh giá</span>
                <span className="font-bold text-emerald-400">{item.score}</span>
              </div>
              <button className="p-2 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition-colors">
                Xem chi tiết
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;