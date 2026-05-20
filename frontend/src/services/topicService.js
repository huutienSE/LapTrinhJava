import { apiClient } from "./client.js";

/** Shared read APIs: GET /topics* (learner + admin) */
export const topicService = {
  getTopics: async () => {
    const response = await apiClient.get("/topics");
    return response.data;
  },

  getTopicById: async (topicId) => {
    const response = await apiClient.get(`/topics/${topicId}`);
    return response.data;
  },

  getQuestionsByTopic: async (topicId) => {
    const response = await apiClient.get(`/topics/${topicId}/questions`);
    return response.data;
  },
};
