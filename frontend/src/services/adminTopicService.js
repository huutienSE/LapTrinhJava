import { apiClient } from "./client.js";

/** Admin-only: POST|PUT|DELETE|search /admin/topics* */
export const adminTopicService = {
  getTopicByTopicName: async (topicName) => {
    const response = await apiClient.get("/admin/topics/search", {
      params: { topicName },
    });
    return response.data;
  },

  createTopic: async (topicData) => {
    const response = await apiClient.post("/admin/topics", topicData);
    return response.data;
  },

  updateTopic: async (topicId, topicData) => {
    const response = await apiClient.put(`/admin/topics/${topicId}`, topicData);
    return response.data;
  },

  deleteTopic: async (topicId) => {
    const response = await apiClient.delete(`/admin/topics/${topicId}`);
    return response.data;
  },
};
