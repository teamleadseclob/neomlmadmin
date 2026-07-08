import axiosInstance from "../config/axiosConfig"

export const uploadNotification = (formData) =>
  axiosInstance.post("/api/admin/notifications", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })

export const getNotifications = () =>
  axiosInstance.get("/api/admin/notifications")

export const deleteNotification = (id) =>
  axiosInstance.delete(`/api/admin/notifications/${id}`)

export const toggleNotification = (id, isEnabled) =>
  axiosInstance.patch(`/api/admin/notifications/${id}/toggle`, { isEnabled })

// Banner APIs
export const getBanners = () =>
  axiosInstance.get("/api/admin/banners")

export const createBanner = (formData) =>
  axiosInstance.post("/api/admin/banners", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })

export const updateBanner = (id, formData) =>
  axiosInstance.patch(`/api/admin/banners/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })

export const deleteBanner = (id) =>
  axiosInstance.delete(`/api/admin/banners/${id}`)
