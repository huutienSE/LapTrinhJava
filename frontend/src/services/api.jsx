import axios from "axios";

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
      const status = error.response?.status;

      // URL request hiện tại
      const requestUrl = error.config?.url || "";
      
      const isAuthRequest = requestUrl.includes("/auth/login");

      // Chỉ logout khi:
      // - token hết hạn / không hợp lệ
      // - KHÔNG phải request login/register
      if (
          (status === 401 || status === 403) &&
          !isAuthRequest
      ) {

          // Xóa dữ liệu đăng nhập
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          // Redirect về login
          window.location.href = "/login";
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
    const response = await apiClient.get(`/user/practice/session/${sessionId}`);
    return response.data;
  },

};

export const profileService = {
  create: async (profileData) => {
    const response = await apiClient.post("/user/profile/create", profileData);
    return response.data;
  },

  getById: async (profileId) => {
    const response = await apiClient.get(`/user/profile/${profileId}`);
    return response.data;
  },

  update: async (profileId, profileData) => {
    const response = await apiClient.put(
      `/user/profile/${profileId}`,
      profileData
    );
    return response.data;
  },

  getMe: async () => {
    const response = await apiClient.get("/user/profile/me");
    return response.data;
  },
};

export const assessmentService = {
  start: async () => {
    const response = await apiClient.post("/user/assessment/start");
    return response.data;
  },

  commit: async (payload) => {
    const response = await apiClient.post("/user/assessment/commit", payload);
    return response.data;
  },

  getHistory: async () => {
    const response = await apiClient.get("/user/assessment/history");
    return response.data;
  },

  getDetail: async (assessmentId) => {
    const response = await apiClient.get(`/user/assessment/${assessmentId}`);
    return response.data;
  },

  submitAnswer: async (sessionId, answerData) => {
    const response = await apiClient.post(
      `/user/assessment/${sessionId}/answers`,
      answerData
    );
    return response.data;
  },
};

// --- SPEAKING SERVICE (learner topics & questions) ---
export const speakingService = {
  getTopics: async () => {
    const response = await apiClient.get("/topics");
    return response.data;
  },

  getQuestionsByTopic: async (topicId) => {
    const response = await apiClient.get(`/topics/${topicId}/questions`);
    return response.data;
  },

  /** @deprecated Use getQuestionsByTopic */
  getSentences: async (topicId) => {
    const response = await apiClient.get(`/topics/${topicId}/questions`);
    return response.data;
  },
};


export const adminService = {

    // TOPICS

    getTopics: async () => {
        const response = await apiClient.get("/topics");
        return response.data;
    },

    getTopicByTopicName: async (topicName) => {
        const response = await apiClient.get(
          "/topics/search",
          { 
            params: {
              topicName: topicName
            }
          }
        );
        return response.data;
    },

    createTopic: async (topicData) => {
      console.log("in createTopic")
        const response = await apiClient.post(
            "/topics",
            topicData
        );

        return response.data;
    },

    updateTopic: async (topicId, topicData) => {
        const response = await apiClient.put(
            `/topics/${topicId}`,
            topicData
        );

        return response.data;
    },

    deleteTopic: async (topicId) => {
        const response = await apiClient.delete(
            `/topics/${topicId}`
        );

        return response.data;
    },

    // QUESTION 

    getQuestions: async () => {
        const response = await apiClient.get('/questions');
        return response.data;
    },
    
    getQuestionsByDescription: async (value) => {
        const response = await apiClient.get(
          "/questions/search", {
            params: {
              description: value
            }
          }
        );
        return response.data;
    }
    ,

    createQuestion: async (questionData) => {
        const response = await apiClient.post('/questions', questionData);
        return response.data;
    },

    updateQuestion: async (questionData, questionId) => {
        const response = await apiClient.put(
          `/questions/${questionId}`,
          questionData
        );
        return response.data
    },

    deleteQuestion: async (questionId) => {
        const response = await apiClient.delete(
          `/questions/${questionId}`,
          questionId
        );
        return response.data;
    },

    // User
    getAllUsers: async () => {
      const response = await apiClient.get("/users");
      return response.data;
    },

    getUserByEmail: async (email) => {
      const response = await apiClient.get(
        `/users/${email}`
      );
      return response.data;
    },

    updateUserStatus: async (userId) => {
      const response = await apiClient.patch(`/users/${userId}/status`);
      return response.data;
    },
};


