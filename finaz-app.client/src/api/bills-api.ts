
import { Endpoints } from "@core";
import { IBills, IBillsCreate, IBillsUpdate } from "@interfaces";

import API from "./api";

const BillsApi = {
    create: async (data: IBillsCreate) => {
        const result = await API().post(Endpoints.BILLS, data);
        return result.data;
    },
    update: async (data: Partial<IBillsUpdate>) => {
        const result = await API().patch(Endpoints.BILLS, data);
        return result.data;
    },
    getAll: async () => {
        const result = await API().get<IBills[]>(Endpoints.BILLS);
        return result.data;
    }, 
    getById: async (id: number) => {
        const result = await API().get<IBills>(`${Endpoints.BILLS}/${id}`);
        return result.data;
    },
}

export default BillsApi;