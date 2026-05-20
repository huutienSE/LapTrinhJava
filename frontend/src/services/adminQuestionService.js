import { apiClient } from "./client.js";

/** Admin question management: GET /questions + /admin/questions* */
export const adminQuestionService = {
  getQuestions: async () => {
    const response = await apiClient.get("/questions");
    return response.data;
  },

  getQuestionsByDescription: async (description) => {
    const response = await apiClient.get("/admin/questions/search", {
      params: { description },
    });
    return response.data;
  },

  createQuestion: async (questionData) => {
    const response = await apiClient.post("/admin/questions", questionData);
    return response.data;
  },

  updateQuestion: async (questionData, questionId) => {
    const response = await apiClient.put(
      `/admin/questions/${questionId}`,
      questionData
    );
    return response.data;
  },

  deleteQuestion: async (questionId) => {
    const response = await apiClient.delete(`/admin/questions/${questionId}`);
    return response.data;
  },
};
