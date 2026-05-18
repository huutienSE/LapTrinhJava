import { apiClient } from "./client.js";

/** Learner practice sessions: /user/practice* */
export const practiceService = {
  getHistory: async () => {
    const response = await apiClient.get("/user/practice/history");
    return response.data;
  },

  getSessionDetail: async (sessionId) => {
    const response = await apiClient.get(`/user/practice/session/${sessionId}`);
    return response.data;
  },

  /** Backend chưa bật — gọi khi POST /user/practice/start sẵn sàng */
  start: async (topicId) => {
    const response = await apiClient.post("/user/practice/start", { topicId });
    return response.data;
  },
};
