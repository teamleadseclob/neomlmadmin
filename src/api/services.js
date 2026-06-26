import axiosInstance from "../config/axiosConfig"

export const createEvent = (data) =>
  axiosInstance.post("/api/admin/events", data)

export const uploadFile = (files) => {
  const formData = new FormData()
  const fileArray = Array.isArray(files) ? files : [files]
  fileArray.forEach((file) => formData.append("files", file))
  return axiosInstance.post("/api/admin/upload-multiple", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
}
