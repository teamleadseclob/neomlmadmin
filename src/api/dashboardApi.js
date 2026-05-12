import axiosInstance from "../config/axiosConfig";

export const getDashboardDataApi = () =>
  axiosInstance.get("/api/admin/dashboard");

export const getRevenueChartApi = (year) =>
  axiosInstance.get(`/api/admin/revenue-chart?year=${year}`);

export const getusercharts = (days) =>
  axiosInstance.get(`/api/admin/users/join-chart?days=${days}`);

export const recentorders = () => 
  axiosInstance.get("/api/admin/swp-purchases/recent");
