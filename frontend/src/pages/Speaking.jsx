import { useState, useEffect } from "react";
import { speakingService } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'


const Speaking = () => {
  const { currentUser } = useAuth();
  const [step, setStep] = useState(1);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [sentences, setSentences] = useState([]);
  const [selectedSentence, setSelectedSentence] = useState(null);
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const [finalTranscript, setFinalTranscript] = useState("");
  
  // Trạng thái cho phòng thu âm
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

  if (!browserSupportsSpeechRecognition) {
    return <div className="text-red-500 text-center mt-20">Trình duyệt của bạn không hỗ trợ nhận diện giọng nói. Hãy dùng Chrome.</div>;
  }
  
    const handleStartRecord = () => {
      setResult(null);
      setFinalTranscript("");
      resetTranscript();

      SpeechRecognition.startListening({
        continuous: true,
        language: 'en-US',
      })
    };

    const handleStopRecord = async () => {
      SpeechRecognition.stopListening();

      setFinalTranscript(transcript);

      resetTranscript();

      const mockScore = Math.floor(Math.random()*30) + 70;
      setResult(mockScore);

      if (currentUser && currentUser.email) {
        await speakingService.saveRecord({
          userEmail: currentUser.email,
          topicTitle: selectedTopic.title,
          sentenceText: selectedSentence.text,
          score: mockScore
        });
      }
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
          <div className="flex flex-col items-center justify-center gap-6">
            
            {/* 2 Nút Thu/Dừng */}
            <div className="flex gap-6">
                <button 
                  onClick={handleStartRecord}
                  disabled={listening}
                  className={`px-8 py-4 rounded-2xl font-bold flex items-center justify-center text-lg transition-all duration-300
                      ${listening 
                          ? 'bg-zinc-800/50 text-zinc-600 border border-zinc-800 cursor-not-allowed' 
                          : 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:-translate-y-1'
                      }`}
                >
                    🎤 Bắt đầu nói
                </button>

                <button 
                  onClick={handleStopRecord}
                  disabled={!listening}
                  className={`px-8 py-4 rounded-2xl font-bold flex items-center justify-center text-lg transition-all duration-300
                      ${!listening 
                          ? 'bg-zinc-800/50 text-zinc-600 border border-zinc-800 cursor-not-allowed' 
                          : 'bg-red-500/20 text-red-500 border-2 border-red-500 animate-pulse hover:bg-red-500/30'
                      }`}
                >
                    ⏹️ Dừng thu
                </button>
            </div>
            
            <p className="text-zinc-400 h-6">
                {listening ? "Đang lắng nghe và phân tích AI..." : "Nhấn 'Bắt đầu nói' để ghi âm"}
            </p>

            {/* Khung hiển thị Transcript */}
            <div className="w-full max-w-2xl bg-zinc-900/80 rounded-2xl p-6 min-h-[100px] border border-zinc-800 mt-2 text-left shadow-inner">
                <h4 className="text-zinc-500 text-xs mb-3 font-medium uppercase tracking-wider">Nội dung AI nhận diện:</h4>
                <p className="text-zinc-200 text-lg leading-relaxed min-h-[28px]">
                    {listening ? transcript : finalTranscript}
                    {!listening && !finalTranscript && <span className="text-zinc-600 italic">Chưa có dữ liệu...</span>}
                </p>
            </div>
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