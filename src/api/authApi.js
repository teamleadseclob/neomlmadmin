import axiosInstance from "../config/axiosConfig"

export const loginApi = (userId, password) =>
  axiosInstance.post("/api/auth/login", { userId, password })


export const changePasswordApi = (currentPassword, newPassword, confirmNewPassword) =>
  axiosInstance.patch("/api/admin/change-password", { currentPassword, newPassword, confirmNewPassword })

export const getAdminProfileApi = () =>
  axiosInstance.get("/api/admin/profile")

export const updateAdminProfileApi = (fullName) =>
  axiosInstance.put("/api/admin/profile", { name: fullName })