import { apiClient } from "./client.js";

/** Learner practice sessions: /user/practice* */
export const practiceService = {
  /** POST /user/practice/start — tạo session, nhận 10 câu ngẫu nhiên */
  start: async (topicId) => {
    const response = await apiClient.post("/user/practice/start", { topicId });
    return response.data;
  },

  /** POST /user/practice/{sessionId}/answers — nộp câu trả lời, nhận feedback */
  answerQuestion: async (sessionId, answerData) => {
    const response = await apiClient.post(
      `/user/practice/${sessionId}/answers`,
      answerData
    );
    return response.data;
  },

  /** POST /user/practice/commit — kết thúc session, nhận điểm tổng */
  commit: async (payload) => {
    const response = await apiClient.post("/user/practice/commit", payload);
    return response.data;
  },

  /** GET /user/practice/history — lịch sử luyện tập */
  getHistory: async () => {
    const response = await apiClient.get("/user/practice/history");
    return response.data;
  },

  /** GET /user/practice/session/{sessionId} — chi tiết session */
  getSessionDetail: async (sessionId) => {
    const response = await apiClient.get(`/user/practice/session/${sessionId}`);
    return response.data;
  },
};
