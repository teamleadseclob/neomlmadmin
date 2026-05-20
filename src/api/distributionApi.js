import axiosInstance from "../config/axiosConfig";


export const getDistributionData = async (params = {}) => {
  return axiosInstance.get("/api/admin/roi-config");
}

export const updateRoiDistributionData = async (data) => {
  return axiosInstance.patch("/api/admin/roi-config", data);
}

export const distributeRoi = async () => {
  return axiosInstance.post("/api/admin/roi/distribute");
}

export const distributePoolFund = async (data) => {
  return axiosInstance.post("/api/admin/pool-fund/distribute", data);
}

export const getDistributionHistory = async (params = {}) => {
  return axiosInstance.get("/api/admin/roi/distributions", { params });
}