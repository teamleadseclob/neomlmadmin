import axios from "axios"

const axiosInstance = axios.create({
  // baseURL: "http://192.168.29.36:5001",
  baseURL: "https://backend.neofiacademy.com",
  headers: { "Content-Type": "application/json" },
})

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear()
      globalThis.location.href = "/login"
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
