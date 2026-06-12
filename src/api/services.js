import axiosInstance from "../config/axiosConfig"

export const createEvent = (data) =>
  axiosInstance.post("/api/admin/events", data)

export const uploadFile = (file) => {
  const formData = new FormData()
  formData.append("file", file)
  return axiosInstance.post("/api/admin/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
}
