import { Endpoints } from "@core";
import { IIncome, IIncomesCreate, IIncomesUpdate } from "@interfaces";

import API from "./api";

const IncomesApi = {
    create: async (data: IIncomesCreate) => {
        const result = await API().post<IIncome>(Endpoints.INCOMES, data);
        return result.data;
    },
    delete: async (id: number) => {
        const result = await API().delete(`${Endpoints.INCOMES}/${id}`);
        return result.data;
    },
    restore: async (id: number) => {
        const result = await API().patch(`${Endpoints.INCOMES}/${id}`, { isDeleted: false });
        return result.data;
    },
    update: async (data: Partial<IIncomesUpdate>) => {
        const result = await API().patch(`${Endpoints.INCOMES}/${data.ingresoId}`, data);
        return result.data;
    },
    getAll: async () => {
        const result = await API().get<IIncome[]>(Endpoints.INCOMES);
        return result.data;
    },
    getById: async (id: number) => {
        const result = await API().get<IIncome>(`${Endpoints.INCOMES}/${id}`);
        return result.data;
    },
}

export default IncomesApi;