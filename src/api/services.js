import axiosInstance from "../config/axiosConfig"

export const createEvent = (data) =>
  axiosInstance.post("/api/admin/events", data)
