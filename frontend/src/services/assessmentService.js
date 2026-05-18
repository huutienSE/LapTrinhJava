import { apiClient } from "./client.js";

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
