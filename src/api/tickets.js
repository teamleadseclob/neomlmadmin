import axiosInstance from "../config/axiosConfig";

export const getTickets = async ()=>{
    return axiosInstance.get("/api/admin/support/tickets")
}

export const updateTicket = async (ticketId, data) => {
    return axiosInstance.patch(`/api/admin/support/tickets/${ticketId}`, data)
}