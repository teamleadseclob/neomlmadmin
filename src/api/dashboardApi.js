import axiosInstance from "../config/axiosConfig";

export const getDashboardDataApi = () =>
  axiosInstance.get("/api/admin/dashboard");

export const getRevenueChartApi = (year) =>
  axiosInstance.get(`/api/admin/revenue-chart?year=${year}`);