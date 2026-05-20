import axiosInstance from "../config/axiosConfig";

export const swplist = async () => {
    return axiosInstance.get("/api/admin/level-commissions")};

export const swpUpdate = async (level, data) => {
    return axiosInstance.patch(`/api/admin/level-commissions/${level}`, data)};


export const mlrlist = async () => {
    return axiosInstance.get("/api/admin/multilevel-rewards/config")};

export const mlrUpdate = async (level, data) => {
    return axiosInstance.patch(`/api/admin/multilevel-rewards/config/${level}`, data)};

export const swpPackages = async () => {
    return axiosInstance.get("/api/admin/swp/packages")};