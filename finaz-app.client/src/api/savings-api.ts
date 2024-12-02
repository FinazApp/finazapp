import { Endpoints } from "@core";
import { ISavingGoal } from "@interfaces";

import API from "./api";

const SavingsApi = {
    create: async (data: ISavingGoal) => {
        const result = await API().post(Endpoints.SAVINGS, data);
        return result.data;
    },
    delete: async (id: number) => {
        const result = await API().delete(`${Endpoints.SAVINGS}/${id}`);
        return result.data;
    },
    restore: async (id: number) => {
        const result = await API().post(`${Endpoints.SAVINGS}/Restore/${id}`);
        return result.data;
    },
    update: async (data: Partial<ISavingGoal>) => {
        const result = await API().patch(`${Endpoints.SAVINGS}/${data.metaId}`, data);
        return result.data;
    },
    getAll: async () => {
        const result = await API().get<ISavingGoal[]>(Endpoints.SAVINGS);
        return result.data;
    },
    getById: async (id: number) => {
        const result = await API().get<ISavingGoal>(`${Endpoints.SAVINGS}/${id}`);
        return result.data;
    },
}

export default SavingsApi;