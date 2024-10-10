
import { Endpoints } from "@core";
import { ICategory } from "@interfaces";

import API from "./api";

const CategoriesApi = {
    getAll: async () => {
        const result = await API().get<ICategory[]>(Endpoints.CATEGORIES);
        return result.data;
    },
}

export default CategoriesApi;