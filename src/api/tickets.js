import axiosInstance from "../config/axiosConfig";

export const getTickets = async ()=>{
    return axiosInstance.get("/api/admin/support/tickets")
}

export const updateTicket = async (ticketId, data) => {
    return axiosInstance.patch(`/api/admin/support/tickets/${ticketId}`, data)
}

export const getTicketUnreadCount = async () => {
    return axiosInstance.get("/api/admin/support/tickets/counts")
}

export const markAllTicketsRead = async () => {
    return axiosInstance.patch("/api/admin/support/tickets/read-all")
}