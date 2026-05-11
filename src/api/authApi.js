import axiosInstance from "../config/axiosConfig"

export const loginApi = (userId, password) =>
  axiosInstance.post("/api/auth/login", { userId, password })
