// Giả lập một database nhỏ trong bộ nhớ
// const MOCK_USER = {
//   email: "admin@gmail.com",
//   password: "123"
// };
import { MOCK_USER, MOCK_TOPICS, MOCK_SENTENCES, MOCK_HISTORY } from "./mockData"
import axios from "axios";

const API_BASE_URL_AUTH = "http://localhost:8080/api/auth";
const API_BASE_URL_PRACTICE = "http://localhost:8080/api/user/practice";

// 1. Khởi tạo apiClient cho các request cần xác thực (History, Speaking...)
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api', // URL gốc của Backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. TỰ ĐỘNG GẮN TOKEN: Trực chặn Request trước khi gửi đi
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // Gắn token chuẩn JWT
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Nếu Spring Boot báo lỗi 401/403 (Token sai hoặc hết hạn)
            localStorage.removeItem("token");
            window.location.href = '/login'; // Ép văng ra trang đăng nhập
        }
        return Promise.reject(error);
    }
  );

export const authService = {
  // Gọi đến /api/auth/login
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  // Giả lập API Đăng ký
  register: async (userData) => {
    // Gọi đến /api/auth/register
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  }
};


// // Cập nhật file src/services/api.jsx để thêm các hàm lấy dữ liệu và lưu lịch sử. Sau này bạn chỉ cần đổi ruột các hàm này thành axios.get/post.
// export const speakingService = {
//   // Thay thế toàn bộ Promise Mock bằng apiClient (Axios)
//   getTopics: async () => {
//     // Gọi: GET http://localhost:8080/api/topics
//     const response = await apiClient.get('/topics');
//     return response.data;
//   },
  
//   getSentencesByTopic: async (topicId) => {
//     // Gọi: GET http://localhost:8080/api/sentences?topicId=1
//     const response = await apiClient.get(`/sentences?topicId=${topicId}`);
//     return response.data;
//   },
  
//   saveRecord: async (recordData) => {
//     // Gọi: POST http://localhost:8080/api/history
//     // Nhờ có apiClient, request này đã tự động mang theo JWT token
//     const response = await apiClient.post('/history', recordData);
//     return { success: true, message: "Đã lưu kết quả thành công!", data: response.data };
//   },

//   // SỬA ĐỔI LỚN: Không cần truyền tham số email nữa
//   getHistory: async () => {
//     // Gọi đến /api/user/practice/history
//     // Token đã được Interceptor tự động thêm vào Header rồi
//     const response = await apiClient.get('/user/practice/history');
//     return response.data;
//   }
// }

// --- USER SERVICE (Xử lý các thông tin cá nhân, history) ---
export const userService = {
  getPracticeHistory: async () => {
    // Gọi đến /api/user/practice/history
    // Token đã được Interceptor tự động thêm vào Header rồi
    const response = await apiClient.get('/user/practice/history');
    return response.data;
  },
  getPracticeHistoryDetail: async (sessionId) => {
    // Gọi đến /api/user/practice/history/sessionid
    // Token đã được Interceptor tự động thêm vào Header rồi
    const response = await apiClient.get(`/user/practice/history/${sessionId}`);
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get('/user/profile');
    return response.data;
  }
};

// --- SPEAKING SERVICE (Dữ liệu chung về bài học) ---
export const speakingService = {
  getTopics: async () => {
    // Gọi đến /api/topics (hoặc /api/speaking/topics tùy backend)
    const response = await apiClient.get('/topics');
    return response.data;
  },
  getSentences: async (topicId) => {
    const response = await apiClient.get(`/topics/${topicId}/sentences`);
    return response.data;
  }
};