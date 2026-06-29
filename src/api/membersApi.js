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

export const changePassword = async (id, newPassword) => {
  return axiosInstance.patch(`/api/admin/users/${id}/change-password`, { newPassword });
};

export const changeEmail = async (id, newEmail) => {
  return axiosInstance.patch(`/api/admin/users/${id}/change-email`, { newEmail });
};

export const getTransactions = async (params = {}) => {
  return axiosInstance.get("/api/admin/transactions", { params });
};

export const addUsdt = async (id, amount) => {
  return axiosInstance.post(`/api/admin/users/${id}/add-usdt`, { amount });
};

export const addFund = async (id, field, amount) => {
  return axiosInstance.post(`/api/admin/users/${id}/add-fund`, { field, amount });
};

export const getUserById = async (id) => {
  return axiosInstance.get(`/api/admin/users/${id}`);
};

export const updateEarningCap = async (id, roiEarned, mlrEarned) => {
  const payload = {};
  if (roiEarned !== undefined && roiEarned !== "") payload.roiEarned = roiEarned;
  if (mlrEarned !== undefined && mlrEarned !== "") payload.mlrEarned = mlrEarned;
  return axiosInstance.patch(`/api/admin/users/${id}/earning-cap`, payload);
};
