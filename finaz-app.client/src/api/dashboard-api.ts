import { Endpoints } from "@core";
import { IDashboardBalance } from "@interfaces";

import API from "./api";

const DashboardApi = {
    balance: async (startDate: string, endDate: string) => {
        const result = await API().get<IDashboardBalance>(`${Endpoints.PANEL_ADMIN_BALANCE}?inicioFecha=${startDate}&finFecha=${endDate}`);
        return result.data;
    },
}

export default DashboardApi;