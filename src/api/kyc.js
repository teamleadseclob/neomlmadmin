import axiosInstance from "../config/axiosConfig"

export const getKycRequests = (page = 1, status = "") => {
  let url = `/api/admin/kyc?page=${page}`
  if (status) url += `&status=${status}`
  return axiosInstance.get(url)
}

export const reviewKyc = (id, data) => {
  return axiosInstance.patch(`/api/admin/kyc/${id}/review`, data)
}

