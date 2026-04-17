// Giả lập một database nhỏ trong bộ nhớ
// const MOCK_USER = {
//   email: "admin@gmail.com",
//   password: "123"
// };
import { MOCK_USER, MOCK_TOPICS, MOCK_SENTENCES, MOCK_HISTORY } from "./mockData"
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/auth";

export const authService = {
  // Giả lập API Đăng nhập
  login: async (credentials) => {        
      try {
        console.log("Calling API Login với dữ liệu:", credentials);

        const response = await axios.post(`${API_BASE_URL}/login`,{ email: credentials.email, password: credentials.password});
        return {
          success: true,
          message: `Đăng nhập thành công, chào ${response.data.userName}!`,
          user: response.data,
        };
      } catch (error) {
        if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        let message = "Đăng nhập thất bại";

        // Xử lý theo status code
        if (status === 400) {
          if (data?.message === "User is disabled") {
            message = "Tài khoản của bạn đã bị khóa";
          } else if (data?.message === "Invalid email or password") {
            message = "Email hoặc mật khẩu không chính xác";
          } else {
            message = data?.message || message;
          }
        } else if (status === 500) {
          message = "Lỗi server, vui lòng thử lại sau";
        }

        throw new Error(message);
        }
        // Xử lý lỗi network hoặc timeout
        else if (error.request) {
          throw new Error("Không thể kết nối tới server. Kiểm tra kết nối mạng!");
        }
        // Lỗi khác
        else {
          throw new Error(error.message || "Lỗi không xác định");
        }
      }
  },

  // Giả lập API Đăng ký
  register: async (userData) => {
    const payload = {
      userName: `${userData.lastName}`.trim(),
      email: userData.email,
      password: userData.password,
    }
    try {
      console.log("Calling api register with dataL: ", payload);

      const response = await axios.post(`${API_BASE_URL}/register`, payload);
      return {message: response.data.userName}

    } catch (error) {
      const data = error?.response?.data
      let message = "lỗi đăng ký"

      if (data) {
        if (typeof data === "string") message = data
        else if (data?.message) message = data.message
        else if (typeof data === "object") message = Object.values(data).flat().join(" \n ")
        } else if (error?.message) message = error.message
        
        throw new Error(message)
      }
  }
};


// Cập nhật file src/services/api.jsx để thêm các hàm lấy dữ liệu và lưu lịch sử. Sau này bạn chỉ cần đổi ruột các hàm này thành axios.get/post.
export const speakingService = {
  //tduong voi: get/ api/ topics
  getTopics: async () => {
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_TOPICS), 500))
  },
  
  //tduong: get/api/semtences?topicID=1
  getSentencesByTopic: async (topicId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const sentences = MOCK_SENTENCES.filter(s => s.topicId === topicId)
        resolve(sentences)
      }, 500)
    })
  },

  
  saveRecord: async (recordData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newRecord = {
          id: Date.now(),
          ...recordData,
          createdAt: new Date().toLocaleString(),
        }
        MOCK_HISTORY.push(newRecord)
        console.log("Dữ liệu History hiện tại:", MOCK_HISTORY);
        resolve({success: true, message: "Đã lưu kết quả!"})
      }, 600)
    })
  },

  // Tương đương: GET /api/history?email=...
  getHistory: async (email) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const userHistory = MOCK_HISTORY.filter(h => h.userEmail === email);
        resolve(userHistory.reverse()) // đảo ngược để bài mới nhất lên đầu 
      }, 500)
    })
  }
}