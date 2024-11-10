import { Endpoints } from "@core";
import { ICategory, ICategoryCreate } from "@interfaces";

import API from "./api";

const CategoriesApi = {
    getAll: async () => {
        const result = await API().get<ICategory[]>(Endpoints.CATEGORIES);
        return result.data;
    },
    getById: async (id: number) => {
        const result = await API().get<ICategory>(`${Endpoints.CATEGORIES}/${id}`);
        return result.data;
    },
    create: async (data: ICategoryCreate) => {
        const result = await API().post(Endpoints.CATEGORIES, data);
        return result.data;
    },
    delete: async (id: number) => {
        const result = await API().delete(`${Endpoints.CATEGORIES}/${id}`);
        return result.data;
    },
    restore: async (id: number) => {
        const result = await API().patch(`${Endpoints.CATEGORIES}/${id}`, { isDeleted: false });
        return result.data;
    },
    update: async (data: Partial<ICategory>) => {
        const result = await API().patch(`${Endpoints.CATEGORIES}/${data.categoriaId}`, data);
        return result.data;
    },
}

export default CategoriesApi;