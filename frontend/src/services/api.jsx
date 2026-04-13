// Giả lập một database nhỏ trong bộ nhớ
// const MOCK_USER = {
//   email: "admin@gmail.com",
//   password: "123"
// };
import { MOCK_USER, MOCK_TOPICS, MOCK_SENTENCES, MOCK_HISTORY } from "./mockData"

export const authService = {
  // Giả lập API Đăng nhập
  login: async (credentials) => {
    return new Promise((resolve, reject) => {
      console.log("Calling API Login với dữ liệu:", credentials);
      
      setTimeout(() => {

        const user = MOCK_USER.find((u) => 
          {return u.email === credentials.email && u.password === credentials.password}
        )

        console.log(user)
        if (user) {
          resolve({ success: true, message: "Đăng nhập thành công!", user: user});
        } else {
          reject({ success: false, message: "Email hoặc mật khẩu không đúng!" });
        }
      }, 1000);
    });
  },

  // Giả lập API Đăng ký
  register: async (userData) => {
    return new Promise((resolve, reject) => {
      console.log("Calling API Register với dữ liệu:", userData);
      
      setTimeout(() => {
        // Luôn trả về thành công trong bản giả lập
        const newUser = MOCK_USER.find((u) => 
           u.email === userData.email
        )

        if (!newUser) {
          resolve({ success: true, message: "Đăng ký tài khoản thành công!" });
          MOCK_USER.push(userData)
          console.log(MOCK_USER)
        } else {
          reject({success: false, message:"Email đã được sử dụng!"})
        }
        
      }, 1500);
    });
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