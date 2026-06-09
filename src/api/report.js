import axiosInstance  from "../config/axiosConfig";


export const getTransactionsPdf = async () => {
    return axiosInstance.get("/api/admin/reports/transactions", {
        params: { format: "pdf" },
        responseType: "blob",
    });
};

export const getTransactionsExcel = async () => {
    return axiosInstance.get("/api/admin/reports/transactions", {
        params: { format: "excel" },
        responseType: "blob",
    });
};

export const getRankRewardsPdf = async () => {
    return axiosInstance.get("/api/admin/reports/rank-rewards", {
        params: { format: "pdf" },
        responseType: "blob",
    });
};

export const getRankRewardsExcel = async () => {
    return axiosInstance.get("/api/admin/reports/rank-rewards", {
        params: { format: "excel" },
        responseType: "blob",
    });
};

export const getSwpPackagesPdf = async () => {
    return axiosInstance.get("/api/admin/reports/swp-packages", {
        params: { format: "pdf" },
        responseType: "blob",
    });
};

export const getSwpPackagesExcel = async () => {
    return axiosInstance.get("/api/admin/reports/swp-packages", {
        params: { format: "excel" },
        responseType: "blob",
    });
};

export const getMultilevelRewardsPdf = async () => {
    return axiosInstance.get("/api/admin/reports/multilevel-rewards", {
        params: { format: "pdf" },
        responseType: "blob",
    });
};

export const getMultilevelRewardsExcel = async () => {
    return axiosInstance.get("/api/admin/reports/multilevel-rewards", {
        params: { format: "excel" },
        responseType: "blob",
    });
};

export const getApprovedWithdrawalsPdf = async () => {
    return axiosInstance.get("/api/admin/reports/approved-withdrawals", {
        params: { format: "pdf" },
        responseType: "blob",
    });
};

export const getApprovedWithdrawalsExcel = async () => {
    return axiosInstance.get("/api/admin/reports/approved-withdrawals", {
        params: { format: "excel" },
        responseType: "blob",
    });
};

export const getTradingCapitalProfitPdf = async () => {
    return axiosInstance.get("/api/admin/reports/trading-capital-profit", {
        params: { format: "pdf" },
        responseType: "blob",
    });
};

export const getTradingCapitalProfitExcel = async () => {
    return axiosInstance.get("/api/admin/reports/trading-capital-profit", {
        params: { format: "excel" },
        responseType: "blob",
    });
};

export const getLayeredRewardsPdf = async () => {
    return axiosInstance.get("/api/admin/reports/layered-rewards", {
        params: { format: "pdf" },
        responseType: "blob",
    });
};

export const getLayeredRewardsExcel = async () => {
    return axiosInstance.get("/api/admin/reports/layered-rewards", {
        params: { format: "excel" },
        responseType: "blob",
    });
};

export const getRoyaltyRewardsPdf = async () => {
    return axiosInstance.get("/api/admin/reports/royalty-rewards", {
        params: { format: "pdf" },
        responseType: "blob",
    });
};

export const getRoyaltyRewardsExcel = async () => {
    return axiosInstance.get("/api/admin/reports/royalty-rewards", {
        params: { format: "excel" },
        responseType: "blob",
    });
};

export const getSpecialRewardsPdf = async () => {
    return axiosInstance.get("/api/admin/reports/special-rewards", {
        params: { format: "pdf" },
        responseType: "blob",
    });
};

export const getSpecialRewardsExcel = async () => {
    return axiosInstance.get("/api/admin/reports/special-rewards", {
        params: { format: "excel" },
        responseType: "blob",
    });
};

export const getPoolRewardsPdf = async () => {
    return axiosInstance.get("/api/admin/reports/pool-rewards", {
        params: { format: "pdf" },
        responseType: "blob",
    });
};

export const getPoolRewardsExcel = async () => {
    return axiosInstance.get("/api/admin/reports/pool-rewards", {
        params: { format: "excel" },
        responseType: "blob",
    });
};

export const getManagementFundPdf = async () => {
    return axiosInstance.get("/api/admin/reports/management-fund", {
        params: { format: "pdf" },
        responseType: "blob",
    });
};

export const getManagementFundExcel = async () => {
    return axiosInstance.get("/api/admin/reports/management-fund", {
        params: { format: "excel" },
        responseType: "blob",
    });
};

export const getOperationFundPdf = async () => {
    return axiosInstance.get("/api/admin/reports/operation-fund", {
        params: { format: "pdf" },
        responseType: "blob",
    });
};

export const getOperationFundExcel = async () => {
    return axiosInstance.get("/api/admin/reports/operation-fund", {
        params: { format: "excel" },
        responseType: "blob",
    });
};

export const getAllMembersPdf = async () => {
    return axiosInstance.get("/api/admin/reports/all-members", {
        params: { format: "pdf" },
        responseType: "blob",
    });
};

export const getAllMembersExcel = async () => {
    return axiosInstance.get("/api/admin/reports/all-members", {
        params: { format: "excel" },
        responseType: "blob",
    });
};

export const getReportData = async (reportKey, params = {}) => {
    return axiosInstance.get(`/api/admin/reports/data/${reportKey}`, { params });
};