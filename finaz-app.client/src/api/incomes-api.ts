
import { Endpoints } from "@core";
import { IIncomes, IIncomesCreate, IIncomesUpdate } from "@interfaces";

import API from "./api";

const IncomesApi = {
    create: async (data: IIncomesCreate) => {
        const result = await API().post(Endpoints.INCOMES, data);
        return result.data;
    },
    update: async (data: Partial<IIncomesUpdate>) => {
        const result = await API().patch(Endpoints.INCOMES, data);
        return result.data;
    },
    getAll: async () => {
        const result = await API().get<IIncomes[]>(Endpoints.INCOMES);
        return result.data;
    }, 
    getById: async (id: number) => {
        const result = await API().get<IIncomes>(`${Endpoints.INCOMES}/${id}`);
        return result.data;
    },
}

export default IncomesApi;