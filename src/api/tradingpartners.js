import axiosInstance from "../config/axiosConfig";

export const getMarketInterests = (page = 1, limit = 20) =>
  axiosInstance.get(`/api/admin/market/interests?page=${page}&limit=${limit}`);
