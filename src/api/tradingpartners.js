import axiosInstance from "../config/axiosConfig";

export const getMarketInterests = (page = 1, limit = 20) =>
  axiosInstance.get(`/api/admin/market/interests?page=${page}&limit=${limit}`);

export const acceptMarketInterest = (id, data) =>
  axiosInstance.patch(`/api/admin/market/interests/${id}/accept`, data);
