import { useState, useEffect } from "react";
import { speakingService } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

const Speaking = () => {
  const { currentUser } = useAuth();
  const [step, setStep] = useState(1);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [sentences, setSentences] = useState([]);
  const [selectedSentence, setSelectedSentence] = useState(null);
  
  // Trạng thái cho phòng thu âm
  const [isRecording, setIsRecording] = useState(false);
  const [result, setResult] = useState(null);

  // Load Topics khi vào trang
  useEffect(() => {
    speakingService.getTopics().then(data => setTopics(data));
  }, []);

  const handleSelectTopic = async (topic) => {
    setSelectedTopic(topic);
    const data = await speakingService.getSentencesByTopic(topic.id);
    setSentences(data);
    setStep(2);
  };

  const handleSimulateRecord = async () => {
    setIsRecording(true);
    setResult(null);
    
    // Giả lập thời gian AI nghe và phân tích
    setTimeout(async () => {
        setIsRecording(false);
        const mockScore = Math.floor(Math.random() * 30) + 70; // Random điểm 70-100
        setResult(mockScore);

        // Lưu lịch sử
        if(currentUser) {
            await speakingService.saveRecord({
                userEmail: currentUser.email,
                topicTitle: selectedTopic.title,
                sentenceText: selectedSentence.text,
                score: mockScore
            });
        }
    }, 4000);
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      
      {/* STEP 1: Chọn Chủ Đề */}
      {step === 1 && (
        <div className="animate-fade-in">
          <h2 className="text-3xl font-bold mb-8 text-white">Chọn chủ đề luyện tập</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topics.map((topic) => (
              <div key={topic.id} onClick={() => handleSelectTopic(topic)}
                className={`group p-6 bg-zinc-900/50 border ${topic.color} rounded-2xl hover:bg-zinc-800 transition-all cursor-pointer hover:-translate-y-2`}
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{topic.icon}</div>
                <h3 className="text-xl font-bold text-white mb-1">{topic.title}</h3>
                <span className="text-xs px-2 py-1 bg-zinc-800 rounded-md text-zinc-400">{topic.level}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: Chọn Câu Luyện Tập */}
      {step === 2 && (
        <div className="animate-fade-in max-w-2xl mx-auto">
          <button onClick={() => setStep(1)} className="mb-6 text-indigo-400 hover:text-indigo-300 flex items-center gap-2">
            ← Quay lại chủ đề
          </button>
          <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-8">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-zinc-800">
                  <span className="text-4xl">{selectedTopic?.icon}</span>
                  <h2 className="text-2xl font-bold text-white">{selectedTopic?.title}</h2>
              </div>
              <div className="space-y-4">
                  {sentences.map(sentence => (
                      <div key={sentence.id} className="flex justify-between items-center p-4 bg-zinc-800/50 rounded-xl hover:bg-zinc-800 transition-colors">
                          <span className="text-zinc-200">{sentence.text}</span>
                          <button 
                            onClick={() => { setSelectedSentence(sentence); setStep(3); setResult(null); }}
                            className="px-4 py-2 bg-indigo-500/10 text-indigo-400 rounded-lg hover:bg-indigo-500 hover:text-white transition-all text-sm font-medium"
                          >
                              Luyện ngay
                          </button>
                      </div>
                  ))}
              </div>
          </div>
        </div>
      )}

      {/* STEP 3: Phòng Thu Âm */}
      {step === 3 && (
        <div className="animate-fade-in max-w-3xl mx-auto text-center pt-10">
           <button onClick={() => setStep(2)} className="mb-10 text-zinc-500 hover:text-white flex items-center justify-center w-full gap-2">
            ← Đổi câu khác
          </button>
          
          <h3 className="text-zinc-400 mb-4 uppercase tracking-widest text-sm font-semibold">{selectedTopic?.title}</h3>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-16 leading-tight">"{selectedSentence?.text}"</h1>

          {/* Khối Micro */}
          <div className="flex flex-col items-center justify-center">
              <button 
                onClick={handleSimulateRecord}
                disabled={isRecording}
                className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl transition-all duration-300
                    ${isRecording 
                        ? 'bg-red-500/20 text-red-500 border-4 border-red-500 animate-pulse' 
                        : 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:scale-105'
                    }`}
              >
                  {isRecording ? '🎙️' : '🎤'}
              </button>
              
              <p className="mt-6 text-zinc-400 h-6">
                  {isRecording ? "Đang lắng nghe và phân tích AI..." : "Nhấn để bắt đầu nói"}
              </p>
          </div>

          {/* Bảng Kết Quả */}
          {result && (
              <div className="mt-12 p-6 bg-green-500/10 border border-green-500/30 rounded-2xl inline-block">
                  <h4 className="text-green-400 font-medium mb-2">Đánh giá hoàn tất</h4>
                  <div className="text-5xl font-bold text-white">{result}<span className="text-2xl text-zinc-500">/100</span></div>
                  <p className="mt-2 text-sm text-zinc-400">Đã tự động lưu vào lịch sử</p>
              </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Speaking;