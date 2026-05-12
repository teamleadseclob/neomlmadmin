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