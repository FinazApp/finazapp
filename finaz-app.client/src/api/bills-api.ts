import { Endpoints } from "@core";
import { IBill, IBillCreate, IBillUpdate } from "@interfaces";

import API from "./api";

const BillsApi = {
    create: async (data: IBillCreate) => {
        const result = await API().post(Endpoints.BILLS, data);
        return result.data;
    },
    delete: async (id: number) => {
        const result = await API().delete(`${Endpoints.BILLS}/${id}`);
        return result.data;
    },
    restore: async (id: number) => {
        const result = await API().patch(`${Endpoints.BILLS}/${id}`, { isDeleted: false });
        return result.data;
    },
    update: async (data: Partial<IBillUpdate>) => {
        const result = await API().patch(`${Endpoints.BILLS}/${data.gastoId}`, data);
        return result.data;
    },
    getAll: async () => {
        const result = await API().get<IBill[]>(Endpoints.BILLS);
        return result.data;
    },
    getById: async (id: number) => {
        const result = await API().get<IBill>(`${Endpoints.BILLS}/${id}`);
        return result.data;
    },
}

export default BillsApi;