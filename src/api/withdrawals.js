import axiosInstance from "../config/axiosConfig";

export const getWithdrawals = async (params = {}) => {
  return axiosInstance.get("/api/admin/withdrawals", { params });
};

export const approveWithdrawal = async (id) => {
  return axiosInstance.patch(`/api/admin/withdrawals/${id}/approve`);
};

export const rejectWithdrawal = async (id, reason) => {
  return axiosInstance.patch(`/api/admin/withdrawals/${id}/reject`, { reason });
};

export const bulkApproveWithdrawals = async (withdrawalIds) => {
  return axiosInstance.post("/api/admin/withdrawals/bulk-approve", { withdrawalIds });
};
