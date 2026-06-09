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

export const getPoolConfig = async () => {
  return axiosInstance.get("/api/admin/pool-config");
}

export const updatePoolConfig = async (percentage) => {
  return axiosInstance.patch("/api/admin/pool-config", { percentage });
}

export const distributePoolFund = async () => {
  return axiosInstance.post("/api/admin/pool-fund/distribute");
}

export const getRankBonusAmountConfig = async () => {
  return axiosInstance.get("/api/admin/rank-bonus/amount-config");
}

export const updateRankBonusAmountConfig = async (amount) => {
  return axiosInstance.patch("/api/admin/rank-bonus/amount-config", { amount });
}

export const distributeMultiReward = async () => {
  return axiosInstance.post("/api/admin/rank-bonus/distribute");
}

export const getRankBonusHistory = async (params = {}) => {
  return axiosInstance.get("/api/admin/rank-bonus/history", { params });
}

export const getDistributionHistory = async (params = {}) => {
  return axiosInstance.get("/api/admin/roi/distributions", { params });
}

export const poolfundpreview = async (percentage) => {
  return axiosInstance.get("/api/admin/pool-fund/preview", { params: { percentage } });
}