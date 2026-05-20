import { apiClient } from "./client.js";

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
