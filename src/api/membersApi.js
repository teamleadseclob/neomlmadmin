import axiosInstance from "../config/axiosConfig";

 export const userlist = async (params = {}) => {
  return axiosInstance.get("/api/admin/users", { params });
};

export const blockUser = async (id) => {
  return axiosInstance.patch(`/api/admin/users/${id}/block`);
};

export const unblockUser = async (id) => {
  return axiosInstance.patch(`/api/admin/users/${id}/unblock`);
};

export const getTransactions = async (params = {}) => {
  return axiosInstance.get("/api/admin/transactions", { params });
};

