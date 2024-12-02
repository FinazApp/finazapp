import { Endpoints } from "@core";
import { IDashboardBalance } from "@interfaces";

import API from "./api";

const DashboardApi = {
    summary: async (startDate: string, endDate: string) => {
        const result = await API().get<IDashboardBalance>(`${Endpoints.DASHBOARD_SUMMARY}?inicioFecha=${startDate}&finFecha=${endDate}`);
        return result.data;
    },
    generateReport: async ({ startDate, endDate }: { startDate: string, endDate: string }) => {
        const result = await API().post<{ url: string }>(`${Endpoints.REPORT_CSV}?inicioFecha=${startDate}&finFecha=${endDate}`);
        return result.data;
    },
}

export default DashboardApi;