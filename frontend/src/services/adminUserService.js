import { apiClient } from "./client.js";

/** Admin-only: /admin/users* */
export const adminUserService = {
  getAllUsers: async () => {
    const response = await apiClient.get("/admin/users");
    return response.data;
  },

  getUserByEmail: async (email) => {
    const response = await apiClient.get(`/admin/users/${email}`);
    return response.data;
  },

  updateUserStatus: async (userId) => {
    const response = await apiClient.patch(`/admin/users/${userId}/status`);
    return response.data;
  },
};
