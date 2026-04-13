export const MOCK_USER = [
    {
        email: "admin@gmail.com",
        password: "123",
        firstName: "Admin",
    },
];

export const MOCK_TOPICS = [
    { id: 1, title: "Daily Life", level: "Easy", icon: "🏠", color: "border-green-500/50" },
    { id: 2, title: "Job Interview", level: "Medium", icon: "💼", color: "border-indigo-500/50" },
    { id: 3, title: "Travel", level: "Medium", icon: "✈️", color: "border-orange-500/50" },
    { id: 4, title: "Technology", level: "Hard", icon: "🚀", color: "border-purple-500/50" },
];

// Bảng Sentences (Khóa ngoại topicId trỏ về Bảng Topics)
export const MOCK_SENTENCES = [
    { id: 1, topicId: 1, text: "How are you doing today?", points: 10 },
    { id: 2, topicId: 1, text: "I usually wake up at 7 AM.", points: 10 },
    { id: 3, topicId: 2, text: "Can you tell me about yourself?", points: 15 },
    { id: 4, topicId: 2, text: "My greatest strength is problem solving.", points: 20 },
];

// Bảng History (Lưu lịch sử luyện tập)
export const MOCK_HISTORY = [];

